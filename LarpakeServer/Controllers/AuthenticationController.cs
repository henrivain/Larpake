﻿using LarpakeServer.Data;
using LarpakeServer.Extensions;
using LarpakeServer.Identity;
using LarpakeServer.Models.DatabaseModels;
using LarpakeServer.Models.GetDtos.SingleItem;
using LarpakeServer.Models.PostDtos;
using System.Security.Claims;
using DbUser = LarpakeServer.Models.DatabaseModels.User;

namespace LarpakeServer.Controllers;

[ApiController]
[Route("api")]
public class AuthenticationController : ExtendedControllerBase
{
    readonly TokenService _tokenService;
    readonly IUserDatabase _userDb;
    readonly IRefreshTokenDatabase _refreshTokenDb;

    public AuthenticationController(
        TokenService generator,
        IUserDatabase userDb,
        IRefreshTokenDatabase refreshTokenDb,
        IClaimsReader claimsReader,
        ILogger<AuthenticationController> logger) : base(claimsReader, logger)
    {
        _tokenService = generator;
        _userDb = userDb;
        _refreshTokenDb = refreshTokenDb;
    }


    [HttpPost("sign-up")]
    [AllowAnonymous]
    public async Task<IActionResult> CreateUser([FromBody] UserPostDto dto)
    {
        // TODO: This should be handled differently when I know how

        var record = DbUser.MapFrom(dto);
        Result<Guid> result = await _userDb.Insert(record);
        if (result)
        {
            _logger.LogInformation("Created new user {id}", (Guid)result);
            return CreatedId((Guid)result);
        }
        return FromError(result);
    }



    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest dto)
    {
        // TODO: Validate request and user

        if (dto.UserId == Guid.Empty)
        {
            return BadRequest(new
            {
                Message = "UserId must be provided."
            });
        }

        User? user = await _userDb.Get(dto.UserId);
        if (user is null)
        {
            return NotFound(new
            {
                Message = "User not found."
            });
        }

        // Generate tokens
        TokenGetDto tokens = _tokenService.GenerateTokens(user);

        _logger.LogInformation("User {id} logged in.", user.Id);

        // Finish by saving refresh token
        return await SaveToken(user, tokens, Guid.Empty);
    }


    [HttpPost("token/refresh")]
    public async Task<IActionResult> Refresh([FromBody] TokenPostDto dto)
    {
        // TODO: RateLimit this
        // TODO: Refresh token should be read from http only cookie and access token from header (probably)

        // Validate expired access token 
        if (_tokenService.ValidateAccessToken(dto.AccessToken, out ClaimsPrincipal? claims, false) is false)
        {
            return Unauthorized();
        }

        // Get user id from token
        Guid? userId = _tokenService.GetUserId(claims);
        DateTime? expires = _tokenService.GetTokenIssuedAt(claims);
        if (userId is null || expires is null)
        {
            return Unauthorized();
        }

        // Check if possible refresh token must be expired
        if (expires.Value.Add(_tokenService.RefreshTokenLifetime) < DateTime.UtcNow)
        {
            return Unauthorized();
        }

        // Validate refresh token
        var validation = await _refreshTokenDb.IsValid(userId.Value, dto.RefreshToken);
        if (validation.IsValid is false)
        {
            return Unauthorized();
        }


        // Tokens are valid, generate new ones
        User? user = await _userDb.Get(userId.Value);
        if (user is null)
        {
            return IdNotFound("User does not exist.");
        }

        // Generate new tokens
        TokenGetDto newTokens = _tokenService.GenerateTokens(user);

        _logger.LogInformation("Refreshed tokens for user {id}.", user.Id);

        // TODO: Set refresh token to http only cookie

        // Finish by saving refresh token
        return await SaveToken(user, newTokens, validation.TokenFamily.Value);
    }


    [Authorize]
    [HttpPost("token/invalidate")]
    public async Task<IActionResult> InvalidateTokens()
    {
        Guid userId = _claimsReader.ReadAuthorizedUserId(Request);
        int rowsAffected = await _refreshTokenDb.RevokeUserTokens(userId);
        return OkRowsAffected(rowsAffected);
    }



    private async Task<IActionResult> SaveToken(User user, TokenGetDto tokens, Guid tokenFamily)
    {
        Guard.ThrowIfNull(user);
        Guard.ThrowIfNull(tokens);
        Guard.ThrowIfNull(tokens.RefreshTokenExpiresAt);

        // Save refresh token
        var result = await _refreshTokenDb.Add(new RefreshToken
        {
            UserId = user.Id,
            Token = tokens.RefreshToken,
            InvalidAt = tokens.RefreshTokenExpiresAt.Value,
            TokenFamily = tokenFamily
        });

        if (result.IsError)
        {
            return FromError(result);
        }
        return Ok(tokens);
    }
}

