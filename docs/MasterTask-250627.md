# MASTER TASK LIST 250627
### Post Core App Sprint Roadmap

nano 1_deeplink-siri.cursor-instruction.json



## 1. Deep Linking & Siri Shortcuts
- Register and test universal/app-specific deep link schemes
- Implement deep link and Siri shortcut handlers for direct routing
- Test Siri integration and custom shortcuts

**Tag:** `v1.3.2_deeplink-siri`

---

## 2. StoreKit/Subscriptions & Role Management
- Integrate StoreKit (Expo IAP or native)
- Add purchase, restore, and role-mapping logic (Firebase)
- Implement and test upgrade/restore screens

**Tag:** `v1.3.3_storekit-premium`

---

## 3. Premium Feature Enforcement & QA
- Audit and enforce premium gating on all features
- Write anti-regression tests
- Polish premium upsell flows

**Tag:** `v1.3.4_premium-audit-qa`

---

## 4. Advanced Features (Optional)
- Offline/sync
- Push notifications
- Export/import/backup
- Social/share integrations

**Tag:** `v1.3.5_advanced-features`

---

## 5. Release Readiness & QA
- End-to-end flow test: login, onboarding, paywall, deep link, Siri, premium
- Final accessibility/theming/UI polish (liquid theme/glass on dev branch)
- Final EAS/TestFlight build

**Tag:** `v1.3.6_release-candidate`

---

## 6. Launch/Docs/Marketing
- Docs & onboarding
- Store assets
- Marketing copy/screenshots
- Prep TestFlight/Public/App Store launch

1. Deep Linking & Siri Shortcuts
Register deep link schemes (universal links or app-specific).

Implement handlers that route users directly to the right screen/context from a URL or Siri shortcut.

Test Siri integration (as “add to Siri” or custom shortcut, not full voice intent, unless you want to push further).

Tag: v1.3.2_deeplink-siri

2. StoreKit/Subscriptions & Role Management
Add StoreKit integration (Expo in-app-purchases or custom native module).

Implement purchase flow, receipt validation, restore purchases, etc.

Map successful purchases to user roles in Firebase.

Add fallback/upgrade screens and test in sandbox.

Tag: v1.3.3_storekit-premium

3. Premium Feature Enforcement & QA
Audit all premium features and ensure they’re reliably gated behind role checks.

Write tests to prevent regressions or “free access” bugs.

Polish premium upsell flows and overlays.

Tag: v1.3.4_premium-audit-qa

4. Advanced Features (Optional)
Offline/sync logic

Device-level push notification integration

Export/import/backup flows

Social/share integrations

Tag: v1.3.5_advanced-features

5. Release Readiness & QA
End-to-end smoke test across all flows (login, onboarding, paywall, deep links, voice, premium)

Final accessibility, theming, and UI polish passes (UI/Glass/Theme can be run here as isolated branches)

Final EAS/testflight build and distribution

Tag: v1.3.6_release-candidate

6. Launch/Docs/Marketing
Update docs, in-app onboarding, and store assets

Create or update marketing copy/screenshots

Prep launch sequence (TestFlight/public, store listing, press, etc)

Suggested Cursor Phase File for Next Step
If you want, I can prepare the next hybrid Cursor block as:

/tasks/phase-deeplink-siri.cursor-instruction.json

/tasks/phase-storekit-premium.cursor-instruction.json

/tasks/phase-premium-qa.cursor-instruction.json





# Thoughtmarks - Personal Knowledge Management System

## Project Overview

Thoughtmarks is a sophisticated personal knowledge management application that leverages AI technologies to create an intelligent, visually dynamic user experience for capturing, organizing, and exploring personal insights.

## Architecture

### Technology Stack
- **Frontend**: React with TypeScript, Tailwind CSS, Framer Motion
- **Mobile**: React Native with TypeScript
- **iOS**: SwiftUI with Swift Package Manager
- **Backend**: Node.js with Express, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Firebase Auth
- **AI Integration**: OpenAI GPT-4o for categorization and insights
- **Deployment**: Docker, Railway, Vercel

### System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web Client    │    │  Mobile Client  │    │   iOS Client    │
│    (React)      │    │ (React Native)  │    │   (SwiftUI)     │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          └──────────────┬───────────────────────────────┘
                         │
                ┌────────▼────────┐
                │   API Gateway   │
                │   (Express.js)  │
                └────────┬────────┘
                         │
          ┌──────────────┼──────────────┐
          │              │              │
    ┌─────▼─────┐  ┌────▼────┐  ┌─────▼─────┐
    │PostgreSQL │  │Firebase │  │  OpenAI   │
    │ Database  │  │  Auth   │  │    API    │
    └───────────┘  └─────────┘  └───────────┘
