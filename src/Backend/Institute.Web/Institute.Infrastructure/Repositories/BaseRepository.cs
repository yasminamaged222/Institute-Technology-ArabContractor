using Institute.Application.Interfaces;
using Institute.Domain.specifications;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Institute.Infrastructure.Repositories
{
    public class BaseRepository<T> : IRepository<T> where T : class
    {
        protected readonly AppDbContext _context;
        protected readonly DbSet<T> _dbSet;

        public BaseRepository(AppDbContext context)
        {
            _context = context;
            _dbSet = _context.Set<T>();
        }

        public async Task<IEnumerable<T>> GetAllAsync() => await _dbSet.ToListAsync();

        public async Task<T?> GetByIdAsync(int id) => await _dbSet.FindAsync(id);

        public async Task AddAsync(T entity) => await _dbSet.AddAsync(entity);

        public void Update(T entity) => _dbSet.Update(entity);

        public void Delete(T entity) => _dbSet.Remove(entity);

        //add methods for specifications desgin pattern

        //get all with spec method
        public async Task<IReadOnlyList<T>> GetAllWithSpecAsync(Ispecification<T> spec)
           => await ApplySpecification(spec).ToListAsync();

        //get by id with spec method
        public async Task<T> GetByIdWithSpecAsync(Ispecification<T> spec)
           => await ApplySpecification(spec).FirstOrDefaultAsync();

        //get count with spec method
        public async Task<int> GetCountAsync(Ispecification<T> spec)
            => await ApplySpecification(spec).CountAsync();

        private IQueryable<T> ApplySpecification(Ispecification<T> spec)
        {
            // هنا DbContext هو اللي يعمل Set<T>()
            return SpecificationEvaluator<T>.GetQuery(_context.Set<T>().AsQueryable(), spec);
        }
    }
}
