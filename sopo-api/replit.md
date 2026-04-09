# REST Express API Management System

## Overview

This is a full-stack web application for managing REST API endpoints with a modern UI. The system allows users to create, manage, and monitor API endpoints with comprehensive logging and analytics. Built with React frontend, Express.js backend, and PostgreSQL database using Drizzle ORM.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state
- **UI Framework**: Shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite with custom configuration

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **API Design**: RESTful endpoints with proper error handling
- **Middleware**: Custom logging, JSON parsing, and error handling
- **Development**: Hot reload with Vite integration

### Data Storage
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Management**: Code-first approach with migrations
- **Connection**: Neon serverless database connection
- **Storage Layer**: Abstract storage interface with in-memory fallback

## Key Components

### Database Schema
- **endpoints**: Stores API endpoint configurations (path, method, target URL, settings)
- **request_logs**: Comprehensive request logging with performance metrics
- **users**: User management (basic structure in place)

### Core Features
1. **Endpoint Management**: Create, read, update, delete API endpoints
2. **Request Logging**: Automatic logging of all API requests with detailed metrics
3. **Analytics Dashboard**: Real-time statistics and performance monitoring
4. **Activity Feed**: Recent request activity with status visualization
5. **Endpoint Testing**: Built-in testing functionality for created endpoints

### UI Components
- **Dashboard**: Main interface with statistics cards and management tools
- **Endpoint Table**: Sortable, filterable table of managed endpoints
- **Activity Feed**: Real-time log of API requests and responses
- **Modal Forms**: Add/edit endpoint forms with validation
- **Stats Cards**: Visual metrics display for key performance indicators

## Data Flow

1. **Frontend to Backend**: API calls through custom fetch wrapper with error handling
2. **Backend Processing**: Express routes handle CRUD operations and proxy requests
3. **Database Operations**: Drizzle ORM manages all database interactions
4. **Real-time Updates**: React Query handles cache invalidation and refetching
5. **Logging Pipeline**: All API requests automatically logged with metadata

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL connection
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **wouter**: Lightweight React router
- **axios**: HTTP client for external API calls

### UI Dependencies
- **@radix-ui/**: Complete set of accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library
- **react-hook-form**: Form state management
- **zod**: Schema validation

### Development Dependencies
- **vite**: Build tool and development server
- **typescript**: Type safety
- **esbuild**: Fast JavaScript bundler for production

## Deployment Strategy

### Development
- **Frontend**: Vite dev server with HMR
- **Backend**: tsx for TypeScript execution with auto-restart
- **Database**: Drizzle Kit for schema management and migrations

### Production Build
- **Frontend**: Vite build to static assets
- **Backend**: esbuild bundle for Node.js runtime
- **Deployment**: Single-process server serving both API and static files

### Environment Configuration
- **DATABASE_URL**: PostgreSQL connection string (required)
- **NODE_ENV**: Environment mode (development/production)
- **Port Configuration**: Express server with configurable port

### Key Architectural Decisions

1. **Monorepo Structure**: Single repository with shared types and schemas
2. **Type Safety**: Full TypeScript coverage with shared types between frontend/backend
3. **Modern UI**: Shadcn/ui for consistent, accessible components
4. **Serverless Database**: Neon for scalable PostgreSQL without infrastructure management
5. **In-Memory Fallback**: Storage abstraction allows development without database
6. **Comprehensive Logging**: Detailed request/response logging for debugging and analytics

## Changelog
- July 05, 2025 - Initial setup
- July 05, 2025 - Enhanced UI with professional design, added payload and custom headers support, improved dashboard with gradients and modern styling

## Recent Changes
- Enhanced database schema with defaultPayload and customHeaders fields
- Improved UI design with modern gradients, shadows, and professional styling
- Added comprehensive payload and headers configuration in endpoint creation
- Updated dashboard with enhanced stats cards and feature showcase
- Improved endpoint table with better visual design and payload indicators
- Enhanced activity feed and modal designs for better user experience
- Added advanced log filtering by endpoint with detailed view capabilities
- Created comprehensive endpoint editing modal with all configuration options
- Implemented performance optimizations: compression, caching, pagination, and memoization
- Reduced API calls frequency and added intelligent cache management for faster responses
- July 20, 2025: Successfully migrated from Replit Agent to Replit environment
- Fixed CORS issues for production URL proxying with enhanced error handling
- Removed default endpoints to provide clean start as requested by user
- Enhanced proxy middleware with detailed logging and better header management
- July 20, 2025: Completed responsive UI overhaul with modern AppLayout component
- Implemented unified design system with glassmorphism, backdrop blur, and gradient themes
- Created fully responsive dashboard, endpoints, logs, analytics, security, and settings pages
- Added comprehensive theme provider with dark/light mode toggle functionality
- Enhanced mobile responsiveness across all breakpoints (sm, md, lg, xl)
- Integrated professional statistics cards with animations and hover effects
- July 20, 2025: Added professional API Usage Examples functionality with automatic code generation
- Created comprehensive ApiUsageExamples component with support for cURL, JavaScript, Python, and Node.js
- Added dedicated API Examples page with interactive endpoint cards and modal dialogs
- Implemented automatic URL generation, custom headers support, and one-click endpoint testing
- Added Postman collection download functionality for easy API testing
- Enhanced endpoints page with visual endpoint cards and integrated code examples

## User Preferences

Preferred communication style: Simple, everyday language (Arabic and English).
User requested professional UI improvements and payload functionality.
User prefers system to start without default endpoints - clean slate.
User wants professional and fast UI - July 20, 2025: Implemented modern design with glassmorphism, gradients, improved animations, and performance optimizations.
User specifically requested responsive design for all screen sizes - July 20, 2025: Successfully implemented responsive layouts using Tailwind CSS breakpoints.