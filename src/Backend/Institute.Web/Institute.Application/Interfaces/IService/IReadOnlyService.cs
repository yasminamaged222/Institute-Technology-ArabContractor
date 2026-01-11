using Institute.Domain.specifications;
using System.Collections.Generic;
using System.Threading.Tasks;

public interface IReadOnlyService<T> where T : class
{
    Task<IEnumerable<T>> GetAll();
    Task<T> GetById(int id);
    Task<IReadOnlyList<T>> GetAllWithSpec(Ispecification<T> spec);
    Task<T?> GetEntityWithSpec(Ispecification<T> spec);
   // Task<int> GetCountAsync(Ispecification<T> spec);
}