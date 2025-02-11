﻿using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.OpenApi;
using Microsoft.OpenApi.Models;
using System.Diagnostics;

namespace LarpakeServer.Identity;

internal sealed class LarpakeIdBearerSecuritySchemeTransformer : IOpenApiDocumentTransformer
{
    private readonly IAuthenticationSchemeProvider _provider;

    public LarpakeIdBearerSecuritySchemeTransformer(IAuthenticationSchemeProvider provider)
    {
        _provider = provider;
    }

    public async Task TransformAsync(
        OpenApiDocument document,
        OpenApiDocumentTransformerContext context,
        CancellationToken cancellationToken)
    {
        var authenticationSchemes = await _provider.GetAllSchemesAsync();

        // Validate bearer scheme exists
        if (authenticationSchemes.All(x => x.Name is not Constants.Auth.LarpakeIdScheme))
        {
            Debug.WriteLine($"Bearer scheme {Constants.Auth.LarpakeIdScheme} not found");
            return;
        }

        var requirements = new Dictionary<string, OpenApiSecurityScheme>
        {
            ["Bearer"] = new OpenApiSecurityScheme
            {
                Type = SecuritySchemeType.Http,
                Scheme = "Bearer",
                In = ParameterLocation.Header,
                BearerFormat = "JWT",
            }
        };

        document.Components ??= new();
        document.Components.SecuritySchemes = requirements;

        var key = new OpenApiSecurityScheme
        {
            Reference = new OpenApiReference
            {
                Id = Constants.Auth.LarpakeIdScheme, // The default scheme used
                Type = ReferenceType.SecurityScheme
            }
        };
        var operationRequirement = new OpenApiSecurityRequirement
        {
            [key] = []
        };

        var operations = document.Paths.Values.SelectMany(x => x.Operations);
        foreach (var (_, operation) in operations)
        {
            operation.Security.Add(operationRequirement);
        }
    }
}
