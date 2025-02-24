﻿namespace LarpakeServer.Services.Options;

public class IntegrationOptions
{
    public const string SectionName = "ExternalIntergationService";

    public string BasePath { get; set; } = Constants.Luuppi.BaseUrl;
    public string? ApiKey { get; set; } = "This value is undefined";
    public string CmsApiUrlGuess { get; set; } = Constants.Luuppi.CmsApi;
    public string EventHeader { get; set; } = Constants.Luuppi.EventHeader;

    public bool OverrideFromEnvironment()
    {
        bool changed = false;
        string? apiKey = Environment.GetEnvironmentVariable(Constants.Environment.LuuppiApiKey);
        if (apiKey is not null)
        {
            ApiKey = apiKey;
            changed = true;
        }
        return changed;
    }
}
