﻿using System.ComponentModel.DataAnnotations;

namespace LarpakeServer.Models.QueryOptions;

public class EventQueryOptions : QueryOptions
{
    public DateTime? Before { get; set; } = null;
    public DateTime? After { get; set; } = null;

    [MinLength(3)]
    [MaxLength(30)]
    public string? Title { get; set; } = null;
    public bool DoMinimize { get; set; } = false;

}
