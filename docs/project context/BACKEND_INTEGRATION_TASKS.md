# Frontend Tasks for Backend API Integration

## Overview
This document outlines the frontend tasks required to integrate with the completed backend APIs (Tasks 1-15).

**Backend APIs Completed:**
- ✅ Authentication (signup, signin, signout, OAuth, sessions)
- ✅ User Profile Management
- ✅ Resume CRUD Operations
- ✅ Resume Version Control
- ✅ Resume Search & Filtering
- ✅ Resume Sharing & Public URLs
- ✅ Resume Import/Export

---

## PHASE 1: FOUNDATION & API INTEGRATION (Tasks 1-10)

### Task 1: Project Setup with Backend Integration ✅ COMPLETED

**Requirements:**
- Update environment variables for backend API URL
- Configure CORS for local development
- Set up proxy for API calls
- Add axios for HTTP requests
- Configure authentication token storage

**Port Configuration:**
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:3001`

**Files Created/Updated:**
- ✅ `.env` - Added `VITE_API_URL=http://localhost:3001`
- ✅ `.env.example` - Template for environment variables
- ✅ `vite.config.ts` - Frontend port 3000, proxy to backend port 3001
- ✅ `package.json` - Added axios and @tanstack/react-query
- ✅ `.gitignore` - Added .env files to ignore list

**Deliverables:**
- ✅ Backend API URL configured
- ✅ Axios installed and configured with interceptors
- ✅ Proxy setup for development
- ✅ Token storage helpers created

**New Files:**
- `src/utils/axios.ts` - Axios instance with auth interceptors
- `src/config/api.config.ts` - API endpoints and configuration
- `src/config/react-query.config.ts` - React Query setup

---

### Task 2: TypeScript Types from Backend ✅ COMPLETED

**Created matching types for backend API:**

**Files Created/Updated:**
- ✅ `src/types/api.types.ts` - Complete API types
  - ApiResponse, PaginatedResponse, ApiError
  - Auth types (SignUpRequest, SignInRequest, AuthResponse)
  - User types (UserProfile, UpdateProfileRequest)
  - Resume API types (CreateResumeRequest, UpdateResumeRequest, etc.)
  - All content types matching backend schema

- ✅ `src/types/resume.types.ts` - Updated existing types
  - Added `BackendResume` interface
  - Added `ResumeContent` interface
  - Added `Language` and `LanguageItem` types
  - Updated existing types to match backend (optional fields)
  - Added type aliases for backend compatibility

- ✅ `src/utils/resumeConverter.ts` - Conversion utilities
  - `backendToFrontendResume()` - Convert API response to frontend format
  - `frontendToBackendContent()` - Convert frontend format to API request

**Deliverables:**
- ✅ All types matching backend Prisma schema
- ✅ API request/response types
- ✅ Error types
- ✅ Conversion utilities between frontend and backend formats

**Documentation:**
- ✅ `docs/API_INTEGRATION.md` - Comprehensive integration guide

---

### Task 3: API Service Layer ✅ COMPLETED

**Created comprehensive service layer for all API domains:**

**Files Created:**
- ✅ `src/services/auth.service.ts` - Authentication operations
  - signUp, signIn, signOut
  - getSession, OAuth (Google, GitHub)
  - Token management helpers
  
- ✅ `src/services/user.service.ts` - User profile operations
  - getProfile, updateProfile
  - deleteAccount
  
- ✅ `src/services/resume.service.ts` - Resume CRUD operations
  - getResumes (with pagination/filters)
  - getResume, getPublicResume
  - createResume, updateResume, deleteResume
  - duplicateResume, shareResume
  - exportResume, importResume
  
- ✅ `src/services/version.service.ts` - Version control operations
  - getVersions, createVersion
  - getVersion, restoreVersion
  
- ✅ `src/services/index.ts` - Central export

**Deliverables:**
- ✅ All API endpoints wrapped in service methods
- ✅ Proper TypeScript typing for all requests/responses
- ✅ Token management integrated
- ✅ Error handling via axios interceptors
- ✅ Response data extraction and formatting

