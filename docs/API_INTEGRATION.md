# Backend API Integration Guide

## Overview
This document describes the frontend integration with the backend API for the Resume Builder application.

## Configuration

### Environment Variables
Create a `.env` file in the root of the frontend project:

```env
VITE_API_URL=http://localhost:3001
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Port Configuration
- **Frontend**: `http://localhost:3000` (Vite dev server)
- **Backend**: `http://localhost:3001` (Express/Serverless Offline)

### Vite Proxy Configuration
The Vite dev server is configured to proxy API requests to the backend:

```typescript
// vite.config.ts
server: {
  port: 3000,
  proxy: {
    '/api': {
      target: 'http://localhost:3001',
      changeOrigin: true,
      secure: false,
    },
  },
}
```

## Architecture

### API Client (`src/utils/axios.ts`)
- Axios instance with base URL configuration
- Request interceptor: Adds authentication token to all requests
- Response interceptor: Handles errors and token expiration
- Helper functions for token management

### API Configuration (`src/config/api.config.ts`)
- Centralized API endpoint definitions
- Storage keys for tokens and user data
- Base URL and timeout configuration

### React Query Configuration (`src/config/react-query.config.ts`)
- Global query client configuration
- Query keys for cache management
- Default options for queries and mutations

### Type Definitions (`src/types/api.types.ts`)
- API request/response types matching backend schema
- Error types
- Authentication types
- User profile types
- Resume types

### Resume Converter (`src/utils/resumeConverter.ts`)
- Converts between frontend Resume format and backend API format
- `backendToFrontendResume()`: Converts API response to frontend format
- `frontendToBackendContent()`: Converts frontend format to API request

## Type System

### Frontend vs Backend Types

**Frontend Resume Format:**
- Uses `Resume` interface with `sections` array
- Each section has `type`, `content`, `enabled`, and `order`
- Optimized for UI rendering and editing

**Backend Resume Format:**
- Uses `BackendResume` interface with `content` JSONB field
- Content contains flat arrays: `experience`, `education`, `skills`, etc.
- Optimized for database storage and API responses

**Conversion:**
```typescript
import { backendToFrontendResume, frontendToBackendContent } from '@/utils/resumeConverter';

// API response to frontend
const frontendResume = backendToFrontendResume(apiResponse.data);

// Frontend to API request
const backendContent = frontendToBackendContent(frontendResume);
```

## Authentication Flow

### Token Storage
- Access token: `localStorage.getItem('access_token')`
- Refresh token: `localStorage.getItem('refresh_token')`
- User data: `localStorage.getItem('user')`

### Token Handling
1. Request interceptor adds token to Authorization header
2. Response interceptor handles 401 errors
3. On 401: Clear tokens and redirect to login

### Helper Functions
```typescript
import { setAuthToken, clearAuthToken, getAuthToken } from '@/utils/axios';

// Set token after login
setAuthToken(response.session.access_token);

// Clear tokens on logout
clearAuthToken();

// Check if user is authenticated
const isAuthenticated = !!getAuthToken();
```

## API Endpoints

### Authentication
- `POST /auth/signup` - Create new account
- `POST /auth/signin` - Sign in with email/password
- `POST /auth/signout` - Sign out
- `GET /auth/session` - Get current session
- `POST /auth/google` - OAuth with Google
- `POST /auth/github` - OAuth with GitHub

### User Profile
- `GET /user/profile` - Get user profile
- `PUT /user/profile` - Update user profile
- `DELETE /user/account` - Delete account

### Resumes
- `GET /resumes` - List all resumes (with pagination)
- `POST /resumes` - Create new resume
- `GET /resumes/:id` - Get resume by ID
- `PUT /resumes/:id` - Update resume
- `DELETE /resumes/:id` - Delete resume
- `POST /resumes/:id/duplicate` - Duplicate resume

### Resume Sharing
- `POST /resumes/:id/share` - Update sharing settings
- `GET /resumes/public/:slug` - Get public resume by slug

### Resume Versions
- `GET /resumes/:id/versions` - List all versions
- `POST /resumes/:id/versions` - Create new version
- `GET /resumes/:id/versions/:versionId` - Get specific version
- `POST /resumes/:id/versions/:versionId/restore` - Restore version

### Resume Export
- `POST /resumes/:id/export` - Export resume (PDF, DOCX, JSON)

### Resume Import
- `POST /resumes/import` - Import resume from file

## Usage Examples

### Making API Calls

```typescript
import { apiClient } from '@/utils/axios';
import { API_CONFIG } from '@/config/api.config';
import type { ResumeResponse, CreateResumeRequest } from '@/types/api.types';

// Create resume
const createResume = async (data: CreateResumeRequest) => {
  const response = await apiClient.post<{ data: ResumeResponse }>(
    API_CONFIG.ENDPOINTS.RESUMES.CREATE,
    data
  );
  return response.data.data;
};

// Get resume
const getResume = async (id: string) => {
  const response = await apiClient.get<{ data: ResumeResponse }>(
    API_CONFIG.ENDPOINTS.RESUMES.GET(id)
  );
  return response.data.data;
};

// Update resume
const updateResume = async (id: string, data: UpdateResumeRequest) => {
  const response = await apiClient.put<{ data: ResumeResponse }>(
    API_CONFIG.ENDPOINTS.RESUMES.UPDATE(id),
    data
  );
  return response.data.data;
};
```

### Using React Query

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/config/react-query.config';

// Fetch resumes
const useResumes = () => {
  return useQuery({
    queryKey: QUERY_KEYS.RESUMES,
    queryFn: async () => {
      const response = await apiClient.get('/resumes');
      return response.data.data;
    },
  });
};

// Create resume mutation
const useCreateResume = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateResumeRequest) => {
      const response = await apiClient.post('/resumes', data);
      return response.data.data;
    },
    onSuccess: () => {
      // Invalidate resumes list to refetch
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.RESUMES });
    },
  });
};
```

## Error Handling

### Error Format
All API errors follow this format:
```typescript
{
  status: number;
  code: string;
  message: string;
  details?: any;
}
```

### Common Error Codes
- `VALIDATION_ERROR` (400) - Invalid request data
- `UNAUTHORIZED` (401) - Missing or invalid token
- `FORBIDDEN` (403) - Insufficient permissions
- `NOT_FOUND` (404) - Resource not found
- `CONFLICT` (409) - Resource already exists
- `NETWORK_ERROR` (0) - Network connection issue
- `UNKNOWN_ERROR` (0) - Unexpected error

### Handling Errors
```typescript
try {
  const resume = await createResume(data);
} catch (error: any) {
  if (error.code === 'VALIDATION_ERROR') {
    // Show validation errors
    console.error('Validation failed:', error.details);
  } else if (error.code === 'UNAUTHORIZED') {
    // Redirect to login
    window.location.href = '/login';
  } else {
    // Show generic error
    console.error('Error:', error.message);
  }
}
```

## Next Steps

### Phase 1 Remaining Tasks
- Task 3: Create API service layer
- Task 4: Implement authentication hooks
- Task 5: Implement resume CRUD hooks
- Task 6: Update ResumeContext to use API
- Task 7: Implement auto-save functionality
- Task 8: Add loading states and error handling
- Task 9: Implement version control UI
- Task 10: Add resume sharing functionality

### Testing
- Test API integration with backend running locally
- Verify token handling and authentication flow
- Test error scenarios (network errors, 401, 404, etc.)
- Verify data conversion between frontend and backend formats

## Resources
- Backend API Documentation: `resumeBuilderBackend/docs/`
- Axios Documentation: https://axios-http.com/
- React Query Documentation: https://tanstack.com/query/latest
