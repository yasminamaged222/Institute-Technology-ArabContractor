using AutoMapper;
using Institute.API.DTOs;
using Institute.Domain.Entities;



namespace Institute.API.Helpers

{
    public class MappingProfiles:Profile
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
