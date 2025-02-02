﻿namespace LarpakeServer.Services.Options;

public class AttendanceKeyOptions
{
    public const string SectionName = "AttendanceKey";

    public int KeyLength { get; set; }
    public int KeyLifetimeHours { get; set; }
    public string Header { get; set; } = "";

    public int ValidFullKeyLength => KeyLength + Header.Length;

}
