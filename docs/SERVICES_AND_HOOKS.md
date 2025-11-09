# Services and Hooks Guide

## Overview

This guide covers the API service layer and React Query hooks for the Resume Builder application.

## Architecture

```
Components
    ↓
React Query Hooks (useAuth, useResumes, etc.)
    ↓
Services (authService, resumeService, etc.)
    ↓
Axios Client (with interceptors)
    ↓
Backend API
```

## Services

Services are plain JavaScript/TypeScript modules that handle API calls. They return Promises and don't manage state.

### Authentication Service

**Location**: `src/services/auth.service.ts`

```typescript
import { authService } from '@/services';

// Sign up
const response = await authService.signUp({
  email: 'user@example.com',
  password: 'password123',
  fullName: 'John Doe',
});

// Sign in
const response = await authService.signIn({
  email: 'user@example.com',
  password: 'password123',
});

// Sign out
await authService.signOut();

// Get current session
const session = await authService.getSession();

// OAuth
const { url } = await authService.signInWithGoogle();
window.location.href = url;

// Check authentication
const isAuth = authService.isAuthenticated();

// Get stored user
const user = authService.getStoredUser();
```

### User Service

**Location**: `src/services/user.service.ts`

```typescript
import { userService } from '@/services';

// Get profile
const profile = await userService.getProfile();

// Update profile
const updated = await userService.updateProfile({
  fullName: 'Jane Doe',
  avatarUrl: 'https://example.com/avatar.jpg',
});

// Delete account
await userService.deleteAccount();
```

### Resume Service

**Location**: `src/services/resume.service.ts`

```typescript
import { resumeService } from '@/services';

// List resumes with filters
const resumes = await resumeService.getResumes({
  page: 1,
  limit: 10,
  status: 'published',
  search: 'developer',
  sortBy: 'updatedAt',
  sortOrder: 'desc',
});

// Get single resume
const resume = await resumeService.getResume('resume-id');

// Get public resume
const publicResume = await resumeService.getPublicResume('my-resume-slug');

// Create resume
const newResume = await resumeService.createResume({
  title: 'My Resume',
  description: 'Software Developer Resume',
  templateId: 'classic',
  content: {
    personalInfo: { /* ... */ },
    summary: 'Experienced developer...',
  },
});

// Update resume
const updated = await resumeService.updateResume('resume-id', {
  title: 'Updated Title',
  status: 'published',
});

// Delete resume
await resumeService.deleteResume('resume-id');

// Duplicate resume
const duplicate = await resumeService.duplicateResume('resume-id');

// Share resume
const shareInfo = await resumeService.shareResume('resume-id', {
  isPublic: true,
  publicSlug: 'my-resume',
});

// Export resume
const blob = await resumeService.exportResume('resume-id', 'pdf');
const url = URL.createObjectURL(blob);
window.open(url);

// Import resume
const file = event.target.files[0];
const imported = await resumeService.importResume(file);
```

### Version Service

**Location**: `src/services/version.service.ts`

```typescript
import { versionService } from '@/services';

// Get all versions
const versions = await versionService.getVersions('resume-id');

// Create version
const version = await versionService.createVersion('resume-id', {
  versionName: 'Before major changes',
  changesSummary: 'Updated work experience section',
});

// Get specific version
const version = await versionService.getVersion('resume-id', 'version-id');

// Restore version
const restored = await versionService.restoreVersion('resume-id', 'version-id');
```

## React Query Hooks

Hooks manage state, caching, and side effects. Use these in React components.

### Authentication Hooks

**Location**: `src/hooks/useAuth.ts`

#### useAuth() - Combined Hook

```typescript
import { useAuth } from '@/hooks/useAuth';

function MyComponent() {
  const {
    // State
    user,
    isAuthenticated,
    isLoading,
    error,
    
    // Methods
    signUp,
    signIn,
    signOut,
    signInWithGoogle,
    signInWithGithub,
    
    // Mutation states
    isSigningUp,
    isSigningIn,
    isSigningOut,
    signUpError,
    signInError,
    signOutError,
  } = useAuth();
  
  const handleSignIn = () => {
    signIn(
      { email: 'user@example.com', password: 'password' },
      {
        onSuccess: () => {
          console.log('Signed in!');
        },
        onError: (error) => {
          console.error('Sign in failed:', error);
        },
      }
    );
  };
  
  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>Welcome, {user?.fullName}!</p>
          <button onClick={() => signOut()}>Sign Out</button>
        </div>
      ) : (
        <button onClick={handleSignIn} disabled={isSigningIn}>
          {isSigningIn ? 'Signing in...' : 'Sign In'}
        </button>
      )}
    </div>
  );
}
```

#### Individual Hooks

```typescript
import {
  useSession,
  useSignUp,
  useSignIn,
  useSignOut,
  useGoogleSignIn,
  useGithubSignIn,
} from '@/hooks/useAuth';

// Get session
const { data: session, isLoading, error } = useSession();

// Sign up
const signUp = useSignUp();
signUp.mutate({ email, password, fullName });

// Sign in
const signIn = useSignIn();
signIn.mutate({ email, password });

// Sign out
const signOut = useSignOut();
signOut.mutate();

// OAuth
const googleSignIn = useGoogleSignIn();
googleSignIn.mutate();
```

