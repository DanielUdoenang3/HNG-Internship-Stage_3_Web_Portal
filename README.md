# Insighta Labs+ - Web Portal

The web portal for Insighta Labs+ Profile Intelligence System. A secure, modern React application providing a user-friendly interface for managing and analyzing profile data.

## Features

- **Secure Authentication**: GitHub OAuth 2.0 with PKCE flow
- **Role-Based Access Control**: Admin and Analyst roles with appropriate permissions
- **Dashboard**: Visualize metrics and insights from profile data
- **Profile Management**: List, filter, sort, and paginate through profiles
- **Profile Details**: View comprehensive profile information
- **Natural Language Search**: Search profiles using plain English queries
- **CSV Export**: Download filtered profile data
- **Account Management**: View user information and permissions

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **Styling**: Custom CSS with CSS Variables
- **Icons**: Lucide React
- **HTTP Client**: Axios

## Authentication

The web portal uses a secure authentication system:

1. **OAuth Flow**: GitHub OAuth 2.0 with PKCE for enhanced security
2. **HTTP-Only Cookies**: Access and refresh tokens stored in secure, HTTP-only cookies (not accessible to JavaScript)
3. **CSRF Protection**: Cross-Site Request Forgery tokens included in requests
4. **Auto-Refresh**: Access tokens automatically refreshed every 2 minutes

### Token Lifecycle

- **Access Token**: 3-minute expiry, refreshed automatically
- **Refresh Token**: 5-minute expiry, rotated on each refresh
- **Storage**: HTTP-only cookies (secure from XSS attacks)

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Backend API running (see Stage 3 backend repository)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
# Edit .env and set VITE_API_URL to your backend URL
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Production Build

```bash
npm run build
```

Built files will be in the `dist` directory.

## Project Structure

```
frontend/
├── src/
│   ├── components/        # Reusable components
│   │   ├── Layout.tsx     # Main app layout with sidebar
│   │   ├── ProtectedRoute.tsx
│   │   └── AdminRoute.tsx
│   ├── contexts/          # React contexts
│   │   └── AuthContext.tsx
│   ├── pages/             # Page components
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Profiles.tsx
│   │   ├── ProfileDetail.tsx
│   │   ├── Search.tsx
│   │   ├── Account.tsx
│   │   ├── AuthCallback.tsx
│   │   └── NotFound.tsx
│   ├── services/          # API services
│   │   ├── api.ts         # Axios instance
│   │   ├── auth.ts        # Authentication API
│   │   ├── profiles.ts    # Profiles API
│   │   └── dashboard.ts   # Dashboard API
│   ├── types/             # TypeScript interfaces
│   │   └── index.ts
│   ├── App.tsx            # Main app component
│   ├── main.tsx           # Entry point
│   └── index.css          # Global styles
├── index.html
├── vite.config.ts
├── package.json
└── tsconfig.json
```

## API Integration

All API requests include:

- **X-API-Version: 1** header (required by backend)
- **HTTP-only cookies** for authentication
- **CSRF token** when available

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `/api` |

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Pages

### Login (`/login`)
- GitHub OAuth authentication
- PKCE flow initiation
- Error handling for auth failures

### Dashboard (`/dashboard`)
- System metrics overview
- Total profiles, users, active sessions
- Demographics breakdown (country, age group)
- Recently added profiles

### Profiles (`/profiles`)
- Paginated profile list
- Filters: gender, age group, country
- Sorting: name, age, created date
- Export to CSV
- Create new profile (admin only)
- Delete profile (admin only)

### Profile Detail (`/profiles/:id`)
- Comprehensive profile information
- Demographics data
- Location information
- Data source attribution

### Search (`/search`)
- Natural language search
- Example queries provided
- Pagination support

### Account (`/account`)
- User profile information
- Security settings
- Permission overview

## Role-Based Access Control

### Admin
- Full access to all features
- Create and delete profiles
- Export data
- View all pages

### Analyst
- View profiles
- Search profiles
- Export data
- Cannot create or delete profiles

## Security Features

1. **HTTP-Only Cookies**: Authentication tokens not accessible to JavaScript
2. **CSRF Protection**: Tokens validated on state-changing requests
3. **Auto Logout**: On 401 responses or token expiry
4. **Secure Headers**: API version enforcement
5. **Role Enforcement**: Frontend and backend validation

## Deployment

### Build for Production

```bash
npm run build
```

### Environment Setup

Ensure these environment variables are set in production:

```env
VITE_API_URL=https://your-api-domain.com/api
```

### Static Hosting

The built application (`dist` folder) can be deployed to any static hosting service:
- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront

## CI/CD

GitHub Actions workflow configured for:
- Linting with ESLint
- Type checking with TypeScript
- Build verification

Runs on every push to `main` or `develop` branches and on pull requests.

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Create a feature branch: `git checkout -b feat/feature-name`
2. Make changes following conventional commits
3. Push branch and create a pull request
4. Ensure CI checks pass

## License

[Your License]

## Related Repositories

- [Backend API](../backend) - REST API with authentication
- [CLI Tool](../cli) - Command-line interface
