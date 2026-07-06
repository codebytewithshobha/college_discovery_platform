# College Discovery Platform
live link - https://collegediscoveryplatformdeployement.vercel.app/

A production-grade full-stack college discovery and comparison platform built with Next.js, PostgreSQL, and modern web technologies.

## 🎯 Project Overview

CollegeHub is a comprehensive platform for students to discover, compare, and save colleges across India. Similar to Careers360 and Collegedunia, it provides detailed information about colleges, courses, placements, and reviews to help students make informed decisions about their higher education.

### Key Features

- **College Discovery**: Search and filter colleges by location, rating, fees, and keywords
- **Detailed College Profiles**: Comprehensive information including courses, placements, and reviews
- **College Comparison**: Side-by-side comparison of up to 3 colleges
- **User Authentication**: Secure signup and login with NextAuth
- **Saved Items**: Bookmark favorite colleges and comparison groups
- **Responsive Design**: Mobile-first UI built with TailwindCSS and shadcn/ui
- **Real-time Data**: API-driven architecture with TanStack Query for caching

## 🏗️ Architecture

### Technology Stack

**Frontend**:
- Next.js 14 (App Router)
- React 18
- TypeScript
- TailwindCSS
- shadcn/ui components
- Lucide React icons

**Backend**:
- Next.js API Routes
- Node.js
- TypeScript

**Database**:
- PostgreSQL
- Prisma ORM
- Neon (serverless Postgres)

**Authentication**:
- NextAuth v5 (Credentials Provider)
- bcrypt for password hashing

**State Management**:
- TanStack Query (server state)
- Zustand (client state)

**Validation**:
- Zod (runtime validation)

**Deployment**:
- Vercel (frontend & API)
- Neon PostgreSQL (database)

### Architecture Decisions

**Monolithic Next.js Application**
- Simplified deployment with single Vercel deployment
- Type safety shared between frontend and backend
- Easy to extract microservices if needed in the future
- Tradeoff: Less isolation between frontend/backend (acceptable for MVP)

**Normalized Database Schema**
- Data integrity through constraints
- Efficient queries with proper indexing
- Single source of truth
- Easy to maintain and extend

**RESTful API Design**
- Consistent response format across all endpoints
- Standardized error handling
- Easy to integrate with frontend
- Predictable behavior

**Validation Strategy**
- Zod schemas at every boundary
- Runtime type safety
- Clear error messages
- Prevents malformed data

## 📁 Folder Structure

```
college-discovery-platform/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── signup/
│   ├── (main)/
│   │   ├── colleges/
│   │   │   ├── [id]/
│   │   │   └── page.tsx
│   │   ├── compare/
│   │   └── saved/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [..nextauth]/
│   │   │   ├── login/
│   │   │   └── signup/
│   │   ├── colleges/
│   │   │   └── [id]/
│   │   ├── compare/
│   │   └── saved/
│   │       └── [id]/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── ui/ (shadcn components)
│   ├── college/
│   │   ├── college-card.tsx
│   │   ├── filter-panel.tsx
│   │   └── pagination.tsx
│   ├── providers.tsx
│   └── ui/
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── toast.tsx
│       ├── toaster.tsx
│       └── use-toast.ts
├── features/
│   ├── colleges/
│   ├── auth/
│   ├── compare/
│   └── saved/
├── hooks/
│   └── use-colleges.ts
├── lib/
│   ├── auth.ts
│   ├── prisma.ts
│   ├── store/
│   │   └── comparison.ts
│   ├── utils.ts
│   └── validations/
│       ├── auth.ts
│       ├── college.ts
│       └── comparison.ts
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── types/
│   ├── index.ts
│   └── next-auth.d.ts
├── ARCHITECTURE.md
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
├── postcss.config.js
├── vercel.json
└── .env.example
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database (Neon recommended)
- npm or yarn package manager

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd college-discovery-platform
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your values:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/college_discovery?schema=public"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

4. **Set up the database**
```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed database with sample data
npm run db:seed
```

5. **Run development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📊 Database Schema

### Models

**User**
- Authentication and user profile
- Relations: reviews, savedColleges, savedComparisons

**College**
- Core college entity
- Relations: courses, reviews, recruiters, savedColleges, comparisonItems
- Indexes: name, location, rating, fees, ranking

**Course**
- Course offerings
- Relations: college
- Enums: CourseType, CourseDuration

**Review**
- User-generated reviews
- Relations: college, user
- Indexes: collegeId, userId, rating

**Recruiter**
- Company recruiters
- Relations: college

**SavedCollege**
- User bookmarks
- Relations: user, college
- Unique constraint: userId + collegeId

**SavedComparison**
- User comparison groups
- Relations: user, items

**ComparisonItem**
- Colleges in comparison
- Relations: comparison, college
- Unique constraint: comparisonId + collegeId

See `prisma/schema.prisma` for complete schema definition.

## 🔌 API Documentation

### Authentication Endpoints

#### POST /api/auth/signup
Create a new user account.

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response** (201):
```json
{
  "success": true,
  "data": {
    "id": "clxxx",
    "email": "john@example.com",
    "name": "John Doe",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### POST /api/auth/login
Authenticate user credentials.

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "clxxx",
    "email": "john@example.com",
    "name": "John Doe"
  }
}
```

### College Endpoints

#### GET /api/colleges
Get paginated list of colleges with filters.

**Query Parameters**:
- `search` (optional): Search term for name or location
- `location` (optional): Filter by location
- `minRating` (optional): Minimum rating (0-5)
- `minFees` (optional): Minimum fees
- `maxFees` (optional): Maximum fees
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 12, max: 100)

**Example**:
```
GET /api/colleges?search=iit&location=Delhi&minRating=4&page=1
```

**Response** (200):
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 100,
    "totalPages": 9
  }
}
```