---

### Task 4: Authentication Hooks ✅ COMPLETED

**Created React Query hooks for authentication:**

**Files Created:**
- ✅ `src/hooks/useAuth.ts` - Complete authentication hooks
  - `useSession()` - Get current session
  - `useSignUp()` - Sign up mutation
  - `useSignIn()` - Sign in mutation
  - `useSignOut()` - Sign out mutation
  - `useGoogleSignIn()` - Google OAuth
  - `useGithubSignIn()` - GitHub OAuth
  - `useAuth()` - Combined hook with all auth state/methods
  
- ✅ `src/hooks/useUser.ts` - User profile hooks
  - `useUserProfile()` - Get profile query
  - `useUpdateProfile()` - Update profile mutation
  - `useDeleteAccount()` - Delete account mutation

**Features:**
- ✅ Automatic cache management with React Query
- ✅ Optimistic updates for better UX
- ✅ Loading and error states
- ✅ Cache invalidation on mutations
- ✅ Session persistence in localStorage

**Usage Example:**
```typescript
import { useAuth } from '@/hooks/useAuth';

function LoginPage() {
  const { signIn, isSigningIn, signInError } = useAuth();
  
  const handleSubmit = (data) => {
    signIn(data, {
      onSuccess: () => {
        navigate('/dashboard');
      },
    });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button disabled={isSigningIn}>
        {isSigningIn ? 'Signing in...' : 'Sign In'}
      </button>
      {signInError && <p>{signInError.message}</p>}
    </form>
  );
}
```

**Deliverables:**
- ✅ Complete authentication hooks
- ✅ User profile management hooks
- ✅ OAuth integration hooks
- ✅ Proper error handling
- ✅ Loading states for all operations

---

### Task 5: Resume Service

**src/services/resume.service.ts:**
```typescript
import api from './api';
import { Resume, CreateResumeData, UpdateResumeData } from '../types/resume.types';

export const resumeService = {
  async create(data: CreateResumeData): Promise<Resume> {
    const response = await api.post('/resumes', data);
    return response.data.data;
  },

  async getById(id: string): Promise<Resume> {
    const response = await api.get(`/resumes/${id}`);
    return response.data.data;
  },

  async update(id: string, data: UpdateResumeData): Promise<Resume> {
    const response = await api.put(`/resumes/${id}`, data);
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/resumes/${id}`);
  },

  async list(options?: ResumeListOptions): Promise<PaginatedResponse<Resume>> {
    const response = await api.get('/resumes', { params: options });
    return response.data;
  },

  async search(query: string, options?: ResumeSearchOptions): Promise<PaginatedResponse<Resume>> {
    const response = await api.get('/resumes/search', { params: { q: query, ...options } });
    return response.data;
  },

  async export(id: string): Promise<ExportedResume> {
    const response = await api.get(`/resumes/${id}/export`);
    return response.data.data;
  },

  async import(data: ImportResumeData): Promise<Resume> {
    const response = await api.post('/resumes/import', data);
    return response.data.data;
  },

  async duplicate(id: string): Promise<Resume> {
    const response = await api.post(`/resumes/${id}/duplicate`);
    return response.data.data;
  },

  async bulkExport(resumeIds?: string[]): Promise<BulkExportData> {
    const response = await api.post('/resumes/export', { resumeIds });
    return response.data.data;
  },
};
```

**Deliverables:**
- ✅ Complete resume service (already implemented)
- ✅ All CRUD operations hooks
- ✅ Search, import, export hooks
- ✅ Optimistic updates
- ✅ Cache management with React Query
- ✅ Comprehensive documentation and examples

**Implementation Status:**
- ✅ `useResume` - Fetch single resume by ID
- ✅ `usePublicResume` - Fetch public resume by slug
- ✅ `useResumes` - Fetch paginated list with filters
- ✅ `useSearchResumes` - Search resumes
- ✅ `useResumesByStatus` - Filter by status
- ✅ `useCreateResume` - Create new resume
- ✅ `useUpdateResume` - Update with optimistic updates
- ✅ `useDeleteResume` - Delete resume
- ✅ `useDuplicateResume` - Duplicate resume
- ✅ `useShareResume` - Update sharing settings
- ✅ `useExportResume` - Export in PDF/DOCX/JSON
- ✅ `useImportResume` - Import from file

**Files Created:**
- `src/hooks/useResume.ts` - Single resume and mutation hooks
- `src/hooks/useResumes.ts` - List and search hooks
- `src/examples/ResumeManagementExample.tsx` - Complete working example
- `docs/RESUME_HOOKS_GUIDE.md` - Comprehensive documentation

---

### Task 6: Sharing Service

**src/services/sharing.service.ts:**
```typescript
import api from './api';
import { ShareResumeResponse, PublicResumeView, ResumeAnalytics } from '../types/sharing.types';