### User Profile Hooks

**Location**: `src/hooks/useUser.ts`

```typescript
import {
  useUserProfile,
  useUpdateProfile,
  useDeleteAccount,
} from '@/hooks/useUser';

function ProfilePage() {
  const { data: profile, isLoading } = useUserProfile();
  const updateProfile = useUpdateProfile();
  const deleteAccount = useDeleteAccount();
  
  const handleUpdate = (data) => {
    updateProfile.mutate(data, {
      onSuccess: () => {
        alert('Profile updated!');
      },
    });
  };
  
  const handleDelete = () => {
    if (confirm('Are you sure?')) {
      deleteAccount.mutate();
    }
  };
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div>
      <h1>{profile?.fullName}</h1>
      <p>{profile?.email}</p>
      <button onClick={() => handleUpdate({ fullName: 'New Name' })}>
        Update Profile
      </button>
      <button onClick={handleDelete}>Delete Account</button>
    </div>
  );
}
```

## Best Practices

### 1. Use Hooks in Components

```typescript
// ✅ Good: Use hooks in components
function MyComponent() {
  const { data, isLoading } = useResumes();
  // ...
}

// ❌ Bad: Call services directly in components
function MyComponent() {
  const [data, setData] = useState(null);
  useEffect(() => {
    resumeService.getResumes().then(setData);
  }, []);
  // ...
}
```

### 2. Handle Loading and Error States

```typescript
function MyComponent() {
  const { data, isLoading, error } = useResumes();
  
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  
  return <ResumeList resumes={data} />;
}
```

### 3. Use Mutation Callbacks

```typescript
const createResume = useCreateResume();

const handleCreate = (data) => {
  createResume.mutate(data, {
    onSuccess: (newResume) => {
      navigate(`/resumes/${newResume.id}`);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
```

### 4. Optimistic Updates

```typescript
const updateResume = useMutation({
  mutationFn: (data) => resumeService.updateResume(id, data),
  onMutate: async (newData) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: ['resumes', id] });
    
    // Snapshot previous value
    const previous = queryClient.getQueryData(['resumes', id]);
    
    // Optimistically update
    queryClient.setQueryData(['resumes', id], (old) => ({
      ...old,
      ...newData,
    }));
    
    return { previous };
  },
  onError: (err, newData, context) => {
    // Rollback on error
    queryClient.setQueryData(['resumes', id], context.previous);
  },
  onSettled: () => {
    // Refetch after error or success
    queryClient.invalidateQueries({ queryKey: ['resumes', id] });
  },
});
```

### 5. Dependent Queries

```typescript
// Only fetch resume if we have an ID
const { data: resume } = useQuery({
  queryKey: ['resumes', resumeId],
  queryFn: () => resumeService.getResume(resumeId),
  enabled: !!resumeId,
});
```

### 6. Prefetching

```typescript
const queryClient = useQueryClient();

const handleMouseEnter = (resumeId) => {
  // Prefetch resume on hover
  queryClient.prefetchQuery({
    queryKey: ['resumes', resumeId],
    queryFn: () => resumeService.getResume(resumeId),
  });
};
```

## Error Handling

All errors follow this format:

```typescript
{
  status: number;
  code: string;
  message: string;
  details?: any;
}
```

### Handling Errors in Components

```typescript
const { error } = useResumes();

if (error) {
  switch (error.code) {
    case 'UNAUTHORIZED':
      return <Redirect to="/login" />;
    case 'NOT_FOUND':
      return <NotFound />;
    case 'NETWORK_ERROR':
      return <NetworkError />;
    default:
      return <GenericError message={error.message} />;
  }
}
```

## Testing

### Testing Services

```typescript
import { authService } from '@/services';
import { apiClient } from '@/utils/axios';

jest.mock('@/utils/axios');

describe('authService', () => {
  it('should sign in user', async () => {
    const mockResponse = {
      data: {
        session: { access_token: 'token' },
        user: { id: '1', email: 'test@example.com' },
      },
    };
    
    (apiClient.post as jest.Mock).mockResolvedValue(mockResponse);
    
    const result = await authService.signIn({
      email: 'test@example.com',
      password: 'password',
    });
    
    expect(result).toEqual(mockResponse.data);
  });
});
```

### Testing Hooks

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';

const createWrapper = () => {
  const queryClient = new QueryClient();
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useAuth', () => {
  it('should sign in user', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });
    
    result.current.signIn({
      email: 'test@example.com',
      password: 'password',
    });
    
    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
    });
  });
});
```

## Next Steps

- Task 5: Create resume CRUD hooks
- Task 6: Update ResumeContext to use API
- Task 7: Implement auto-save functionality
- Task 8: Add loading states and error handling UI
- Task 9: Implement version control UI
- Task 10: Add resume sharing functionality
