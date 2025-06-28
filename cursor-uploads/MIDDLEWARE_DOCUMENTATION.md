# Thoughtmarks Middleware Documentation

## Overview
Complete documentation of all middleware implementations and their usage throughout the Thoughtmarks application.

## Security Middleware

### 1. Security Headers (`server/security.ts`)
```typescript
export const securityHeaders = helmet({...})
```
**Applied:** Global via `server/index.ts:25`
**Purpose:** Sets comprehensive security headers including CSP, HSTS, XSS protection
**Configuration:**
- Content Security Policy with specific directives
- Cross-origin policies disabled for development
- Object and frame sources blocked

### 2. Rate Limiting (`server/security.ts`)
```typescript
export const apiRateLimit = rateLimit({...})
```
**Applied:** API routes via `server/index.ts:28`
**Configuration:**
- Window: 15 minutes
- Max requests: 100 per IP
- Standard headers enabled
- Custom error message for exceeded limits

## Authentication Middleware

### 3. Custom Authentication (`server/routes.ts:309`)
```typescript
function requireAuth(req: any, res: Response, next: NextFunction)
```
**Applied:** Protected API endpoints throughout routes
**Authentication Methods:**
- Session-based authentication (primary)
- Bearer token authentication (demo users)
- Header-based user ID authentication (fallback)
**Usage Examples:**
- `app.put("/api/users/:id", requireAuth, ...)`
- `app.get("/api/thoughtmarks", requireAuth, ...)`
- `app.post("/api/bins", requireAuth, ...)`

## Permission-Based Middleware (`server/permissions.ts`)

### 4. Role-Based Access Control
```typescript
export function requirePermission(permission: string)
export function requireAdmin(req: any, res: any, next: any)
export function requirePremium(req: any, res: any, next: any)
export function requireDeveloper(req: any, res: any, next: any)
export function requireSuperuser(req: any, res: any, next: any)
export function requireStoreManager(req: any, res: any, next: any)
export function requireAIManager(req: any, res: any, next: any)
```

**Permission System Features:**
- Hierarchical role inheritance
- Granular permission checking
- Feature-specific access control
- Subscription status validation

**Available Permissions:**
- `all_access` - Full system access
- `premium_features` - Premium functionality
- `demo_access` - Demo user privileges
- `template_system` - Template inheritance
- `content_inheritance` - Content copying
- `developer_access` - Development features
- `superuser_access` - Superuser privileges
- `store_management` - App Store features
- `ai_management` - AI system control
- `tier_basic/pro/enterprise` - Premium tiers
- `advanced_ai` - Advanced AI features
- `user_management` - User administration
- `analytics` - System analytics
- `system_debug` - Debug capabilities
- `code_deployment` - Deployment access

## Session Middleware (`server/index.ts`)

### 5. Express Session Configuration
```typescript
app.use(session({...}))
```
**Configuration:**
- Secret: 'thoughtmarks-demo-secret'
- No auto-save/initialization
- Cookie settings: 24-hour expiry, HTTP-only, secure disabled for development

## Request Processing Middleware

### 6. Body Parser Middleware (`server/index.ts:43-44`)
```typescript
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: false, limit: "10mb" }))
```
**Purpose:** Parse JSON and URL-encoded request bodies
**Limit:** 10MB for file uploads and large content

### 7. Request Logging Middleware (`server/index.ts:46-86`)
**Features:**
- Response time tracking
- JSON response capture
- API request logging with truncation
- Security event logging for errors (400+ status codes)
- IP and User-Agent tracking

## Environment Validation (`server/security.ts`)

### 8. Environment Validation
```typescript
export function validateEnvironment(): void
```
**Required Variables:**
- `DATABASE_URL` - PostgreSQL connection
- `OPENAI_API_KEY` - AI functionality
**Applied:** Server startup in `server/index.ts:13-17`

## Application Order

### Middleware Application Sequence (`server/index.ts`)
1. **Trust Proxy** - Configure for rate limiting
2. **Security Headers** - Apply Helmet protection
3. **Rate Limiting** - Protect API routes
4. **Session Management** - Demo authentication
5. **Body Parsing** - JSON/URL-encoded data
6. **Request Logging** - Track all requests
7. **Route Registration** - Apply route-specific middleware

## Route-Specific Middleware Usage

### Authentication Required Routes
- All thoughtmark operations: GET/POST/PUT/DELETE `/api/thoughtmarks/*`
- All bin operations: GET/POST/PUT/DELETE `/api/bins/*`
- User profile updates: PUT `/api/users/:id`
- AI features: POST `/api/ai/*`
- Admin operations: All `/api/admin/*` routes

### Public Routes (No Authentication)
- User registration: POST `/api/users`
- Demo authentication: POST `/api/auth/demo`
- Admin authentication: POST `/api/auth/admin`
- User lookup by Firebase UID: GET `/api/users/by-firebase/:uid`

### Permission-Protected Routes
While the permission middleware functions exist, they are primarily used within the authentication middleware logic rather than as separate route guards.

## Security Event Logging

### Security Events Tracked
- API errors (400+ status codes)
- Authentication failures
- Permission denials
- Request metadata (IP, User-Agent, duration)

## Integration Notes

### Frontend Integration
- Client-side auth hooks: `client/src/hooks/use-auth.ts`
- Authentication dialogs: `client/src/components/auth-prompt-dialog.tsx`
- Demo authentication: `server/demo-auth.ts`

### Database Integration
- User role validation via PostgreSQL
- Permission caching via `PermissionManager`
- Session storage for demo users

This middleware stack provides comprehensive security, authentication, authorization, and request processing for the Thoughtmarks application.