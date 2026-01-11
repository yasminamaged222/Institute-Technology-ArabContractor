using Institute.Application.Interfaces;
using Institute.Application.Interfaces.IService;
using Institute.Domain.Entities;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Institute.Application.Services
{
    public class BookService : IBookService
    {
        private readonly IRepository<Book> _repository;

        public BookService(IRepository<Book> repository)
        {
            _repository = repository;
        }
        public Task<IEnumerable> GetAll()
        {
            throw new NotImplementedException();
        }

        public Task GetById(int id)
        {
            throw new NotImplementedException();
        }
    }
}
