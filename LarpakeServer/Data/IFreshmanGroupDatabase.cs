﻿using LarpakeServer.Helpers.Generic;
using LarpakeServer.Models.DatabaseModels;
using LarpakeServer.Models.QueryOptions;

namespace LarpakeServer.Data;

public interface IFreshmanGroupDatabase
{
    Task<FreshmanGroup[]> GetGroups(FreshmanGroupQueryOptions options);
    Task<FreshmanGroup?> GetGroup(long id);
    Task<Guid[]?> GetMembers(long id);
    Task<Result<long>> Insert(FreshmanGroup record);
    Task<Result<int>> InsertMembers(long id, Guid[] members);
    Task<Result<int>> InsertHiddenMembers(long groupId, Guid[] members);
    Task<Result<int>> Update(FreshmanGroup record);
    Task<int> Delete(long id);
    Task<int> DeleteMembers(long id, Guid[] members);
}
