using AutoMapper;
using Institute.API.DTOs;
using Institute.Domain.Entities;



namespace Institute.API.Helpers

{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<Book, BookResponseDto>()
             .ForMember(dest => dest.TypeName, opt => opt.MapFrom(src => src.BooksType.TypeName));

            CreateMap<Dailynews, NewsListDto>()
           .ForMember(d => d.Id,
               o => o.MapFrom(s => s.NewsId)) // أو DailynewsId
           .ForMember(d => d.Title,
               o => o.MapFrom(s => s.ATitel)) // اسم العمود الحقيقي
           .ForMember(d => d.PublishedAt,
               o => o.MapFrom(s => s.NewsDate))
           .ForMember(dest => dest.ImageUrl, opt => opt.MapFrom<NewsPictureUrlResolver<NewsListDto>>());


            CreateMap<Cart, CartDto>();
            CreateMap<CartItem, CartItemDto>()
                .ForMember(dest => dest.CourseName,
                    opt => opt.MapFrom(src => src.Planwork != null ? src.Planwork.ServiceTitle : null))
                .ForMember(dest => dest.CourseImage,
                    opt => opt.MapFrom(src => src.Planwork != null && src.Planwork.Files.Any()
                        ? src.Planwork.Files.OrderBy(f => f.FilePeriorty).FirstOrDefault()!.FileName
                        : null))
                .ForMember(dest => dest.OriginalPrice,
                    opt => opt.MapFrom(src => src.Planwork != null
                        ? (src.Planwork.PlanCost ?? src.Price)
                        : src.Price));


            CreateMap<Dailynews, NewsDetailsDto>()
    .ForMember(d => d.Id,
        o => o.MapFrom(s => s.NewsId))
    .ForMember(d => d.Title,
        o => o.MapFrom(s => s.ATitel))
    .ForMember(d => d.Details,
        o => o.MapFrom(s => s.ADetails)) // اسم العمود الحقيقي
    .ForMember(d => d.PublishedAt,
        o => o.MapFrom(s => s.NewsDate))
    .ForMember(d => d.ImageUrl,
        o => o.MapFrom<NewsPictureUrlResolver<NewsDetailsDto>>());


        }
    }
}