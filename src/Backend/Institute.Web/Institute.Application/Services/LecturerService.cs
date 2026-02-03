using Institute.Application.Interfaces;
using Institute.Application.Interfaces.IService;
using Institute.Domain.Entities;
using Institute.Infrastructure.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Institute.Application.Services
{
    public class LecturerService : ILecturerService
    {
        private readonly IRepository<Lecturer> _context;

        public LecturerService(IRepository<Lecturer> context)
        {
            _context = context;
        }

        public async Task<IEnumerable<LecturerResponseDto>> GetAllAsync()
        {
            var lecturers = await _context.GetAllAsync();

            return lecturers.Select(l => new LecturerResponseDto
            {
                Id = l.LecturerId,
                Name = l.LecturerName,
                Pic = l.LecturerPic,
                Course = l.LecturerCourse,
                MainEdu = l.LecturerMainEdu,
                Edu = l.LecturerEdu,
                Details = l.LecturerDetails,
                Telephone = l.Telephone,
                Email = l.Email
            });
        }

        public async Task<LecturerResponseDto?> GetByIdAsync(int id)
        {
            var l = await _context.GetByIdAsync(id);

            if (l == null)
                return null;

            return new LecturerResponseDto
            {
                Id = l.LecturerId,
                Name = l.LecturerName,
                Pic = l.LecturerPic,
                Course = l.LecturerCourse,
                MainEdu = l.LecturerMainEdu,
                Edu = l.LecturerEdu,
                Details = l.LecturerDetails,
                Telephone = l.Telephone,
                Email = l.Email
            };
        }
    }
}
