﻿using LarpakeServer.Data;
using LarpakeServer.Extensions;
using LarpakeServer.Identity;
using LarpakeServer.Models.DatabaseModels;
using LarpakeServer.Models.GetDtos.MultipleItems;
using LarpakeServer.Models.QueryOptions;

namespace LarpakeServer.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
[RequiresPermissions(Permissions.CommonRead)]
public class StatisticsController : ExtendedControllerBase
{
    readonly IStatisticsService _statisticsService;
    readonly IFreshmanGroupDatabase _groupDb;

    public StatisticsController(
        IClaimsReader claimsReader,
        IStatisticsService statisticsService,
        IFreshmanGroupDatabase groupDb,
        ILogger<ExtendedControllerBase> logger) : base(claimsReader, logger)
    {
        _statisticsService = statisticsService;
        _groupDb = groupDb;
    }

    [HttpGet("larpakkeet/own/points/averages")]
    [RequiresPermissions(Permissions.CommonRead)]
    public async Task<IActionResult> GetAllAttendedLarpakeAverages()
    {
        Guid userId = GetRequestUserId();
        var records = await _statisticsService.GetAttendendLarpakeAvgPoints(userId);
        return Ok(records);
    }
    
    [HttpGet("larpakkeet/{larpakeId}/points/average")]
    [RequiresPermissions(Permissions.ReadStatistics)]
    public async Task<IActionResult> GetAllAverage(long larpakeId)
    {
        long? points = await _statisticsService.GetAveragePoints(larpakeId);
        if (points is null)
        {
            return IdNotFound();
        }
        return Ok(new { AvgPoints = points });
    }

    [HttpGet("larpakkeet/own/points/totals")]
    [RequiresPermissions(Permissions.CommonRead)]
    public async Task<IActionResult> GetAllAttendedLarpakeTotals()
    {
        Guid userId = GetRequestUserId();
        var records = await _statisticsService.GetAttendendLarpakeTotalPoints(userId);
        return Ok(records);
    }

    [HttpGet("larpakkeet/{larpakeId}/points")]
    [RequiresPermissions(Permissions.ReadStatistics)]
    public async Task<IActionResult> GetAllTotal(long larpakeId)
    {
        long? points = await _statisticsService.GetTotalPoints(larpakeId);
        if (points is null)
        {
            return IdNotFound();
        }
        return Ok(new { TotalPoints = points });
    }



    [HttpGet("users/own/points")]
    public async Task<IActionResult> GetUserTotal()
    {
        Guid userId = GetRequestUserId();
        return await GetUserTotal(userId);
    }

    [HttpGet("users/{userId}/points")]
    [RequiresPermissions(Permissions.ReadStatistics)]
    public async Task<IActionResult> GetUserTotal(Guid userId)
    {
        long? points = await _statisticsService.GetUserPoints(userId);
        return points is null
            ? IdNotFound() : Ok(new { Points = points });
    }

    [HttpGet("users/leading/points")]
    [RequiresPermissions(Permissions.ReadStatistics)]
    public async Task<IActionResult> GetLeadingUserPoints([FromQuery] StatisticsQueryOptions options)
    {
        long[] records = await _statisticsService.GetLeadingUserPoints(options);
        return Ok(new LeadersGetDto<long>(records, options));
    }

    [HttpGet("users/leading")]
    [RequiresPermissions(Permissions.ReadStatistics)]
    public async Task<IActionResult> GetLeadingUsers([FromQuery] StatisticsQueryOptions options)
    {
        var records = await _statisticsService.GetLeadingUsers(options);
        return Ok(new LeadersGetDto<UserPoints>(records, options));
    }



    [HttpGet("groups/{groupId}/points")]
    public async Task<IActionResult> GetFreshmanGroupTotal(long groupId)
    {
        /* User must have permissions to read 
         * statistics or be a member of the requested group
         */
        if (GetRequestPermissions().Has(Permissions.ReadStatistics))
        {
            Guid[]? groupMembers = await _groupDb.GetMembers(groupId);
            if (groupMembers is null)
            {
                return IdNotFound();
            }
            if (groupMembers.Contains(GetRequestUserId()) is false)
            {
                return Unauthorized("Not group member.");
            }
        }

        var result = await _statisticsService.GetFreshmanGroupPoints(groupId);
        return result is null
            ? IdNotFound() : Ok(result);
    }

    [HttpGet("groups/leading")]
    [RequiresPermissions(Permissions.ReadStatistics)]
    public async Task<IActionResult> GetLeadingFreshmanGroups([FromQuery] StatisticsQueryOptions options)
    {
        var records = await _statisticsService.GetLeadingGroups(options);
        return Ok(new LeadersGetDto<GroupPoints>(records, options));
    }

}
