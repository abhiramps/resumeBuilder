# Quick Start - Backend Integration

## Setup (5 minutes)

### 1. Install Dependencies
```bash
npm install
```

Dependencies installed:
- `axios` - HTTP client
- `@tanstack/react-query` - Data fetching and caching

### 2. Configure Environment
Copy `.env.example` to `.env` and update:
```env
VITE_API_URL=http://localhost:3001
```

### 3. Start Development Servers

**Backend (Terminal 1):**
```bash
cd resumeBuilderBackend
npm run dev
# Backend runs on http://localhost:3001
```

**Frontend (Terminal 2):**
```bash
cd resumeBuilderFrontend
npm run dev
# Frontend runs on http://localhost:3000
```

The frontend will proxy API calls from `http://localhost:3000/api/*` to `http://localhost:3001/api/*`.

## Making API Calls

### Basic Example
```typescript
import { apiClient } from '@/utils/axios';
import { API_CONFIG } from '@/config/api.config';

// GET request
const getResumes = async () => {
  const response = await apiClient.get(API_CONFIG.ENDPOINTS.RESUMES.LIST);
  return response.data.data;
};

// POST request
const createResume = async (data) => {
  const response = await apiClient.post(
    API_CONFIG.ENDPOINTS.RESUMES.CREATE,
    data
  );
  return response.data.data;
};
```

### With React Query
```typescript
import { useQuery, useMutation } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/config/react-query.config';

// Fetch data
const { data, isLoading, error } = useQuery({
  queryKey: QUERY_KEYS.RESUMES,
  queryFn: getResumes,
});

// Mutate data
const { mutate } = useMutation({
  mutationFn: createResume,
  onSuccess: () => {
    // Handle success
  },
});
```

## Authentication

### Set Token After Login
```typescript
import { setAuthToken } from '@/utils/axios';

// After successful login
setAuthToken(response.session.access_token);
```

### Clear Token on Logout
```typescript
import { clearAuthToken } from '@/utils/axios';

clearAuthToken();
```

### Check Authentication
```typescript
import { getAuthToken } from '@/utils/axios';

const isAuthenticated = !!getAuthToken();
```

## Data Conversion

### Backend to Frontend
```typescript
import { backendToFrontendResume } from '@/utils/resumeConverter';

// Convert API response to frontend format
const frontendResume = backendToFrontendResume(apiResponse.data);
```

### Frontend to Backend
```typescript
import { frontendToBackendContent } from '@/utils/resumeConverter';

// Convert frontend format to API request
const backendContent = frontendToBackendContent(frontendResume);
```

## Available Endpoints

All endpoints are defined in `src/config/api.config.ts`:

```typescript
import { API_CONFIG } from '@/config/api.config';

// Auth
API_CONFIG.ENDPOINTS.AUTH.SIGNUP
API_CONFIG.ENDPOINTS.AUTH.SIGNIN
API_CONFIG.ENDPOINTS.AUTH.SIGNOUT

// User
API_CONFIG.ENDPOINTS.USER.PROFILE

// Resumes
API_CONFIG.ENDPOINTS.RESUMES.LIST
API_CONFIG.ENDPOINTS.RESUMES.CREATE
API_CONFIG.ENDPOINTS.RESUMES.GET(id)
API_CONFIG.ENDPOINTS.RESUMES.UPDATE(id)
API_CONFIG.ENDPOINTS.RESUMES.DELETE(id)
API_CONFIG.ENDPOINTS.RESUMES.SHARE(id)
API_CONFIG.ENDPOINTS.RESUMES.EXPORT(id)
```

## Error Handling

```typescript
try {
  const resume = await createResume(data);
} catch (error: any) {
  console.error('Error:', error.message);
  console.error('Code:', error.code);
  console.error('Status:', error.status);
}
```

## Next Steps

1. Create API service layer (Task 3)
2. Implement authentication hooks (Task 4)
3. Implement resume CRUD hooks (Task 5)
4. Update ResumeContext to use API (Task 6)

## Resources

- Full Documentation: `docs/API_INTEGRATION.md`
- Backend API: `resumeBuilderBackend/docs/`
- Type Definitions: `src/types/api.types.ts`