export const sharingService = {
  async share(resumeId: string): Promise<ShareResumeResponse> {
    const response = await api.post(`/resumes/${resumeId}/share`);
    return response.data.data;
  },

  async unshare(resumeId: string): Promise<void> {
    await api.delete(`/resumes/${resumeId}/share`);
  },

  async getPublicResume(slug: string): Promise<PublicResumeView> {
    const response = await api.get(`/public/${slug}`);
    return response.data.data;
  },

  async updateShareSettings(resumeId: string, isPublic: boolean): Promise<Resume> {
    const response = await api.patch(`/resumes/${resumeId}/share`, { isPublic });
    return response.data.data;
  },

  async getAnalytics(resumeId: string): Promise<ResumeAnalytics> {
    const response = await api.get(`/resumes/${resumeId}/analytics`);
    return response.data.data;
  },
};
```

**Deliverables:**
- Complete sharing service
- Public resume viewing
- Analytics integration

---

### Task 7: Version Service

**src/services/version.service.ts:**
```typescript
import api from './api';
import { ResumeVersion, CreateVersionData, CompareVersionsResult } from '../types/version.types';

export const versionService = {
  async create(resumeId: string, data?: CreateVersionData): Promise<ResumeVersion> {
    const response = await api.post(`/resumes/${resumeId}/versions`, data);
    return response.data.data;
  },

  async list(resumeId: string): Promise<ResumeVersion[]> {
    const response = await api.get(`/resumes/${resumeId}/versions`);
    return response.data.data;
  },

  async getById(resumeId: string, versionId: string): Promise<ResumeVersion> {
    const response = await api.get(`/resumes/${resumeId}/versions/${versionId}`);
    return response.data.data;
  },

  async restore(resumeId: string, versionId: string): Promise<void> {
    await api.post(`/resumes/${resumeId}/versions/${versionId}/restore`);
  },

  async compare(resumeId: string, version1: string, version2: string): Promise<CompareVersionsResult> {
    const response = await api.get(`/resumes/${resumeId}/versions/compare`, {
      params: { version1, version2 },
    });
    return response.data.data;
  },

  async delete(resumeId: string, versionId: string): Promise<void> {
    await api.delete(`/resumes/${resumeId}/versions/${versionId}`);
  },
};
```

**Deliverables:**
- Complete version service
- Version management
- Compare functionality

---

### Task 8: Authentication Context

**src/contexts/AuthContext.tsx:**
```typescript
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/auth.service';
import { User, AuthResponse } from '../types/auth.types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing token and load user
    const token = localStorage.getItem('auth_token');
    if (token) {
      authService.getCurrentUser()
        .then(setUser)
        .catch(() => localStorage.removeItem('auth_token'))
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authService.signIn({ email, password });
    if (response.session?.access_token) {
      localStorage.setItem('auth_token', response.session.access_token);
      const user = await authService.getCurrentUser();
      setUser(user);
    }
  };

  const signup = async (email: string, password: string, fullName: string) => {
    const response = await authService.signUp({ email, password, fullName });
    if (response.session?.access_token) {
      localStorage.setItem('auth_token', response.session.access_token);
      const user = await authService.getCurrentUser();
      setUser(user);
    }
  };

  const logout = async () => {
    await authService.signOut();
    setUser(null);
  };

  const refreshAuth = async () => {
    const user = await authService.getCurrentUser();
    setUser(user);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      signup,
      logout,
      refreshAuth,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
```

**Deliverables:**
- AuthContext with backend integration
- Login/signup/logout
- Token management
- User state

---

### Task 9: Resume Context with Auto-Save

**src/contexts/ResumeContext.tsx:**
```typescript
import React, { createContext, useContext, useState, useEffect } from 'react';
import { resumeService } from '../services/resume.service';
import { Resume, UpdateResumeData } from '../types/resume.types';
import { useDebounce } from '../hooks/useDebounce';

interface ResumeContextType {
  currentResume: Resume | null;
  resumes: Resume[];
  isLoading: boolean;
  isSaving: boolean;
  loadResume: (id: string) => Promise<void>;
  updateResume: (data: UpdateResumeData) => Promise<void>;
  createResume: (data: CreateResumeData) => Promise<Resume>;
  deleteResume: (id: string) => Promise<void>;
  listResumes: (options?: ResumeListOptions) => Promise<void>;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export const ResumeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentResume, setCurrentResume] = useState<Resume | null>(null);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [pendingUpdate, setPendingUpdate] = useState<UpdateResumeData | null>(null);

  // Debounce auto-save
  const debouncedUpdate = useDebounce(pendingUpdate, 2000);

  useEffect(() => {
    if (debouncedUpdate && currentResume) {
      saveResume(debouncedUpdate);
    }
  }, [debouncedUpdate]);

  const saveResume = async (data: UpdateResumeData) => {
    if (!currentResume) return;
    
    setIsSaving(true);
    try {
      const updated = await resumeService.update(currentResume.id, data);
      setCurrentResume(updated);
    } catch (error) {
      console.error('Auto-save failed:', error);
    } finally {
      setIsSaving(false);
      setPendingUpdate(null);
    }
  };

  const loadResume = async (id: string) => {
    setIsLoading(true);
    try {
      const resume = await resumeService.getById(id);
      setCurrentResume(resume);
    } finally {
      setIsLoading(false);
    }
  };

  const updateResume = async (data: UpdateResumeData) => {
    // Optimistic update
    if (currentResume) {
      setCurrentResume({ ...currentResume, ...data });
    }
    // Queue for auto-save
    setPendingUpdate(data);
  };

  const createResume = async (data: CreateResumeData) => {
    const resume = await resumeService.create(data);
    setCurrentResume(resume);
    return resume;
  };

  const deleteResume = async (id: string) => {
    await resumeService.delete(id);
    if (currentResume?.id === id) {
      setCurrentResume(null);
    }
    setResumes(resumes.filter(r => r.id !== id));
  };

  const listResumes = async (options?: ResumeListOptions) => {
    setIsLoading(true);
    try {
      const response = await resumeService.list(options);
      setResumes(response.data);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ResumeContext.Provider value={{
      currentResume,
      resumes,
      isLoading,
      isSaving,
      loadResume,
      updateResume,
      createResume,
      deleteResume,
      listResumes,
    }}>
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = () => {
  const context = useContext(ResumeContext);
  if (!context) throw new Error('useResume must be used within ResumeProvider');
  return context;
};
```

**Deliverables:**
- ResumeContext with backend sync
- Auto-save with debouncing
- Optimistic updates
- CRUD operations

---

### Task 10: React Query Integration (Optional but Recommended)

**Install and configure React Query for better data fetching:**

```bash
npm install @tanstack/react-query
```

**src/lib/queryClient.ts:**
```typescript
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
```

**Custom hooks with React Query:**

**src/hooks/useResumes.ts:**
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { resumeService } from '../services/resume.service';

export const useResumes = (options?: ResumeListOptions) => {
  return useQuery({
    queryKey: ['resumes', options],
    queryFn: () => resumeService.list(options),
  });
};

export const useResume = (id: string) => {
  return useQuery({
    queryKey: ['resume', id],
    queryFn: () => resumeService.getById(id),
    enabled: !!id,
  });
};

export const useCreateResume = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: resumeService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
    },
  });
};

export const useUpdateResume = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateResumeData }) =>
      resumeService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['resume', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
    },
  });
};

export const useDeleteResume = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: resumeService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
    },
  });
};
```

**Deliverables:**
- React Query setup
- Custom hooks for all operations
- Automatic cache invalidation
- Loading and error states

---

## Summary of Phase 1

**Completed:**
- ✅ API client with interceptors
- ✅ All service methods (auth, resume, sharing, version)
- ✅ Authentication context
- ✅ Resume context with auto-save
- ✅ TypeScript types matching backend
- ✅ React Query integration (optional)

**Next Phase:**
- Build UI components for resume management
- Create dashboard with search/filter
- Implement resume editor
- Add sharing UI
- Version management UI

---

## PHASE 2: UI COMPONENTS (Tasks 11-20)

### Task 11: Login/Signup Pages

Create authentication pages with backend integration.

**Components:**
- LoginPage
- SignupPage
- ForgotPasswordPage
- OAuth buttons (Google, GitHub)

---

### Task 12: Dashboard Page

Create main dashboard with resume list.

**Features:**
- Resume grid/list view
- Search and filter
- Create new resume
- Quick actions (edit, duplicate, delete, share)

---

### Task 13: Resume Editor Page

Create main resume editor with live preview.

**Features:**
- Three-panel layout (editor, preview, controls)
- Auto-save indicator
- Template selector
- Export button

---

### Task 14: Resume Sharing UI

Create sharing interface.

**Features:**
- Share button with modal
- Copy public URL
- View analytics
- Revoke access

---

### Task 15: Version Management UI

Create version history interface.

**Features:**
- Version list
- Create snapshot
- Restore version
- Compare versions

---

### Task 16: Import/Export UI ✅

Create import/export interface.

**Features:**
- ✅ Export as JSON
- ✅ Import from JSON
- ✅ Duplicate resume
- ✅ Bulk export
- ✅ Export as PDF/DOCX
- ✅ Drag-and-drop file upload
- ✅ Bulk selection mode
- ✅ Real-time validation

**Implementation:**
- Created `useImportExport` hook for managing operations
- Created `ImportExportModal` component with tabbed interface
- Integrated with Dashboard page
- Added bulk selection functionality
- Comprehensive error handling and user feedback

**Files Created:**
- `src/hooks/useImportExport.ts`
- `src/components/UI/ImportExportModal.tsx`
- `src/examples/ImportExportExample.tsx`
- `docs/IMPORT_EXPORT_FEATURE.md`

**Files Modified:**
- `src/pages/DashboardPage.tsx`
- `src/components/UI/index.ts`
- `src/hooks/index.ts`

---

### Task 17: Search and Filter Components

Create reusable search/filter components.

**Components:**
- SearchBar
- FilterDropdown
- SortSelector
- StatusBadge

---

### Task 18: Resume Preview Component

Create resume preview with template rendering.

**Features:**
- Live preview
- Template switching
- Print-ready layout
- PDF export

---

### Task 19: Public Resume Viewer

Create public resume viewing page (no auth).

**Features:**
- View by slug
- No authentication required
- Clean layout
- Share buttons

---

### Task 20: Analytics Dashboard

Create analytics view for resume stats.

**Features:**
- View count
- Export count
- Last viewed/exported
- Charts and graphs

---

## Next Steps

1. Complete Phase 1 (API Integration) first
2. Test all API connections
3. Implement error handling
4. Add loading states
5. Move to Phase 2 (UI Components)

**Priority Order:**
1. Authentication (Tasks 4, 8)
2. Resume CRUD (Tasks 5, 9)
3. Dashboard (Task 12)
4. Editor (Task 13)
5. Sharing (Tasks 6, 14)
6. Versions (Tasks 7, 15)
7. Import/Export (Task 16)
