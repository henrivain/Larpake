﻿using LarpakeServer.Models.DatabaseModels;

namespace LarpakeServer.Models.GetDtos;

public class LarpakeEventGetDto : LarpakeEvent
{
    internal static LarpakeEventGetDto From(LarpakeEvent record)
    {
        return (LarpakeEventGetDto)record;
    }
}
