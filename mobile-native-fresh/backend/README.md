# Thoughtmarks Backend API

Complete backend system for the Thoughtmarks mobile app, migrated from the production Replit environment.

## 🚀 Quick Start

### 1. Install Dependencies
```{ { { { bash
npm install & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
```

### 2. Set up Database
You have two options:

#### Option A: Local PostgreSQL
```{ { { { bash
# Install PostgreSQL locally & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
brew install postgresql  # macOS
# or
sudo apt-get install postgresql  # Ubuntu

# Create database
createdb thoughtmarks

# Set environment variables
export DATABASE_URL="postgresql://postgres:password@localhost:5432/thoughtmarks"
```

#### Option B: Use the Production Database
The export includes connection details for the production Neon PostgreSQL database. You'll need to:
1. Get the actual database credentials from the export
2. Set the environment variables accordingly

### 3. Run Database Migrations
```{ { { { bash
npm run migrate & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
```

### 4. Start Development Server
```{ { { { { { { { bash
npm run dev & } >/dev/null 2>&1 & disown &  & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown &  & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown & & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown
```

The API will be available at `http://localhost:5000`

## 📊 Database Schema

The complete database schema includes:

### Users Table
- Authentication and profile data
- Subscription management
- Preferences and settings
- Role-based access control

### Thoughtmarks Table
- Core content storage
- Task management features
- AI-generated metadata
- Voice note support
- Archiving and deletion

### Bins Table
- Organizational containers
- Hierarchical structure
- Custom colors and icons
- Sort ordering

### Additional Tables
- User roles and permissions
- Email verification codes
- Audit trails

## 🔐 Authentication

The backend supports multiple authentication methods:

### Local Authentication
- Email/password registration and login
- JWT token-based sessions
- Password reset functionality

### OAuth Integration (Ready for Firebase)
- Google OAuth
- Apple Sign-In
- Firebase Auth integration

### Demo Mode
- Automatic demo user creation
- No authentication required for testing

## 🛠️ API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/demo` - Demo login
- `POST /api/auth/validate` - Token validation

### Users
- `GET /api/users/profile` - Get user profile
- `PATCH /api/users/profile` - Update profile
- `GET /api/users/:id` - Get user by ID
- `PATCH /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Thoughtmarks
- `GET /api/thoughtmarks` - List thoughtmarks
- `POST /api/thoughtmarks` - Create thoughtmark
- `GET /api/thoughtmarks/:id` - Get thoughtmark
- `PATCH /api/thoughtmarks/:id` - Update thoughtmark
- `DELETE /api/thoughtmarks/:id` - Delete thoughtmark
- `GET /api/thoughtmarks/search` - Search thoughtmarks
- `POST /api/thoughtmarks/:id/toggle-pin` - Toggle pin
- `POST /api/thoughtmarks/:id/toggle-archive` - Toggle archive

### Bins
- `GET /api/bins` - List bins
- `POST /api/bins` - Create bin
- `GET /api/bins/:id` - Get bin
- `PATCH /api/bins/:id` - Update bin
- `DELETE /api/bins/:id` - Delete bin

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
# Database
DATABASE_URL=postgresql://username:password@host:port/database
PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=password
PGDATABASE=thoughtmarks

# JWT
JWT_SECRET=your-super-secret-jwt-key

# Server
PORT=5000
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8081

# Firebase (for later)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-service-account-email

# OpenAI (for later)
OPENAI_API_KEY=your-openai-api-key

# OAuth (for later)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
APPLE_CLIENT_ID=your-apple-client-id
APPLE_TEAM_ID=your-apple-team-id
APPLE_KEY_ID=your-apple-key-id
APPLE_PRIVATE_KEY=your-apple-private-key
```

## 📈 Production Data

The export includes:
- **16 total users** (including 2 admin accounts)
- **140 thoughtmarks** with full content
- **173 bins** with organizational structure
- **Complete API endpoint mapping**
- **Database schema with relationships**

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production Build
```{ { { { bash
npm run build & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
{ { { { npm start & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
```

### Database Management
```{ { { { bash
npm run migrate    # Run migrations & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
{ { { { npm run db:studio  # Open Drizzle Studio & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
```

## 🔒 Security Features

- **Rate limiting** on all endpoints
- **CORS protection** with configurable origins
- **Helmet security headers**
- **JWT token validation**
- **Input validation and sanitization**
- **SQL injection protection** via Drizzle ORM

## 📱 Mobile App Integration

The backend is fully compatible with the React Native mobile app:

### API Compatibility
- All endpoints match the mobile app's expectations
- Consistent response format with `success` and `data` fields
- Error handling with descriptive messages

### Authentication Flow
- JWT token-based authentication
- Automatic token refresh
- Demo mode for testing

### Real-time Features
- WebSocket support ready for real-time updates
- Offline-first data synchronization
- Conflict resolution for concurrent edits

## 🧪 Testing

### Manual Testing
```{ { { { bash
# Test health endpoint & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
{ { { { curl http://localhost:5000/health & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown

# Test demo login
{ { { { curl -X POST http://localhost:5000/api/auth/demo & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown

# Test thoughtmarks endpoint
{ { { { curl http://localhost:5000/api/thoughtmarks & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
```

### API Testing
Use tools like Postman or Insomnia to test the full API:
1. Import the API endpoints
2. Set up authentication
3. Test CRUD operations
4. Verify error handling

## 🔄 Migration Status

- ✅ **Database Schema** - Complete with all tables
- ✅ **Authentication System** - Local auth + OAuth ready
- ✅ **API Endpoints** - All CRUD operations
- ✅ **Error Handling** - Comprehensive error responses
- ✅ **Security** - Rate limiting, CORS, validation
- 🔄 **Firebase Integration** - Ready for implementation
- 🔄 **AI Services** - OpenAI integration ready
- 🔄 **Email Services** - SendGrid integration ready

## 📞 Support

For questions or issues:
1. Check the logs for error details
2. Verify environment variables are set correctly
3. Ensure database is running and accessible
4. Test individual endpoints for specific issues

The backend is production-ready and includes all the features from the original Replit deployment! 