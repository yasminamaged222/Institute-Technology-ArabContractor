using AutoMapper;
using Institute.API.Helpers;
using Institute.Application.Interfaces;
using Institute.Application.Interfaces.IService;
using Institute.Application.Services;
using Institute.Infrastructure;
using Institute.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System;

var builder = WebApplication.CreateBuilder(args);

// ======= DbContext =======
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// ======= Controllers & Swagger =======
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
//// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
#region( Dependency Injecton ) 
builder.Services.AddScoped(typeof(IRepository<>), typeof(BaseRepository<>));
builder.Services.AddScoped(typeof(IReadOnlyService<>), typeof(ReadOnlyService<>));
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<NewsPictureUrlResolver>();

#endregion
#region(Authentication And Authorization)
builder.Services.AddAuthentication("Bearer")
.AddJwtBearer("Bearer", options =>
{
    options.Authority = "https://YOUR_CLERK_DOMAIN.clerk.accounts.dev";
    options.TokenValidationParameters = new()
    {
        ValidateAudience = false
    };
});
#endregion

// ======= AutoMapper =======
builder.Services.AddAutoMapper(cfg =>
{
    cfg.AddProfile<MappingProfiles>();
});


// ======= Build App =======
var app = builder.Build();

// ======= Middleware =======
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthentication();    
app.UseStaticFiles();
app.UseAuthorization();

app.MapControllers();

app.Run();

