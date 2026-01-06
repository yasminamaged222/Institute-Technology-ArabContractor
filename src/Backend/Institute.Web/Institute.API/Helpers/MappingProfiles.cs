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


            //CreateMap<Dailynews, NewsDetailsDto>()
            //    .ForMember(d => d.Date, o => o.MapFrom(s => s.NewsDate))
            //    .ForMember(d => d.Title, o => o.MapFrom(s => s.ATitel))
            //    .ForMember(d => d.Details, o => o.MapFrom(s => s.ADetails))
            //    .ForMember(d => d.Image,
            //        o => o.MapFrom(s =>
            //            s.NewsPics.FirstOrDefault(p => p.StartUpPic == true)!.ImageName));
            CreateMap<Dailynews, NewsListDto>()
                        .ForMember(dest => dest.ImageName, opt => opt.MapFrom<NewsPictureUrlResolver>());
                            //src.NewsPics
                            //    .OrderBy(p => p.PicPeriorty)
                            //    .Select(p => p.ImageName)
                            //    .FirstOrDefault()
                           
                        


        }
    }
}
