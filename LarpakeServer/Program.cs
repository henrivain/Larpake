using LarpakeServer.Extensions;
using LarpakeServer.Helpers;
using Scalar.AspNetCore;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
ConfigurationManager configuration = builder.Configuration;

builder.Services.AddControllers();
builder.Services.AddOpenApi();


builder.Services.AddServices(configuration);
builder.Services.AddRepositories(configuration);
builder.Services.ConfigureCors();

builder.Services.AddRouting(options =>
{
    options.LowercaseUrls = true;
});


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference(options =>
    {
        options.WithTitle(configuration["Scalar-OpenApi:Title"]!);
    });
}

// TODO: Add exception handling middleware

app.UseCors("CorsPolicy");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
