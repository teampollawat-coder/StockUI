using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories;

public class ReservationRepository(ShopDb db) : IReservationRepository
{
    public Task<List<CartItem>> ListByClientAsync(string clientId) =>
        db.Reservations.Where(r => r.ClientId == clientId)
            .Select(r => new CartItem(r.ProductCode, r.Quantity)).ToListAsync();

    public async Task<Reservation?> FindAsync(string clientId, string code) =>
        await db.Reservations.FindAsync(clientId, code);

    public Task<List<Reservation>> ListExpiredAsync(DateTime cutoff) =>
        db.Reservations.Where(r => r.UpdatedAt < cutoff).ToListAsync();

    public Task<List<ReceiptLine>> GetReceiptLinesAsync(string clientId) =>
        (from r in db.Reservations
         join p in db.Products on r.ProductCode equals p.Code
         where r.ClientId == clientId
         orderby p.Code
         select new ReceiptLine(p.Code, p.Name, p.Price, r.Quantity, p.Price * r.Quantity)).ToListAsync();

    public void Add(Reservation reservation) => db.Reservations.Add(reservation);
    public void Remove(Reservation reservation) => db.Reservations.Remove(reservation);
    public void RemoveRange(IEnumerable<Reservation> reservations) => db.Reservations.RemoveRange(reservations);

    public Task RenewClientAsync(string clientId, DateTime now) =>
        db.Reservations.Where(r => r.ClientId == clientId)
            .ExecuteUpdateAsync(r => r.SetProperty(x => x.UpdatedAt, now));

    public Task DeleteByClientAsync(string clientId) =>
        db.Reservations.Where(r => r.ClientId == clientId).ExecuteDeleteAsync();

    public Task DeleteAllAsync() => db.Reservations.ExecuteDeleteAsync();
}
