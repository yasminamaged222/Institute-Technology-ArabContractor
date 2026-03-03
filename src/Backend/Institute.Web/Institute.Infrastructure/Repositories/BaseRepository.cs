using Institute.Application.Interfaces;
using Institute.Domain.Entities;
using Institute.Domain.specifications;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
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

        public async Task<IEnumerable<T>> GetAllAsync()
            => await _dbSet.AsNoTracking().ToListAsync();
        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
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

        public async Task<bool> AnyAsync(Expression<Func<T, bool>> predicate)
        {
            return await _context.Set<T>().AnyAsync(predicate);
        }

        public async Task<IReadOnlyList<T>> ListAsync(Ispecification<T> spec)
        {
            IQueryable<T> query = _context.Set<T>();

            // apply criteria
            if (spec.Criteria != null)
                query = query.Where(spec.Criteria);

            // apply includes
            foreach (var include in spec.Includes)
                query = query.Include(include);

            return await query.ToListAsync();
        }
        public async Task<AppUser?> GetByClerkIdAsync(string clerkUserId)
        {
            return await _context.AppUsers
                .FirstOrDefaultAsync(u => u.ClerkUserId == clerkUserId);
        }

        public async Task<int> CountAsync()
        {
            return await _context.Set<T>().CountAsync();
        }

        public async Task<int> CountWithSpecAsync(Ispecification<T> spec)
        {
            var query = SpecificationEvaluator<T>.GetQuery(
                _context.Set<T>().AsQueryable(), spec);

            return await query.CountAsync();
        }

    }
}
