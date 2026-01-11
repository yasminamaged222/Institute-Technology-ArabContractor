using Institute.Domain.specifications;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Institute.Application.Interfaces
{
    public interface IRepository<T> where T : class
    {
        Task<IEnumerable<T>> GetAllAsync();
        Task<T?> GetByIdAsync(int id);
        Task AddAsync(T entity);
        void Update(T entity);
        void Delete(T entity);





        Task<T> GetByIdWithSpecAsync(Ispecification<T> spec);
        Task<IReadOnlyList<T>> GetAllWithSpecAsync(Ispecification<T> spec);

        Task<int> GetCountAsync(Ispecification<T> spec);



    }
}
