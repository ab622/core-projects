# Overview

TaskFlow is a comprehensive task management and productivity application that combines task organization, calendar scheduling, Pomodoro timer functionality, and analytics. The application is built as a full-stack web application with a React frontend and Express.js backend, designed to help users maximize their time management and productivity through an integrated approach to task management.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Components**: Shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming support (light/dark modes)
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation integration

## Backend Architecture  
- **Framework**: Express.js with TypeScript running on Node.js
- **API Design**: RESTful API with structured route handlers
- **Authentication**: Replit Authentication integration using OpenID Connect
- **Session Management**: Express sessions with PostgreSQL storage via connect-pg-simple
- **Database Layer**: Repository pattern implementation with a storage interface for data operations

## Data Storage
- **Database**: PostgreSQL with Neon serverless connection
- **ORM**: Drizzle ORM with TypeScript-first schema definitions
- **Schema Management**: Drizzle Kit for migrations and schema synchronization
- **Connection**: Connection pooling via @neondatabase/serverless with WebSocket support

## Core Data Models
- **Users**: Authentication and profile management
- **Categories**: Task organization and color coding
- **Tasks**: Core task entities with priority, completion status, and due dates
- **Focus Sessions**: Pomodoro timer sessions linked to tasks for time tracking

## Authentication & Authorization
- **Provider**: Replit's integrated authentication system
- **Flow**: OpenID Connect with automatic user provisioning
- **Session Storage**: PostgreSQL-backed sessions with configurable TTL
- **Security**: HTTP-only cookies with secure flags for production

## Key Features Architecture
- **Task Management**: CRUD operations with filtering, categorization, and priority levels
- **Calendar Integration**: Week/month view with task scheduling capabilities
- **Focus Mode**: Pomodoro timer implementation with session tracking
- **Analytics**: Task completion rates and productivity metrics
- **Responsive Design**: Mobile-first approach with adaptive layouts

# External Dependencies

## Core Infrastructure
- **Database**: Neon PostgreSQL serverless database
- **Authentication**: Replit Authentication service
- **Deployment**: Replit hosting platform with integrated development environment

## Frontend Libraries
- **UI Framework**: Radix UI component primitives for accessibility
- **Icons**: Lucide React icon library
- **Date Handling**: date-fns for date manipulation and formatting
- **State Management**: TanStack Query for server state caching and synchronization

## Backend Services
- **Database Driver**: @neondatabase/serverless for PostgreSQL connectivity  
- **Session Store**: connect-pg-simple for PostgreSQL session persistence
- **Authentication**: openid-client for OIDC integration with Replit
- **Development**: tsx for TypeScript execution and Vite for frontend development

## Development Tools
- **Build System**: Vite with React plugin and TypeScript support
- **Code Quality**: ESBuild for production bundling
- **Database Management**: Drizzle Kit for schema migrations and database operations
- **Development Server**: Hot module replacement and error overlay integration