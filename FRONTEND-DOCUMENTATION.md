# DEFENDR Frontend - Complete Developer Documentation

## 📚 Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Project Structure](#project-structure)
4. [Technology Stack](#technology-stack)
5. [Architecture Overview](#architecture-overview)
6. [Key Concepts](#key-concepts)
7. [Common Development Tasks](#common-development-tasks)
8. [Component Guide](#component-guide)
9. [API Integration](#api-integration)
10. [Authentication & Authorization](#authentication--authorization)
11. [State Management](#state-management)
12. [Styling Guide](#styling-guide)
13. [Routing & Navigation](#routing--navigation)
14. [Best Practices](#best-practices)
15. [Troubleshooting](#troubleshooting)
16. [Resources](#resources)

---

## 🎯 Introduction

**DEFENDR** is a comprehensive esports tournament platform built with **Next.js 15** and **React 19**. This frontend application provides a complete solution for managing tournaments, teams, organizations, and player interactions.

### What This Project Does

- **Tournament Management**: Create, manage, and participate in esports tournaments
- **Team Management**: Build teams, manage rosters, and track team performance
- **Organization Features**: Tournament organizers can manage multiple tournaments
- **User Profiles**: Complete user profiles with gaming accounts, statistics, and achievements
- **Real-time Features**: Live notifications, chat, and match updates via WebSockets
- **Payment Integration**: Handle tournament entry fees and prize payouts
- **Gaming Platform Integration**: Connect with Steam, Battle.net, Epic Games, Riot Games, PSN, and Xbox

### Target Audience

This documentation is designed for:

- **Beginner developers** new to the project
- **Frontend developers** joining the team
- **Full-stack developers** working on the frontend
- **Anyone** wanting to understand the codebase structure

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have:

- **Node.js** 18.x or higher
- **npm** or **yarn** package manager
- **Git** for version control
- A code editor (VS Code recommended)
- Basic knowledge of:
  - JavaScript/TypeScript
  - React
  - HTML/CSS
  - Git

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd defendr-front-new
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**

   ```bash
   cp env-template.txt .env.local
   ```

   Edit `.env.local` and add your configuration:

   ```env
   NEXT_PUBLIC_API=https://api-dev.defendr.gg
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key
   # Add other required variables
   ```

4. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

```bash
# Development
npm run dev              # Start dev server with Turbopack (fast)
npm run dev:classic      # Start dev server (classic mode)

# Production
npm run build            # Build for production
npm run start            # Start production server

# Code Quality
npm run lint             # Run ESLint
npm run format           # Format code with Prettier

# Storybook (Component Library)
npm run storybook        # Start Storybook
npm run build-storybook  # Build Storybook

# Migration Scripts
npm run migrate-images   # Migrate images to Cloudflare
npm run test-migration   # Test migration
npm run check-migration-status  # Check migration status
```

---

## 📁 Project Structure

```
defendr-front-new/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (routes)/          # Route groups
│   │   │   ├── (auth)/       # Authentication routes
│   │   │   ├── tournament/   # Tournament pages
│   │   │   ├── team/         # Team pages
│   │   │   ├── user/         # User profile pages
│   │   │   └── ...           # Other routes
│   │   ├── api/              # API routes
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Home page
│   │   └── globals.css       # Global styles
│   │
│   ├── components/            # React components
│   │   ├── ui/               # Reusable UI components
│   │   ├── home/             # Homepage components
│   │   ├── tournament/       # Tournament-specific components
│   │   ├── team/             # Team-specific components
│   │   ├── user/             # User-specific components
│   │   └── organizations/    # Organization componentss
│   │
│   ├── services/             # API service layer
│   │   ├── tournamentService.tsx
│   │   ├── teamService.tsx
│   │   ├── userService.tsx
│   │   └── ...               # 35+ service files
│   │
│   ├── lib/                  # Utility libraries
│   │   ├── api/             # API configuration
│   │   ├── socket.ts         # WebSocket setup
│   │   └── utils.ts          # Utility functions
│   │
│   ├── hooks/                # Custom React hooks
│   │   ├── useTournamentDetails.ts
│   │   ├── useNotifications.ts
│   │   └── ...
│   │
│   ├── types/                # TypeScript type definitions
│   │   ├── tournamentType.ts
│   │   ├── userType.ts
│   │   └── ...
│   │
│   ├── utils/                # Helper utilities
│   │   ├── imageUrlSanitizer.ts
│   │   ├── errorHandler.ts
│   │   └── ...
│   │
│   └── middleware.ts         # Next.js middleware
│
├── public/                   # Static assets
├── scripts/                  # Utility scripts
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript config
├── tailwind.config.ts       # Tailwind CSS config
└── next.config.ts           # Next.js config
```

### Key Directories Explained

#### `src/app/` - Pages (Next.js App Router)

- Uses **App Router** (Next.js 13+)
- Each folder = a route
- `page.tsx` = the page component
- `layout.tsx` = layout wrapper
- `(routes)` = route groups (doesn't affect URL)

#### `src/components/` - React Components

- **`ui/`**: Reusable components (buttons, cards, forms)
- **Feature folders**: Components specific to features
- Each component in its own folder with `index.tsx`

#### `src/services/` - API Integration

- One service file per domain (tournament, team, user, etc.)
- All API calls go through these services
- Handles authentication, error handling, data transformation

#### `src/types/` - TypeScript Types

- Type definitions for all data models
- Ensures type safety across the application

---

## 🛠️ Technology Stack

### Core Technologies

| Technology       | Version | Purpose                      |
| ---------------- | ------- | ---------------------------- |
| **Next.js**      | 15.5.5  | React framework with SSR/SSG |
| **React**        | 19.0.0  | UI library                   |
| **TypeScript**   | 5.x     | Type-safe JavaScript         |
| **Tailwind CSS** | 3.4.1   | Utility-first CSS framework  |

### Key Libraries

#### UI & Styling

- **Radix UI**: Accessible component primitives
- **Lucide React**: Icon library
- **classnames**: Conditional CSS classes
- **tailwind-merge**: Merge Tailwind classes

#### Forms & Validation

- **React Hook Form**: Form state management
- **Zod**: Schema validation
- **@hookform/resolvers**: Form validation integration

#### State Management

- **Zustand**: Lightweight state management
- **React Context**: Component-level state

#### API & Data Fetching

- **Axios**: HTTP client
- **NextAuth.js**: Authentication
- **Socket.io-client**: Real-time communication

#### Utilities

- **date-fns**: Date manipulation
- **sonner**: Toast notifications
- **react-markdown**: Markdown rendering
- **chart.js**: Data visualization

---

## 🏗️ Architecture Overview

### Architecture Pattern: **Frontend-Only with External API**

This project is a **frontend-only application** that communicates with an external backend API.

```
┌─────────────────────────────────────────┐
│         Frontend (This Project)         │
│  ┌──────────┐  ┌──────────┐           │
│  │  React   │  │  Next.js │           │
│  │ Components│  │  Pages   │           │
│  └──────────┘  └──────────┘           │
│         │              │                │
│         └──────┬───────┘                │
│                │                        │
│         ┌──────▼──────┐                 │
│         │  Services  │                 │
│         │   Layer    │                 │
│         └──────┬──────┘                 │
└────────────────┼────────────────────────┘
                 │
                 │ HTTP/REST API
                 │ WebSocket
                 │
┌────────────────▼────────────────────────┐
│      External Backend API                │
│    (api.defendr.gg / api-dev.defendr.gg)│
│  ┌──────────┐  ┌──────────┐           │
│  │ Business │  │ Database │           │
│  │  Logic   │  │   (MongoDB)          │
│  └──────────┘  └──────────┘           │
└─────────────────────────────────────────┘
```

### Data Flow

1. **User Interaction** → React Component
2. **Component** → Service Function
3. **Service** → API Request (via Axios)
4. **Backend API** → Processes & Returns Data
5. **Service** → Transforms Data
6. **Component** → Updates UI

### Key Architectural Decisions

1. **Service Layer Pattern**: All API calls go through service files
2. **Type Safety**: Full TypeScript coverage
3. **Component Composition**: Reusable, composable components
4. **Separation of Concerns**: Clear boundaries between UI, logic, and data
5. **Real-time Updates**: WebSocket for live features

---

## 💡 Key Concepts

### 1. Next.js App Router

This project uses **Next.js App Router** (not Pages Router).

**Key Differences:**

- Folders define routes (not files)
- `page.tsx` = page component
- `layout.tsx` = layout wrapper
- `loading.tsx` = loading UI
- `error.tsx` = error UI

**Example:**

```
app/
  tournament/
    [id]/
      page.tsx        → /tournament/123
      layout.tsx      → Wraps all tournament pages
```

### 2. Server vs Client Components

**Server Components** (default):

- Run on server
- Can access databases/APIs directly
- No JavaScript sent to client
- Use for data fetching

**Client Components** (`'use client'`):

- Run in browser
- Can use hooks, event handlers
- Interactive features
- Must mark with `'use client'` directive

**Example:**

```tsx
// Server Component (default)
export default async function TournamentPage({ params }) {
  const tournament = await getTournament(params.id)
  return <TournamentDetails tournament={tournament} />
}

// Client Component
;('use client')
export default function TournamentCard({ tournament }) {
  const [liked, setLiked] = useState(false)
  return <button onClick={() => setLiked(!liked)}>Like</button>
}
```

### 3. Service Layer Pattern

All API calls go through service files:

```typescript
// ❌ Don't do this in components
const response = await fetch('/api/tournaments')

// ✅ Do this instead
import { getAllTournaments } from '@/services/tournamentService'
const tournaments = await getAllTournaments()
```

**Benefits:**

- Centralized API logic
- Consistent error handling
- Easy to mock for testing
- Type-safe responses

### 4. TypeScript Types

Every data model has a type definition:

```typescript
// src/types/tournamentType.ts
export interface Tournament {
  _id: string
  name: string
  startDate: string
  game: Game
  // ... more fields
}
```

**Usage:**

```typescript
import { Tournament } from '@/types/tournamentType'

function TournamentCard({ tournament }: { tournament: Tournament }) {
  // TypeScript knows tournament structure
}
```

---

## 🔨 Common Development Tasks

### Adding a New Page

1. **Create the page file:**

   ```
   src/app/(routes)/your-page/page.tsx
   ```

2. **Create the component:**

   ```tsx
   'use client' // If you need interactivity

   export default function YourPage() {
     return <div>Your Page Content</div>
   }
   ```

3. **Add to middleware** (if it needs authentication):
   ```typescript
   // src/middleware.ts
   const PUBLIC_ROUTES = [
     // ... existing routes
     '/your-page',
   ]
   ```

### Creating a New Component

1. **Create component folder:**

   ```
   src/components/ui/YourComponent/
     index.tsx
   ```

2. **Write the component:**

   ```tsx
   'use client'

   interface YourComponentProps {
     title: string
     onClick?: () => void
   }

   export default function YourComponent({ title, onClick }: YourComponentProps) {
     return (
       <div className="p-4 bg-gray-800 rounded-lg">
         <h2>{title}</h2>
         {onClick && <button onClick={onClick}>Click me</button>}
       </div>
     )
   }
   ```

3. **Use it:**

   ```tsx
   import YourComponent from '@/components/ui/YourComponent'
   ;<YourComponent title="Hello" onClick={() => console.log('clicked')} />
   ```

### Making an API Call

1. **Check if a service exists:**

   ```
   src/services/yourService.tsx
   ```

2. **If it doesn't exist, create it:**

   ```typescript
   import { apiClient } from '@/lib/api/axiosConfig'

   export const getYourData = async () => {
     const response = await apiClient.get('/your-endpoint')
     return response.data
   }
   ```

3. **Use it in your component:**

   ```tsx
   'use client'
   import { useEffect, useState } from 'react'
   import { getYourData } from '@/services/yourService'

   export default function YourComponent() {
     const [data, setData] = useState(null)

     useEffect(() => {
       async function fetchData() {
         const result = await getYourData()
         setData(result)
       }
       fetchData()
     }, [])

     return <div>{data && <p>{data.name}</p>}</div>
   }
   ```

### Adding a New Route to Navigation

1. **Find the navigation component:**

   ```
   src/components/home/Navbar/index.tsx
   ```

2. **Add to the navigation array:**
   ```typescript
   const navBarAccountDefender = [
     // ... existing items
     {
       title: 'Your Page',
       link: '/your-page',
       icon: <YourIcon />,
     },
   ]
   ```

### Styling with Tailwind CSS

This project uses **Tailwind CSS** for styling.

**Basic Usage:**

```tsx
<div className="bg-gray-800 text-white p-4 rounded-lg">Content</div>
```

**Common Classes:**

- `bg-*`: Background colors
- `text-*`: Text colors
- `p-*`: Padding
- `m-*`: Margin
- `flex`: Flexbox
- `grid`: CSS Grid
- `rounded-*`: Border radius
- `hover:*`: Hover states

**Custom Colors:**
Check `tailwind.config.ts` for custom colors like:

- `defendrRed`
- `defendrGrey`
- `defendrBlack`

---

## 🧩 Component Guide

### UI Components (`src/components/ui/`)

#### Button

```tsx
import Button from '@/components/ui/Button'
;<Button label="Click Me" variant="contained-red" size="l" onClick={() => console.log('clicked')} />
```

**Variants:**

- `contained-red`: Red filled button
- `contained-blue`: Blue filled button
- `outlined-red`: Red outlined button
- `text`: Text button

#### Typo (Typography)

```tsx
import Typo from '@/components/ui/Typo'
;<Typo as="h1" color="white" fontFamily="poppins" fontVariant="h1">
  Heading Text
</Typo>
```

**Props:**

- `as`: HTML tag (h1, h2, p, span, etc.)
- `color`: Text color
- `fontFamily`: Font family (poppins, etc.)
- `fontVariant`: Size variant (h1, h2, p1, p2, etc.)

#### TournamentCard

```tsx
import TournamentCard from '@/components/ui/TournamentCard'
;<TournamentCard tournament={tournamentData} />
```

#### EventCard

```tsx
import EventCard from '@/components/ui/EventCard'
;<EventCard
  eventName="Event Name"
  imageUrl="/path/to/image.jpg"
  redirectUrl="/event-page"
  prizePool="10K TND"
  tournamentStatus="Registration Phase"
/>
```

### Feature Components

Components are organized by feature:

- `tournament/`: Tournament-specific components
- `team/`: Team-specific components
- `user/`: User profile components
- `organizations/`: Organization components

---

## 🔌 API Integration

### Service Layer Structure

All API calls go through service files in `src/services/`:

```typescript
// src/services/tournamentService.tsx
import { apiClient } from '@/lib/api/axiosConfig'

export const getAllTournaments = async () => {
  const response = await apiClient.get('/tournament')
  return response.data
}

export const getTournamentById = async (id: string) => {
  const response = await apiClient.get(`/tournament/${id}`)
  return response.data
}

export const createTournament = async (data: TournamentData) => {
  const response = await apiClient.post('/tournament', data)
  return response.data
}
```

### API Client Configuration

The API client is configured in `src/lib/api/axiosConfig.ts`:

- **Automatic authentication**: Adds Bearer token to requests
- **Error handling**: Categorizes errors (SERVER, CLIENT, AUTH, etc.)
- **Base URL**: Uses `NEXT_PUBLIC_API` environment variable
- **Timeout**: 10-second request timeout

### Making Authenticated Requests

The API client automatically adds authentication:

```typescript
// No need to manually add tokens
const tournaments = await getAllTournaments()
// Token is automatically added from NextAuth session
```

### Error Handling

Services handle errors automatically:

```typescript
try {
  const tournament = await getTournamentById(id)
} catch (error) {
  // Error is already categorized
  // Show user-friendly message
  toast.error('Failed to load tournament')
}
```

---

## 🔐 Authentication & Authorization

### NextAuth.js Integration

This project uses **NextAuth.js** for authentication.

**Session Access:**

```tsx
'use client'
import { useSession } from 'next-auth/react'

export default function MyComponent() {
  const { data: session, status } = useSession()

  if (status === 'loading') return <div>Loading...</div>
  if (!session) return <div>Not authenticated</div>

  return <div>Hello, {session.user.nickname}</div>
}
```

**Server-Side Session:**

```tsx
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/api/auth'

export default async function ServerComponent() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  return <div>Protected content</div>
}
```

### Protected Routes

Routes are protected via `middleware.ts`:

```typescript
// src/middleware.ts
const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/signup',
  // ... public routes
]

// All other routes require authentication
```

### User Roles

User roles are managed through the backend API:

- Regular users
- Tournament organizers
- Administrators

---

## 📊 State Management

### Local Component State

Use React hooks for local state:

```tsx
const [count, setCount] = useState(0)
const [loading, setLoading] = useState(false)
```

### Global State (Zustand)

For global state, use Zustand stores:

```typescript
// src/hooks/store.ts
import { create } from 'zustand'

interface AppState {
  selectedGame: Game | null
  setSelectedGame: (game: Game | null) => void
}

export const useAppStore = create<AppState>(set => ({
  selectedGame: null,
  setSelectedGame: game => set({ selectedGame: game }),
}))
```

**Usage:**

```tsx
import { useAppStore } from '@/hooks/store'

function MyComponent() {
  const { selectedGame, setSelectedGame } = useAppStore()
  // ...
}
```

### Context API

Some features use React Context:

```tsx
// src/components/context/OrganizationContext.tsx
import { createContext, useContext } from 'react'

const OrganizationContext = createContext(null)

export const useOrganization = () => useContext(OrganizationContext)
```

---

## 🎨 Styling Guide

### Tailwind CSS

This project uses **Tailwind CSS** for all styling.

**Basic Example:**

```tsx
<div className="bg-gray-800 text-white p-4 rounded-lg hover:bg-gray-700">Content</div>
```

### Custom Colors

Defined in `tailwind.config.ts`:

```typescript
colors: {
  defendrRed: '#d62755',
  defendrGrey: '#343A40',
  defendrBlack: '#161616',
  // ...
}
```

**Usage:**

```tsx
<div className="bg-defendrRed text-white">Red background</div>
```

### Responsive Design

Tailwind's responsive prefixes:

```tsx
<div
  className="
  text-sm        // Mobile
  sm:text-base   // Small screens
  md:text-lg     // Medium screens
  lg:text-xl     // Large screens
"
>
  Responsive text
</div>
```

### Dark Mode

The app uses a dark theme by default. Colors are designed for dark backgrounds.

---

## 🧭 Routing & Navigation

### Next.js App Router

Routes are defined by folder structure:

```
app/
  page.tsx                    → /
  about/
    page.tsx                  → /about
  tournament/
    page.tsx                  → /tournament
    [id]/
      page.tsx                → /tournament/123
      matchProfile/
        [matchId]/
          page.tsx            → /tournament/123/matchProfile/456
```

### Dynamic Routes

Use brackets for dynamic segments:

```
[id]/page.tsx                 → /tournament/:id
[slug]/page.tsx               → /blog/:slug
```

**Access params:**

```tsx
export default async function TournamentPage({ params }: { params: { id: string } }) {
  const { id } = await params
  // Use id
}
```

### Navigation

Use Next.js `Link` component:

```tsx
import Link from 'next/link'
;<Link href="/tournament/123">View Tournament</Link>
```

**Programmatic Navigation:**

```tsx
'use client'
import { useRouter } from 'next/navigation'

const router = useRouter()
router.push('/tournament/123')
```

### Jobs/Internship Application Route

The `/jobs` route provides an internship application form for DEFENDR. This is a public route that allows applicants to apply for various internship positions.

**Route:** `/jobs`

**Location:** `src/app/(routes)/jobs/page.tsx`

**Features:**

- Topic selection dropdown (including Cyber Security)
- File upload for CV (PDF/Word, max 10MB)
- File upload for Motivation Letter (PDF/Word, max 10MB)
- Portfolio/Website URL input
- hCaptcha verification
- Email notifications

**Available Internship Topics:**

- Web Development for DEFENDR
- Web3 Development & Blockchain Architecture
- Intelligent Chatbot (AI) Development "Guardian"
- IA generative for images and blogs
- Admin Dashboard Development
- Community Manager
- SEO
- User Experience Optimization
- Graphic designer
- Business developer
- Implementation of a Marketing Automation System
- **Cyber Security** (newly added)

**Configuration:**
Internship topics are defined in `src/lib/constants/jobs.ts`:

```typescript
export const INTERNSHIP_TOPICS: InternshipTopic[] = [
  // ... other topics
  {
    value: 'cyber-security',
    label: 'Cyber Security',
    pdfUrl: DEFAULT_EBOOK_URL,
  },
]
```

**API Endpoint:**
The form submission is handled by `/api/jobs/apply` which:

- Validates hCaptcha token
- Validates form data
- Uploads files to Cloudflare R2
- Sends email notifications
- Returns success/error responses

**Usage Example:**

```tsx
// Navigate to jobs page
import Link from 'next/link'
;<Link href="/jobs">Apply for Internship</Link>
```

**Adding New Topics:**
To add a new internship topic:

1. Open `src/lib/constants/jobs.ts`
2. Add a new entry to `INTERNSHIP_TOPICS` array:

```typescript
{
  value: 'your-topic-value',
  label: 'Your Topic Label',
  pdfUrl: DEFAULT_EBOOK_URL, // or custom PDF URL
}
```

---

## ✅ Best Practices

### 1. Component Organization

- One component per file
- Component folder with `index.tsx`
- Co-locate related files (styles, types, utils)

### 2. TypeScript

- Always define types for props
- Use interfaces for objects
- Avoid `any` type
- Import types from `src/types/`

### 3. API Calls

- Always use service layer
- Handle errors gracefully
- Show loading states
- Provide user feedback

### 4. Performance

- Use `'use client'` only when needed
- Lazy load heavy components
- Optimize images with Next.js Image
- Use React.memo for expensive components

### 5. Code Style

- Follow existing patterns
- Use Prettier for formatting
- Run ESLint before committing
- Write descriptive variable names

### 6. Error Handling

```tsx
try {
  const data = await fetchData()
} catch (error) {
  console.error('Error:', error)
  toast.error('Something went wrong')
  // Fallback UI
}
```

### 7. Loading States

```tsx
const [loading, setLoading] = useState(true)

useEffect(() => {
  async function load() {
    setLoading(true)
    try {
      const data = await fetchData()
      setData(data)
    } finally {
      setLoading(false)
    }
  }
  load()
}, [])

if (loading) return <Loader />
```

---

## 🐛 Troubleshooting

### Common Issues

#### 1. "Module not found" Error

**Problem:** Can't find a module/component

**Solution:**

- Check import path (use `@/` alias)
- Verify file exists
- Restart dev server

#### 2. TypeScript Errors

**Problem:** Type errors in IDE

**Solution:**

- Check `tsconfig.json` paths
- Verify types are imported correctly
- Run `npm run build` to see all errors

#### 3. API Calls Failing

**Problem:** 401/403 errors

**Solution:**

- Check if user is authenticated
- Verify `NEXT_PUBLIC_API` in `.env.local`
- Check network tab for actual request

#### 4. Styling Not Applied

**Problem:** Tailwind classes not working

**Solution:**

- Check `tailwind.config.ts`
- Verify class names are correct
- Restart dev server

#### 5. Build Errors

**Problem:** Build fails

**Solution:**

- Check TypeScript errors: `npm run build`
- Fix linting errors: `npm run lint`
- Clear `.next` folder and rebuild

### Debugging Tips

1. **Use Browser DevTools**
   - Console for errors
   - Network tab for API calls
   - React DevTools for component state

2. **Check Server Logs**
   - Terminal output
   - Next.js error overlay

3. **Add Console Logs**

   ```tsx
   console.log('Data:', data)
   console.log('Props:', props)
   ```

4. **Use TypeScript**
   - Let TypeScript catch errors early
   - Use type hints in IDE

---

## 📚 Resources

### Official Documentation

- **Next.js**: https://nextjs.org/docs
- **React**: https://react.dev
- **TypeScript**: https://www.typescriptlang.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **NextAuth.js**: https://next-auth.js.org

### Project-Specific

- **Backend API**: See `Backend-Architecture-Document.md`
- **Component Library**: Run `npm run storybook`
- **Environment Setup**: Check `env-template.txt`

### Learning Resources

- **Next.js Learn**: https://nextjs.org/learn
- **React Tutorial**: https://react.dev/learn
- **TypeScript Handbook**: https://www.typescriptlang.org/docs/handbook/intro.html

### Tools

- **VS Code Extensions**:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - TypeScript and JavaScript Language Features

---

## 🎓 Next Steps

Now that you understand the basics:

1. **Explore the Codebase**
   - Start with `src/app/page.tsx` (homepage)
   - Look at `src/components/ui/` (reusable components)
   - Check `src/services/` (API integration)

2. **Make Your First Change**
   - Update a component
   - Add a new page
   - Modify styling

3. **Read the Code**
   - Study existing patterns
   - Understand component structure
   - Learn from examples

4. **Ask Questions**
   - Check existing documentation
   - Review similar code
   - Ask team members

5. **Practice**
   - Create a test component
   - Make a small feature
   - Refactor existing code

---

## 📝 Quick Reference

### File Paths

```
Pages:        src/app/(routes)/[route]/page.tsx
Components:   src/components/[feature]/[Component]/index.tsx
Services:     src/services/[feature]Service.tsx
Types:        src/types/[feature]Type.ts
Utils:        src/utils/[utility].ts
Hooks:        src/hooks/use[Feature].ts
```

### Common Imports

```typescript
// Next.js
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

// React
import { useState, useEffect } from 'react'

// NextAuth
import { useSession } from 'next-auth/react'

// Components
import Typo from '@/components/ui/Typo'
import Button from '@/components/ui/Button'

// Services
import { getAllTournaments } from '@/services/tournamentService'

// Types
import { Tournament } from '@/types/tournamentType'
```

### Common Patterns

```tsx
// Client Component with State
'use client'
import { useState, useEffect } from 'react'

export default function MyComponent() {
  const [data, setData] = useState(null)

  useEffect(() => {
    // Fetch data
  }, [])

  return <div>{data && <p>{data.name}</p>}</div>
}
```

```tsx
// Server Component with Data Fetching
import { getTournamentById } from '@/services/tournamentService'

export default async function TournamentPage({ params }: { params: { id: string } }) {
  const { id } = await params
  const tournament = await getTournamentById(id)

  return <div>{tournament.name}</div>
}
```

---

## 🤝 Contributing

### Before You Start

1. **Read this documentation**
2. **Understand the project structure**
3. **Set up your development environment**
4. **Run the project locally**

### Making Changes

1. **Create a branch**: `git checkout -b feature/your-feature`
2. **Make changes**: Follow best practices
3. **Test locally**: Ensure everything works
4. **Commit**: Write clear commit messages
5. **Push**: `git push origin feature/your-feature`
6. **Create PR**: Submit for review

### Code Review Checklist

- [ ] Code follows project patterns
- [ ] TypeScript types are correct
- [ ] No console.logs in production code
- [ ] Error handling is implemented
- [ ] Loading states are shown
- [ ] Responsive design works
- [ ] No linting errors

---

## 📞 Getting Help

If you're stuck:

1. **Check this documentation**
2. **Search existing code** for similar patterns
3. **Check error messages** carefully
4. **Use browser DevTools** to debug
5. **Ask team members** for help

---

**Happy Coding! 🚀**

_Last Updated: 2025_
