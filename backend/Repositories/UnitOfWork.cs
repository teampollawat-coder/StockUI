using Backend.Data;
using Microsoft.EntityFrameworkCore.Storage;

namespace Backend.Repositories;

public class UnitOfWork(ShopDb db) : IUnitOfWork
{
    public Task<IDbContextTransaction> BeginTransactionAsync() => db.Database.BeginTransactionAsync();
    public Task SaveChangesAsync() => db.SaveChangesAsync();
}
