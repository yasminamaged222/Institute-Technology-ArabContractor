using System.Collections.Generic;
using System.Threading.Tasks;

public interface IReadOnlyService<T> where T : class
{
    Task<IEnumerable<T>> GetAll();
    Task<T> GetById(int id);
}