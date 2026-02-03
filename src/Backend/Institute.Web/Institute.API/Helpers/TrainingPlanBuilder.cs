using Institute.API.DTOs;
using Institute.Domain.Entities;

namespace Institute.API.Helpers
{
    public static class TrainingPlanBuilder
    {
        // =========================================================
        // ENTRY POINT
        // =========================================================
        public static TrainingPlanResponseDto Build(
            List<Planwork> planworks,
            List<PlanFile> files)
        {
            var root = planworks.FirstOrDefault(x => x.ParentId == null);

            return new TrainingPlanResponseDto
            {
                Title = root?.ServiceTitle,
                Categories = GetCategories(planworks, files, root!.ChildId)
            };
        }

        // =========================================================
        // CATEGORIES
        // =========================================================
        private static List<CategoryDto> GetCategories(
            List<Planwork> planworks,
            List<PlanFile> files,
            int rootId)
        {
            return planworks
                .Where(x => x.ParentId == rootId && x.MainFlag == true)
                .OrderBy(x => x.Priority)
                .Select(cat =>
                {
                    var programTypes = GetProgramTypes(planworks, files, cat.ChildId);

                    // ✅ Categories عندها ProgramTypes (زي المهندسين)
                    if (programTypes.Any())
                    {
                        return new CategoryDto
                        {
                            Id = cat.ChildId,
                            Name = cat.ServiceTitle,
                            ProgramTypes = programTypes
                        };
                    }

                    // ✅ Categories بدون ProgramTypes (Direct Axes)
                    return new CategoryDto
                    {
                        Id = cat.ChildId,
                        Name = cat.ServiceTitle,
                        ProgramTypes = new List<ProgramTypeDto>
                        {
                            new ProgramTypeDto
                            {
                                Id = cat.ChildId,
                                Name = null,
                                Axes = GetAxes(planworks, files, cat.ChildId)
                            }
                        }
                    };
                })
                .ToList();
        }

        // =========================================================
        // PROGRAM TYPES
        // =========================================================
        private static List<ProgramTypeDto> GetProgramTypes(
            List<Planwork> planworks,
            List<PlanFile> files,
            int categoryId)
        {
            return planworks
                .Where(x =>
                    x.ParentId == categoryId &&
                    x.MainFlag == true &&
                    x.DetailsFlag == false
                )
                .OrderBy(x => x.Priority)
                .Select(pt =>
                {
                    // ✅ برامج عامة
                    if (pt.ServiceTitle != null && pt.ServiceTitle.Contains("عامة"))
                    {
                        return new ProgramTypeDto
                        {
                            Id = pt.ChildId,
                            Name = pt.ServiceTitle,
                            Axes = GetAxes(planworks, files, pt.ChildId)
                        };
                    }

                    // ✅ برامج تأهيلية / غيرها
                    return new ProgramTypeDto
                    {
                        Id = pt.ChildId,
                        Name = pt.ServiceTitle,
                        Programs = GetPrograms(planworks, files, pt.ChildId)
                    };
                })
                .ToList();
        }

        // =========================================================
        // AXES (برامج عامة)
        // =========================================================
        private static List<AxisDto> GetAxes(
            List<Planwork> planworks,
            List<PlanFile> files,
            int parentId)
        {
            return planworks
                .Where(x =>
                    x.ParentId == parentId &&
                    x.MainFlag == true &&
                    x.DetailsFlag == false
                )
                .OrderBy(x => x.Priority)
                .Select(axis => new AxisDto
                {
                    Id = axis.ChildId,
                    Name = axis.ServiceTitle,
                    Courses = GetCoursesRecursive(planworks, files, axis.ChildId)
                })
                .ToList();
        }

        // =========================================================
        // PROGRAMS (برامج تأهيلية)
        // =========================================================
        private static List<ProgramDto> GetPrograms(
            List<Planwork> planworks,
            List<PlanFile> files,
            int programTypeId)
        {
            return planworks
                .Where(x =>
                    x.ParentId == programTypeId &&
                    x.DetailsFlag == true
                )
                .OrderBy(x => x.Priority)
                .Select(p => new ProgramDto
                {
                    Id = p.ChildId,
                    Name = p.ServiceTitle,
                    Courses = GetCoursesRecursive(planworks, files, p.ChildId)
                })
                .ToList();
        }

        // =========================================================
        // COURSES - WRAPPER (IMPORTANT ✅)
        // =========================================================
        private static List<CourseDto> GetCoursesRecursive(
            List<Planwork> planworks,
            List<PlanFile> files,
            int parentId)
        {
            return GetCoursesRecursive(
                planworks,
                files,
                parentId,
                new HashSet<int>()
            );
        }

        // =========================================================
        // COURSES - INTERNAL RECURSIVE
        // =========================================================
        private static List<CourseDto> GetCoursesRecursive(
            List<Planwork> planworks,
            List<PlanFile> files,
            int parentId,
            HashSet<int> visited)
        {
            var result = new List<CourseDto>();

            // ✅ Loop protection
            if (visited.Contains(parentId))
                return result;

            visited.Add(parentId);

            // ✅ Direct courses
            var directCourses = planworks
                .Where(x =>
                    x.ParentId == parentId &&
                    x.DetailsFlag == false &&
                    x.CourseDate != null
                )
                .OrderBy(x => x.Priority)
                .Select(c => MapCourse(c, files))
                .ToList();

            result.AddRange(directCourses);

            // ✅ Children (organizational nodes)
            var childrenIds = planworks
                .Where(x =>
                    x.ParentId == parentId &&
                    x.CourseDate == null
                )
                .Select(x => x.ChildId)
                .ToList();

            foreach (var childId in childrenIds)
            {
                result.AddRange(
                    GetCoursesRecursive(planworks, files, childId, visited)
                );
            }

            return result;
        }

        // =========================================================
        // MAP COURSE
        // =========================================================
        private static CourseDto MapCourse(
            Planwork c,
            List<PlanFile> files)
        {
            return new CourseDto
            {
                Id = c.ChildId,
                Title = c.ServiceTitle,
                Description = c.CourseDesc,
                Place = c.CoursePlace,
                Date = c.CourseDate,
                Days = c.CourseDays,
                Content = c.CourseContent,
                Cost = c.PlanCost,
                OnSale = c.PlanSale,
                Files = files
                    .Where(f => f.PlanId == c.ChildId)
                    .OrderBy(f => f.FilePeriorty)
                    .Select(f => new CourseFileDto
                    {
                        Title = f.FileTitle,
                        FileName = f.FileName
                    })
                    .ToList()
            };
        }
    }
}