#### GET /api/colleges/[id]
Get detailed information about a specific college.

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "clxxx",
    "name": "IIT Bombay",
    "location": "Mumbai, Maharashtra",
    "description": "...",
    "establishmentYear": 1958,
    "ranking": 1,
    "rating": 4.8,
    "fees": 250000,
    "averagePackage": 1800000,
    "highestPackage": 3500000,
    "courses": [...],
    "reviews": [...],
    "recruiters": [...]
  }
}
```

### Comparison Endpoints

#### POST /api/compare
Create a new comparison group.

**Request Body**:
```json
{
  "name": "My Comparison",
  "collegeIds": ["clxxx", "clyyy", "clzzz"],
  "userId": "cluser"
}
```

**Response** (201):
```json
{
  "success": true,
  "data": {
    "id": "clcomp",
    "name": "My Comparison",
    "userId": "cluser",
    "items": [...]
  }
}
```

### Saved Items Endpoints

#### POST /api/saved
Save a college to user's bookmarks.

**Request Body**:
```json
{
  "collegeId": "clxxx",
  "userId": "cluser"
}
```

**Response** (201):
```json
{
  "success": true,
  "data": {
    "id": "clsaved",
    "collegeId": "clxxx",
    "userId": "cluser",
    "college": {...}
  }
}
```

#### GET /api/saved
Get user's saved colleges.

**Query Parameters**:
- `userId`: User ID

**Response** (200):
```json
{
  "success": true,
  "data": [...]
}
```

#### DELETE /api/saved/[id]
Remove a college from saved items.

**Query Parameters**:
- `userId`: User ID

**Response** (200):
```json
{
  "success": true,
  "message": "College removed from saved"
}
```

### Error Response Format

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error message",
  "errors": {
    "field": ["Validation error"]
  }
}
```

HTTP Status Codes:
- 200: Success
- 201: Created
- 400: Bad Request (validation error)
- 401: Unauthorized
- 404: Not Found
- 409: Conflict (duplicate resource)
- 500: Internal Server Error

## 🧪 Validation Strategy

All inputs are validated using Zod schemas:

- **Auth**: Email format, password strength
- **College Filters**: Rating range, fee ranges, pagination limits
- **College ID**: CUID format validation
- **Comparison**: 2-3 colleges, no duplicates
- **Saved Items**: Valid college ID, user ID

Validation occurs at:
1. API route handlers (before business logic)
2. Form submissions (before API calls)
3. Query parameters (before database queries)

## 🔒 Security Measures

