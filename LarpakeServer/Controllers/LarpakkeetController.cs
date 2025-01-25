﻿using LarpakeServer.Data;
using LarpakeServer.Extensions;
using LarpakeServer.Identity;
using LarpakeServer.Models.DatabaseModels;
using LarpakeServer.Models.GetDtos.MultipleItems;
using LarpakeServer.Models.PostDtos;
using LarpakeServer.Models.PutDtos;
using LarpakeServer.Models.QueryOptions;

namespace LarpakeServer.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class LarpakkeetController : ExtendedControllerBase
{
    readonly ILarpakeDatabase _db;

    public LarpakkeetController(
        ILarpakeDatabase db,
        IClaimsReader claimsReader,
        ILogger<LarpakkeetController>? logger = null) : base(claimsReader, logger)
    {
        _db = db;
    }

    [HttpGet]
    [RequiresPermissions(Permissions.ReadAllData)]
    public async Task<IActionResult> Get(LarpakeQueryOptions options)
    {
        /* Name search is only allowed for admins.
         */

        if (GetRequestPermissions().Has(Permissions.Admin) is false)
        {
            options.Title = null;
        }

        var records = await _db.GetLarpakkeet(options);
        var result = LarpakkeetGetDto.MapFrom(records);
        result.SetNextPaginationPage(options);
        return Ok(result);
    }

    [HttpGet("own")]
    [RequiresPermissions(Permissions.CommonRead)]
    public async Task<IActionResult> Get()
    {
        var options = new LarpakeQueryOptions
        {
            ContainsUser = GetRequestUserId()
        };
        return await Get(options);
    }


    [HttpGet("{larpakeId}")]
    [RequiresPermissions(Permissions.ReadAllData)]
    public async Task<IActionResult> Get(long larpakeId)
    {
        var record = await _db.GetLarpake(larpakeId);
        if (record is null)
        {
            return IdNotFound();
        }
        return Ok(record);
    }
    
    [HttpPost]
    [RequiresPermissions(Permissions.CreateLarpake)]
    public async Task<IActionResult> Create([FromBody] LarpakePostDto record)
    {
        var larpake = Larpake.From(record);
        var result = await _db.InsertLarpake(larpake);
        return result.MatchToResponse(
            ok: CreatedId,
            error: FromError);
    }

    [HttpPut("{larpakeId}")]
    [RequiresPermissions(Permissions.CreateLarpake)]
    public async Task<IActionResult> Update(long larpakeId, [FromBody] LarpakePutDto record)
    {
        var larpake = Larpake.From(record);
        larpake.Id = larpakeId;
        var result = await _db.UpdateLarpake(larpake);
        return result.MatchToResponse(
            ok: OkRowsAffected,
            error: FromError);
    }


    [HttpDelete("{larpakeId}")]
    [RequiresPermissions(Permissions.DeleteLarpake)]
    public async Task<IActionResult> Delete(long larpakeId)
    {
        int rowsAffected = await _db.DeleteLarpake(larpakeId);
        return OkRowsAffected(rowsAffected);
    }

    [HttpPost("{larpakeId}/sections")]
    [RequiresPermissions(Permissions.CreateLarpake)]
    public async Task<IActionResult> CreateSection(long larpakeId, [FromBody] LarpakeSectionPostDto dto)
    {
        var record = LarpakeSection.From(dto, larpakeId);
        var result = await _db.InsertSection(record);
        return result.MatchToResponse(
            ok: CreatedId,
            error: FromError);
    }

    [HttpPut("{larpakeId}/sections")]
    [RequiresPermissions(Permissions.CreateLarpake)]
    public async Task<IActionResult> UpdateSection(long larpakeId, [FromBody] LarpakeSectionPutDto dto)
    {
        var record = LarpakeSection.From(dto, larpakeId);
        var result = await _db.UpdateSection(record);
        return result.MatchToResponse(
            ok: OkRowsAffected,
            error: FromError);
    }

    [HttpDelete("sections/{sectionId}")]
    [RequiresPermissions(Permissions.DeleteLarpake)]
    public async Task<IActionResult> DeleteSection(long sectionId)
    {
        int rowsAffected = await _db.DeleteSection(sectionId);
        return OkRowsAffected(rowsAffected);
    }
}