```

## Platform Structure

### Web Application (`/web-src`)
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **State Management**: TanStack Query for server state
- **Routing**: Wouter for lightweight routing
- **Build Tool**: Vite for fast development and optimized builds

### Mobile Application (`/react-native`)
- **Framework**: React Native 0.72 with TypeScript
- **Navigation**: React Navigation 6
- **State Management**: Context API with custom hooks
- **Platform Support**: iOS and Android

### iOS Application (`/swiftui`)
- **Framework**: SwiftUI for iOS 16+
- **Architecture**: MVVM with ObservableObject
- **Dependency Management**: Swift Package Manager
- **Data Persistence**: Core Data with CloudKit sync

### Backend API (`/backend`)
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Firebase Admin SDK
- **AI Integration**: OpenAI API for smart features
- **Security**: Helmet, CORS, rate limiting

## Key Features

### Core Functionality
- **Thought Capture**: Quick note-taking with rich text support
- **AI Categorization**: Automatic tagging and organization
- **Smart Search**: Semantic search with vector embeddings
- **Visual Organization**: Drag-and-drop bins and collections
- **Cross-Platform Sync**: Real-time synchronization across devices

### Advanced Features
- **Voice Input**: Speech-to-text with AI enhancement
- **Smart Insights**: Pattern recognition and suggestions
- **Task Management**: Due dates, priorities, and completion tracking
- **Export System**: Complete project export for developers

## Development Workflow

### Local Setup
1. **Prerequisites**
   - Node.js 16+
   - PostgreSQL 14+
   - Firebase project
   - OpenAI API key

2. **Installation**
   ```bash
   # Install dependencies
   npm install
   
   # Setup environment
   cp .env.example .env
   
   # Database setup
   npm run migrate
   
   # Start development
   npm run dev
   ```

### Testing Strategy
- **Unit Tests**: Jest for backend logic
- **Integration Tests**: API endpoint testing
- **E2E Tests**: Playwright for web application
- **Mobile Testing**: Detox for React Native

### Deployment Pipeline
1. **Development**: Feature branches with PR reviews
2. **Staging**: Automatic deployment on main branch
3. **Production**: Manual deployment with approval gates

## API Reference

### Authentication
All API endpoints require authentication via Firebase tokens.

### Core Endpoints
- `GET /api/thoughtmarks` - Fetch user's thoughtmarks
- `POST /api/thoughtmarks` - Create new thoughtmark
- `PUT /api/thoughtmarks/:id` - Update thoughtmark
- `DELETE /api/thoughtmarks/:id` - Delete thoughtmark
- `GET /api/bins` - Fetch user's bins
- `POST /api/search` - Semantic search

### AI Endpoints
- `POST /api/ai/categorize` - Auto-categorize content
- `POST /api/ai/insights` - Generate insights
- `POST /api/ai/suggest-tags` - Tag suggestions

## Performance Considerations

### Frontend Optimization
- Code splitting with dynamic imports
- Image optimization and lazy loading
- Virtual scrolling for large lists
- Service worker for offline support

### Backend Optimization
- Database indexing on search fields
- Query optimization with Drizzle
- Caching with Redis for frequent queries
- Rate limiting to prevent abuse

### Mobile Optimization
- Bundle size optimization
- Image caching and compression
- Offline data persistence
- Background sync capabilities

## Security Measures

### Authentication & Authorization
- Firebase Authentication with JWT tokens
- Role-based access control
- API rate limiting
- CORS configuration

### Data Protection
- Input validation with Zod schemas
- SQL injection prevention with ORM
- XSS protection with sanitization
- Encrypted data transmission (HTTPS)

## Monitoring & Analytics

### Application Monitoring
- Error tracking with Sentry
- Performance monitoring with APM
- Custom analytics events
- User behavior tracking

### Infrastructure Monitoring
- Database performance metrics
- API response times
- Error rates and alerts
- Resource utilization tracking

## Contributing Guidelines

### Code Standards
- TypeScript for type safety
- ESLint and Prettier for code formatting
- Conventional commits for commit messages
- Code reviews required for all changes

### Development Process
1. Create feature branch from main
2. Implement feature with tests
3. Submit pull request with description
4. Code review and approval
5. Merge to main and deploy

## Troubleshooting

### Common Issues
- **Database Connection**: Check PostgreSQL service and credentials
- **Firebase Auth**: Verify service account configuration
- **OpenAI API**: Ensure API key is valid and has credits
- **Build Errors**: Clear node_modules and reinstall dependencies

### Debug Tools
- Backend: Winston logging with structured output
- Frontend: React DevTools and TanStack Query DevTools
- Mobile: Flipper for React Native debugging
- iOS: Xcode Instruments for performance profiling

## License

This project is licensed under the MIT License. See LICENSE file for details.

## Support

For technical support or questions:
- Create an issue in the GitHub repository
- Check the troubleshooting guide
- Review the API documentation
- Contact the development team
