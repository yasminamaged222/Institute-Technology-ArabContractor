# Backend - Institute Courses Platform

## Overview
This folder contains the backend application of the project. 
The backend is built with ASP.NET Core and follows Clean Architecture principles.

### Folder Structure
```
Institute.API      --> Web API controllers
Institute.Application --> Business logic, interfaces, DTOs, Features
Institute.Domain   --> Entities, Enums, BaseEntity
Institute.Infrastructure --> EF Core, DbContext, Repositories
```
### Database Informations


# Institute.Web Architecture

Institute.Web (Solution)
│
├─ **Institute.API**           ← ASP.NET Core Web API
│   ├─ Controllers
│   │    ├─ AuthController.cs
│   │    ├─ CourseController.cs
│   │    └─ PaymentController.cs
│   ├─ Program.cs
│   └─ appsettings.json
│
├─ **Institute.Application**   ← Business Logic / Services
│   ├─ Interfaces
│   │    ├─ IUserService.cs
│   │    ├─ ICoursePurchaseService.cs
│   │    └─ IPaymentService.cs
│   ├─ Services
│   │    ├─ UserService.cs
│   │    ├─ CoursePurchaseService.cs
│   │    └─ PaymentService.cs
│   └─ DTOs
│
├─ **Institute.Domain**        ← Domain Entities
│   ├─ Common
│   ├─ Entities
│   │    ├─ User.cs
│   │    ├─ CoursePurchase.cs
│   │    └─ Payment.cs
│   └─ Enums
│
└─ **Institute.Infrastructure** ← EF Core, DbContext, Repositories
    ├─ Legacy                  ← Scaffolded Entities (Planwork, Course)
    │    └─ Entities
    │         ├─ Planwork.cs
    │         └─ Course.cs
    └─ AppDbContext.cs         ← DbContext للجداول الجديدة
