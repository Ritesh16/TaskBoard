using AutoMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System;
using TaskBoard.Data;
using TaskBoard.Data.Interfaces;
using TaskBoard.Data.Mock;
using TaskBoard.Service;
using TaskBoard.Service.Interfaces;
using TaskBoard.Service.Profiles;

var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration;

// Add services to the container.

builder.Services.AddControllers();

var key = configuration["Jwt:Key"];
if (string.IsNullOrEmpty(key))
    throw new InvalidOperationException("JWT key is not configured (Jwt:Key).");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = configuration["Jwt:Issuer"],
            ValidAudience = configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(key))
        };
    });

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


builder.Services.AddAutoMapper(typeof(MappingProfiles));

var connectionString = configuration.GetConnectionString("Default");
if(string.IsNullOrEmpty(connectionString))
    throw new InvalidOperationException("Database connection string is not configured.");

builder.Services.AddSingleton<IUserRepository>(u =>
{
    return new UserRepository(connectionString);
});

builder.Services.AddSingleton<ICategoryRepository>(u =>
{
    return new CategoryRepository(connectionString);
});

builder.Services.AddSingleton<ITaskRepository>(u =>
{
    return new TaskRepository(connectionString);
});

//builder.Services.AddSingleton<ICategoryRepository, CategoryRepositoryMock>();
//builder.Services.AddSingleton<ITaskRepository, TaskRepositoryMock>();
builder.Services.AddSingleton<ITaskScheduleRepository, TaskScheduleRepositoryMock>();

builder.Services.AddSingleton<IAccountService, AccountService>();
builder.Services.AddSingleton<ICategoryService, CategoryService>();
builder.Services.AddSingleton<ITaskService, TaskServiceMock>();
builder.Services.AddSingleton<ITaskScheduleService, TaskScheduleService>();
builder.Services.AddSingleton<ITokenService, TokenService>();

var app = builder.Build();

var cors = configuration["Cors"];
if (string.IsNullOrEmpty(cors))
    throw new InvalidOperationException("JWT key is not configured (Jwt:cors).");

app.UseCors(x => x.AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials()
        .WithOrigins(cors));


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Authentication must come before Authorization
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
