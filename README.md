# Aamin Ambulance Emergency Dispatch System (EADS)

A comprehensive, production-ready emergency ambulance dispatch system for Aamin Ambulance in Somalia.

## 🚑 System Overview

This is a full-stack emergency medical dispatch system that manages ambulance operations, handles emergency requests, assigns drivers and nurses, tracks request lifecycle, supports referral management, and provides admin dashboard with analytics.

## 🏗️ Architecture

### Frontend (Next.js 14)
- **Framework**: Next.js with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: React Hook Form + Zod
- **Data Tables**: TanStack Table
- **Charts**: Recharts
- **HTTP Client**: Axios

### Backend (NestJS)
- **Framework**: NestJS with modular architecture
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with Role-Based Access Control (RBAC)
- **Validation**: class-validator + class-transformer
- **API Documentation**: Swagger/OpenAPI

### Database (PostgreSQL)
- **Database Name**: Aamin01
- **Port**: 5432
- **ORM**: Prisma

## 🎯 Core Features

### Emergency Request Workflow
1. Patient submits emergency request
2. Dispatcher receives and reviews request
3. System suggests nearest available ambulance
4. Dispatcher assigns ambulance + driver
5. Driver accepts and updates status
6. Patient is transported to hospital
7. Referral to hospital is recorded
8. Case is completed

### Status Tracking
- **PENDING** - Request received, awaiting assignment
- **ASSIGNED** - Ambulance and driver assigned
- **ON_THE_WAY** - Ambulance en route to pickup
- **ARRIVED** - Ambulance at pickup location
- **PICKED_UP** - Patient in ambulance
- **TRANSPORTING** - En route to hospital
- **AT_HOSPITAL** - Arrived at hospital
- **COMPLETED** - Case closed successfully

### User Roles & Permissions
- **ADMIN**: Full system control
- **DISPATCHER**: Manage requests, assign resources
- **DRIVER**: Handle assigned cases, update status
- **NURSE**: Medical care coordination
- **PATIENT**: Submit requests, track status

## 📁 Project Structure

```
Aamin01W/
├── frontend/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/            # App Router pages
│   │   │   ├── admin/     # Admin dashboard pages
│   │   │   ├── api/       # API routes (if needed)
│   │   │   └── (public)/ # Public website pages
│   │   ├── components/     # Reusable UI components
│   │   │   ├── ui/        # shadcn/ui components
│   │   │   ├── layout/    # Layout components
│   │   │   └── sections/  # Page sections
│   │   └── lib/           # Utilities and helpers
│   ├── package.json
│   ├── tailwind.config.js
│   └── tsconfig.json
└── backend/                 # NestJS backend application
    ├── src/
    │   ├── auth/           # Authentication module
    │   ├── users/          # User management
    │   ├── employees/      # Employee management
    │   ├── ambulances/     # Ambulance fleet
    │   ├── patients/       # Patient records
    │   ├── emergency-requests/ # Core request handling
    │   ├── referrals/      # Hospital referrals
    │   ├── notifications/  # System notifications
    │   ├── reports/        # Analytics and reports
    │   └── prisma/        # Database service
    ├── prisma/
    │   └── schema.prisma   # Database schema
    ├── package.json
    └── tsconfig.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Database Setup
1. Install PostgreSQL and create database:
   ```sql
   CREATE DATABASE Aamin01;
   ```

2. Set up environment variables:
   ```bash
   # backend/.env
   DATABASE_URL="postgresql://username:password@localhost:5432/Aamin01"
   JWT_SECRET="your-super-secret-jwt-key"
   JWT_EXPIRES_IN="7d"
   PORT=3001
   FRONTEND_URL=http://localhost:3000
   ```

### Backend Setup
```bash
cd backend
npm install
npx prisma generate
npx prisma db push
npm run start:dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Emergency Requests
- `GET /api/emergency-requests` - List all requests
- `GET /api/emergency-requests/:id` - Get request by ID
- `POST /api/emergency-requests` - Create new request
- `PATCH /api/emergency-requests/:id/assign` - Assign ambulance/driver
- `PATCH /api/emergency-requests/:id/status` - Update status
- `GET /api/emergency-requests/track/:trackingCode` - Track by code

### Resources
- `GET/POST/PATCH/DELETE /api/ambulances` - Ambulance management
- `GET/POST/PATCH/DELETE /api/employees` - Employee management
- `GET/POST/PATCH/DELETE /api/patients` - Patient management
- `GET/POST/PATCH/DELETE /api/referrals` - Referral management

## 🎨 UI Components

### Public Website
- **Home**: Hero section with emergency contact
- **About**: Company information and services
- **Contact**: Contact form and information
- **Hire Ambulance**: Service booking form
- **Tracking**: Real-time request tracking

### Admin Dashboard
- **Dashboard**: KPI cards, charts, recent requests
- **Ambulances**: Fleet management with status tracking
- **Employees**: Staff management with role assignment
- **Patients**: Patient records and history
- **Emergency Requests**: Request management with assignment
- **Referrals**: Hospital referral tracking
- **Notifications**: System notifications center
- **Reports**: Analytics and reporting

### Employee Portal
- **Dashboard**: Assigned cases and performance metrics
- **Assigned Cases**: Current active cases
- **Case History**: Past completed cases
- **Status Updates**: Real-time status updates

### Patient Portal
- **Request Ambulance**: Emergency request form
- **Track Request**: Real-time request tracking
- **View History**: Past request history

## 🔐 Security Features

- JWT-based authentication
- Role-based access control (RBAC)
- Password hashing with bcrypt
- Input validation and sanitization
- CORS configuration
- API rate limiting (recommended)

## 📈 Monitoring & Analytics

- Real-time dashboard metrics
- Request lifecycle tracking
- Performance analytics
- Resource utilization reports
- Historical data analysis

## 🌐 Deployment

### Environment Variables
```bash
# Production
NODE_ENV=production
DATABASE_URL="postgresql://user:pass@host:5432/Aamin01"
JWT_SECRET="production-jwt-secret"
FRONTEND_URL="https://yourdomain.com"
PORT=3001
```

### Build Commands
```bash
# Backend
cd backend && npm run build

# Frontend
cd frontend && npm run build
```

## 🧪 Testing

```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test
```

## 📝 Database Schema

Key entities:
- **Users**: Authentication and role management
- **Employees**: Staff with types (Dispatcher, Driver, Nurse)
- **Patients**: Patient information and history
- **Ambulances**: Fleet management and status
- **EmergencyRequests**: Core request tracking
- **Referrals**: Hospital referral management
- **Notifications**: System notifications
- **ActivityLogs**: Audit trail

## 🔄 Request Lifecycle

1. **Request Creation**: Patient creates emergency request
2. **Dispatch**: Dispatcher assigns nearest available resources
3. **Response**: Driver accepts and updates status
4. **Transport**: Patient pickup and transport
5. **Referral**: Hospital handoff and referral
6. **Completion**: Case closure and documentation

## 🎯 Key Benefits

- **Fast Response**: Optimized dispatch algorithms
- **Real-time Tracking**: Live status updates
- **Resource Management**: Efficient ambulance allocation
- **Data Analytics**: Performance insights
- **Scalable Architecture**: Modular, maintainable code
- **Professional UI**: Modern, responsive design
- **Comprehensive Audit**: Full activity logging

## 📞 Emergency Contact

For system emergencies or support:
- **Phone**: 888
- **Email**: admin@aamin.so

---

**Built with ❤️ for Aamin Ambulance Services**
