using AutoMapper;
using Institute.API.DTOs;
using Institute.API.Helpers;
using Institute.Application.Interfaces;
using Institute.Application.Interfaces.IService;
using Institute.Application.Services;
using Institute.Infrastructure;
using Institute.Infrastructure.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Text;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);

// ======= DbContext =======
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// ======= Controllers & Swagger =======
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "أدخل الـ JWT token هنا"
    });

    c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

#region (CORS)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalhost",
        builder => builder
            .WithOrigins(
                "http://localhost:5173",
                "https://acwebsite-icmet-test.azurewebsites.net"
            )
            .AllowAnyHeader()
            .AllowAnyMethod());
});
#endregion

#region (Dependency Injection)
builder.Services.AddScoped(typeof(IRepository<>), typeof(BaseRepository<>));
builder.Services.AddScoped(typeof(IReadOnlyService<>), typeof(ReadOnlyService<>));
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<NewsPictureUrlResolver<NewsListDto>>();
builder.Services.AddScoped<NewsPictureUrlResolver<NewsDetailsDto>>();
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
    });

builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<ICurrentUserService, CurrentUserService>();
builder.Services.AddScoped<ILecturerService, LecturerService>();
builder.Services.AddHttpClient<ClerkService>();
builder.Services.AddScoped(typeof(IClerkService), typeof(ClerkService));
builder.Services.AddScoped<ICheckoutService, CheckoutService>();
builder.Services.AddScoped<ICartService, CartService>();
builder.Services.AddScoped<IAdminService, AdminService>();
builder.Services.AddScoped<BankPaymentService>();
builder.Services.Configure<PaymentSettings>(builder.Configuration.GetSection("PaymentSettings"));
builder.Services.AddHttpClient("BankClient", client =>
{
    var paymentSettings = builder.Configuration.GetSection("PaymentSettings").Get<PaymentSettings>();
    if (paymentSettings == null) throw new Exception("PaymentSettings section not found in configuration.");

    client.BaseAddress = new Uri(paymentSettings.BaseUrl);
    client.DefaultRequestHeaders.Add("Accept", "application/json");

    var authValue = Convert.ToBase64String(
        Encoding.ASCII.GetBytes($"merchant.{paymentSettings.MerchantId}:{paymentSettings.ApiPassword}")
    );
    client.DefaultRequestHeaders.Authorization =
        new System.Net.Http.Headers.AuthenticationHeaderValue("Basic", authValue);
});
#endregion

#region (Authentication And Authorization)
builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Authority = builder.Configuration["Clerk:Authority"];
        options.RequireHttpsMetadata = true;
        options.MapInboundClaims = false;

        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            NameClaimType = "sub"
        };

        options.Events = new JwtBearerEvents
        {
            OnAuthenticationFailed = context =>
            {
                Console.WriteLine("❌ AUTH FAILED");
                Console.WriteLine(context.Exception.Message);
                return Task.CompletedTask;
            },
            OnTokenValidated = context =>
            {
                Console.WriteLine("✅ TOKEN VALIDATED");
                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization();
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

app.UseStaticFiles();
app.UseCors("AllowLocalhost");
app.UseHttpsRedirection();
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.MapFallbackToFile("index.html");

app.Run();