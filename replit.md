# Overview

EliteStore is a modern e-commerce web application built with React and Express.js, featuring a premium shopping experience with product browsing, cart management, user accounts, and checkout functionality. The application provides a full-stack solution for online retail with a clean, responsive design and comprehensive user management features.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client-side is built using React with TypeScript and follows a modern component-based architecture:

- **UI Framework**: React with TypeScript for type safety and better development experience
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React Context API with custom AppContext for global state (cart, wishlist, user, theme)
- **Styling**: Tailwind CSS with custom CSS variables for theming, supporting both light and dark modes
- **Component Library**: Radix UI components with shadcn/ui styling for consistent, accessible UI elements
- **Data Fetching**: TanStack React Query for server state management and caching
- **Local Storage**: Custom useLocalStorage hook for persisting user preferences, cart, and wishlist data

The application uses a sidebar navigation pattern with responsive design that adapts to mobile and desktop screens. The component structure follows atomic design principles with reusable UI components in the components/ui directory.

## Backend Architecture
The server-side uses Express.js with a modular architecture:

- **Framework**: Express.js with TypeScript for the REST API
- **Architecture Pattern**: Storage interface pattern for data access abstraction
- **Data Layer**: Currently implements in-memory storage (MemStorage) with interface for easy database integration
- **Development Setup**: Vite integration for development with HMR and error handling
- **API Structure**: RESTful API design with /api prefix for all endpoints
- **Middleware**: Custom logging middleware for API request tracking

The storage interface (IStorage) provides CRUD operations abstracted from the implementation, making it easy to swap from memory storage to a database later.

## Data Storage Solutions
Currently uses in-memory storage for development, but the architecture supports easy migration to persistent databases:

- **Current**: In-memory storage using Map data structures
- **Planned**: PostgreSQL with Drizzle ORM (configuration already present)
- **ORM**: Drizzle ORM with schema definitions in shared/schema.ts
- **Database Provider**: Neon Database (serverless PostgreSQL)

The schema defines comprehensive data models for products, users, cart items, and orders with Zod validation.

## Authentication and Authorization
The application currently uses a simplified authentication approach:

- **User Management**: Basic user profiles stored in local storage and memory
- **Session Handling**: Client-side user state management through React Context
- **Future Enhancement**: Ready for integration with proper authentication systems

## External Dependencies

### UI and Styling
- **Radix UI**: Comprehensive set of accessible, unstyled UI primitives
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Lucide React**: Icon library for consistent iconography
- **class-variance-authority**: For creating variant-based component APIs

### State Management and Data
- **TanStack React Query**: Server state management, caching, and synchronization
- **Zod**: Runtime type validation and schema definition
- **date-fns**: Date manipulation and formatting utilities

### Development and Build
- **Vite**: Fast development server and build tool with React plugin
- **TypeScript**: Static type checking for both client and server
- **ESBuild**: Fast bundler for production server builds
- **PostCSS**: CSS processing with Autoprefixer

### Backend Infrastructure
- **Drizzle ORM**: Type-safe database toolkit with PostgreSQL support
- **Neon Database**: Serverless PostgreSQL database provider
- **express**: Web framework for Node.js
- **connect-pg-simple**: PostgreSQL session store for future session management

### Routing and Navigation
- **Wouter**: Minimalist routing library for React applications

The architecture is designed for scalability and maintainability, with clear separation of concerns and easy integration points for additional features like real authentication, payment processing, and inventory management.