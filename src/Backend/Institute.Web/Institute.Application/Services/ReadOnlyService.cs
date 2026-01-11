using Institute.Application.Interfaces;
using Institute.Domain.specifications;
using System.Collections.Generic;
using System.Threading.Tasks;

using Microsoft.EntityFrameworkCore;
using Institute.Infrastructure;

public class ReadOnlyService<T> : IReadOnlyService<T> where T : class
{
    private readonly IRepository<T> _repository;

    public ReadOnlyService(IRepository<T> repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<T>> GetAll()
    {
        return await _repository.GetAllAsync();
    }

    public async Task<T> GetById(int id)
    {
        return await _repository.GetByIdAsync(id);
    }

    public async Task<IReadOnlyList<T>> GetAllWithSpec(Ispecification<T> spec)
    {
        return await _repository.GetAllWithSpecAsync(spec);
    }

    public async Task<T?> GetEntityWithSpec(Ispecification<T> spec)
    {
        return await _repository.GetByIdWithSpecAsync(spec);
    }
}
