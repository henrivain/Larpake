﻿using LarpakeServer.Models.DatabaseModels;
using LarpakeServer.Models.GetDtos;
using Microsoft.IdentityModel.Tokens;
using System.Diagnostics.CodeAnalysis;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;

namespace LarpakeServer.Identity;

public class TokenService : IClaimsReader
{
    readonly IConfiguration _config;
    readonly ILogger<TokenService> _logger;
    readonly int _refreshTokenLength;
    const string BearerPrefix = "Bearer ";

    public TimeSpan AccessTokenLifetime { get; }
    public TimeSpan RefreshTokenLifetime { get; }

    public TokenService(IConfiguration config, ILogger<TokenService> logger)
    {
        _config = config;
        _logger = logger;

        AccessTokenLifetime = TimeSpan.FromMinutes(
            _config.GetValue<int>("Jwt:AccessTokenLifetimeMinutes"));

        RefreshTokenLifetime = TimeSpan.FromDays(
            _config.GetValue<int>("Jwt:RefreshTokenLifetimeDays"));

        _refreshTokenLength = _config.GetValue<int>("JWT:RefreshTokenByteLength");
    }

    public string GenerateToken(User user)
    {
        JwtSecurityTokenHandler tokenHandler = new();

        byte[] key = Encoding.UTF8.GetBytes(_config["Jwt:SecretKey"]!);

        List<Claim> claims = [
            new (JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new (JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new (Constants.PermissionsFieldName, ((int)user.Permissions).ToString()),
            new (Constants.StartYearFieldName, user.StartYear?.ToString() ?? "null"),
        ];

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.Add(AccessTokenLifetime),
            IssuedAt = DateTime.UtcNow,
            Issuer = _config.GetValue<string>("Jwt:Issuer"),
            Audience = _config.GetValue<string>("Jwt:Audience"),
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256Signature)
        };

        SecurityToken token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }

    public string GenerateRefreshToken()
    {
        var number = new byte[_refreshTokenLength];
        using var gen = RandomNumberGenerator.Create();
        gen.GetBytes(number);
        return Convert.ToBase64String(number);
    }


    public TokenGetDto GenerateTokens(User user)
    {
        Guard.ThrowIfNull(user);

        string accessToken = GenerateToken(user);
        string refreshToken = GenerateRefreshToken();
        DateTime refreshExpires = DateTime.UtcNow.Add(RefreshTokenLifetime);
        DateTime accessExpires = DateTime.UtcNow.Add(AccessTokenLifetime);

        return new TokenGetDto(accessExpires, refreshExpires)
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken,
        };
    }


    public bool ValidateAccessToken(string token, [NotNullWhen(true)]out ClaimsPrincipal? claims, bool validateExpiration = true)
    {
        Guard.ThrowIfNull(token);

        // Create token handler and clear default mappings (e.g. "name" -> "some/xmlsoap/string")
        JwtSecurityTokenHandler tokenHandler = new();
        tokenHandler.InboundClaimTypeMap.Clear();

        // Get secret key
        byte[] key = Encoding.UTF8.GetBytes(_config["Jwt:SecretKey"]!);

        // Set validation parameters
        var validationParameters = new TokenValidationParameters
        {
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ValidIssuer = _config["Jwt:Issuer"],
            ValidAudience = _config["Jwt:Audience"],
            ValidateIssuerSigningKey = true,
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = validateExpiration
        };


        // Token might have "Bearer <token>" format, remove it
        if (token.StartsWith(BearerPrefix))
        {
            token = token[BearerPrefix.Length..];
        }

        // Validate
        try
        {
            claims = tokenHandler.ValidateToken(token, validationParameters, out _);
            return true;
        }
        catch (Exception ex)
        {
            if (ex is SecurityTokenValidationException or ArgumentException)
            {
                _logger.LogInformation("Token invalidated because of: {msg}", ex.Message);
                claims = null;
                return false;
            }
            throw;
        }
    }


    public Guid? GetUserId(ClaimsPrincipal principal)
    {
        Guard.ThrowIfNull(principal);
        
        Claim? idClaim = principal.FindFirst(JwtRegisteredClaimNames.Sub);
        if (idClaim is null)
        {
            return null;
        }
        _ = Guid.TryParse(idClaim.Value, out Guid id);
        return id;
    }

    public Permissions? GetUserPermissions(ClaimsPrincipal principal)
    {
        Guard.ThrowIfNull(principal);

        Claim? permissionsClaim = principal.FindFirst(Constants.PermissionsFieldName);
        if (permissionsClaim is null)
        {
            return null;
        }
        if (int.TryParse(permissionsClaim.Value, out int permissions) is false)
        {
            return null;
        }
        return (Permissions)permissions;
    }

    public DateTime? GetTokenIssuedAt(ClaimsPrincipal principal)
    {
        Guard.ThrowIfNull(principal);

        Claim? iatClaim = principal.FindFirst(JwtRegisteredClaimNames.Iat);
        if (iatClaim is null)
        {
            return null;
        }
        if (long.TryParse(iatClaim.Value, out long iat) is false)
        {
            return null;
        }
        return DateTimeOffset.FromUnixTimeSeconds(iat).DateTime;
    }

    public int? GetUserStartYear(ClaimsPrincipal principal)
    {
        Guard.ThrowIfNull(principal);

        Claim? syClaim = principal.FindFirst(Constants.StartYearFieldName);
        if (syClaim is null)
        {
            return null;
        }
        if (int.TryParse(syClaim.Value, out int startYear) is false)
        {
            return null;
        }
        return startYear;
    }
}