- **Password Hashing**: bcrypt with cost factor 12
- **SQL Injection Prevention**: Prisma parameterized queries
- **XSS Prevention**: React escaping, CSP headers
- **CSRF Protection**: NextAuth built-in
- **Session Security**: HTTP-only, secure cookies
- **Input Validation**: Zod schemas at all boundaries
- **Rate Limiting**: Recommended for production (not implemented in MVP)

## 🚢 Deployment

### Vercel Deployment

1. **Push code to GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Connect to Vercel**
- Import repository in Vercel dashboard
- Configure environment variables
- Deploy

3. **Environment Variables**
Set these in Vercel project settings:
```
DATABASE_URL=your-neon-database-url
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32
NEXTAUTH_URL=https://your-app.vercel.app
```

### Neon PostgreSQL Setup

1. **Create Neon account**
- Sign up at [neon.tech](https://neon.tech)
- Create a new project

2. **Get connection string**
- Copy the connection string from Neon dashboard
- Add to Vercel environment variables

3. **Run migrations**
```bash
npx prisma db push
```

4. **Seed database**
```bash
npm run db:seed
```

## 🎨 UI/UX Features

- **Loading States**: Skeleton loaders for better perceived performance
- **Empty States**: Helpful CTAs when no data is available
- **Error Handling**: User-friendly error messages with recovery options
- **Toast Notifications**: Feedback for user actions
- **Responsive Design**: Mobile-first approach
- **Accessibility**: ARIA labels, keyboard navigation
- **Professional UI**: Clean design with shadcn/ui components

## 📈 Performance Optimizations

- **Image Optimization**: next/image component
- **Code Splitting**: Dynamic imports
- **Caching**: TanStack Query with 5-minute stale time
- **Query Optimization**: Prisma select/include
- **Pagination**: Limit result sets
- **Debounced Search**: Reduce API calls
- **Lazy Loading**: On-demand component loading

## 🐛 Edge Cases Handled

- **Search Returns Nothing**: Empty state with clear filters option
- **Invalid College ID**: 404 error with helpful message
- **Duplicate Comparison Selection**: Prevented with validation
- **Unauthorized Save Attempt**: 401 error
- **Broken Query Params**: Validation error with details
- **Malformed Requests**: 400 error with field-specific errors
- **Database Errors**: 500 error with logging
- **API Failures**: Error boundaries and retry logic
- **Network Loading States**: Loading skeletons throughout

## 🔄 Tradeoffs

### Monolithic Architecture
**Pros**: Simplified deployment, type safety, faster development
**Cons**: Less isolation, shared runtime
**Decision**: Acceptable for MVP, easy to extract microservices later

### NextAuth Credentials Provider
**Pros**: Full control over user data, simple implementation
**Cons**: No social login (can be added later)
**Decision**: Meets MVP requirements, extensible

### PostgreSQL over MongoDB
**Pros**: Strong relations, ACID compliance, mature ecosystem
**Cons**: Less flexible schema
**Decision**: Better for structured college data with clear relations

### REST over GraphQL
**Pros**: Simple, predictable, easy caching
**Cons**: Over-fetching/under-fetching
**Decision**: Sufficient for MVP, easier to implement correctly

## 🔮 Future Improvements

### Features
- Advanced filters (admission cutoff, campus facilities)
- College recommendations based on profile
- Application tracking system
- Scholarship information
- Virtual campus tours
- Social login (Google, GitHub)
- Email notifications
- User profiles with preferences

### Technical
- Full-text search with PostgreSQL pgvector
- Redis caching layer
- CDN for static assets
- Analytics dashboard
- A/B testing framework
- Rate limiting
- API rate limiting
- Background job queue
- Monitoring and alerting (Sentry)

### Infrastructure
- Multi-region deployment
- Database read replicas
- Queue system for background jobs
- Container orchestration (if needed)

## 📝 Development Workflow

1. **Setup**: Clone repo, install dependencies, configure environment
2. **Database**: Run migrations, seed data
3. **Development**: `npm run dev` with hot reload
4. **Testing**: Run test suite before commits
5. **Build**: `npm run build` to verify production build
6. **Deploy**: Push to main branch, Vercel auto-deploys

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 👥 Team

Built as an internship assignment demonstrating full-stack development skills.

## 📞 Support

For issues and questions, please open an issue on the repository.

---

Built with ❤️ using Next.js, TypeScript, and modern web technologies.
