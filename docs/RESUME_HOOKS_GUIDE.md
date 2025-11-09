# Resume Hooks Guide

Complete guide for using the resume management hooks in the Resume Builder application.

## Overview

The resume hooks provide a comprehensive interface for managing resumes with React Query integration, including:

- CRUD operations (Create, Read, Update, Delete)
- List management with pagination and filtering
- Resume duplication
- Sharing/publishing functionality
- Export in multiple formats (PDF, DOCX, JSON)
- Import from files
- Optimistic updates
- Automatic cache invalidation

## Installation

All hooks are exported from `src/hooks/index.ts`:

```typescript
import {
  useResume,
  useResumes,
  useCreateResume,
  useUpdateResume,
  useDeleteResume,
  useDuplicateResume,
  useShareResume,
  useExportResume,
  useImportResume,
} from '../hooks';
```

## Hooks Reference

### useResume

Fetch a single resume by ID.

```typescript
const { data, isLoading, error } = useResume(resumeId);
```

**Parameters:**
- `resumeId: string | undefined` - The resume ID to fetch

**Returns:**
- `data: ResumeResponse` - The resume data
- `isLoading: boolean` - Loading state
- `error: any` - Error object if request failed

**Example:**
```typescript
const ResumeEditor = ({ resumeId }: { resumeId: string }) => {
  const { data: resume, isLoading, error } = useResume(resumeId);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!resume) return <NotFound />;

  return <ResumeForm resume={resume} />;
};
```

---

### usePublicResume

Fetch a public resume by slug (for sharing).

```typescript
const { data, isLoading, error } = usePublicResume(slug);
```

**Parameters:**
- `slug: string | undefined` - The public slug

**Returns:**
- Same as `useResume`

**Example:**
```typescript
const PublicResumePage = ({ slug }: { slug: string }) => {
  const { data: resume, isLoading } = usePublicResume(slug);

  if (isLoading) return <LoadingSpinner />;
  
  return <ResumePreview resume={resume} />;
};
```

---

### useResumes

Fetch a paginated list of resumes with filtering and sorting.

```typescript
const { data, isLoading, error } = useResumes(query);
```

**Parameters:**
- `query?: ResumeListQuery` - Optional query parameters
  - `page?: number` - Page number (default: 1)
  - `limit?: number` - Items per page (default: 10)
  - `status?: 'draft' | 'published' | 'all'` - Filter by status
  - `search?: string` - Search query
  - `sortBy?: 'createdAt' | 'updatedAt' | 'title'` - Sort field
  - `sortOrder?: 'asc' | 'desc'` - Sort direction

**Returns:**
- `data: PaginatedResponse<ResumeResponse>` - Paginated resume list
- `isLoading: boolean` - Loading state
- `error: any` - Error object

**Example:**
```typescript
const ResumeList = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useResumes({
    page,
    limit: 10,
    status: 'all',
    sortBy: 'updatedAt',
    sortOrder: 'desc',
  });

  return (
    <div>
      {data?.data.map(resume => (
        <ResumeCard key={resume.id} resume={resume} />
      ))}
      <Pagination
        current={page}
        total={data?.pagination.totalPages || 0}
        onChange={setPage}
      />
    </div>
  );
};
```

---

### useSearchResumes

Convenience hook for searching resumes.

```typescript
const { data, isLoading } = useSearchResumes(searchQuery, options);
```

**Example:**
```typescript
const SearchResults = ({ query }: { query: string }) => {
  const { data, isLoading } = useSearchResumes(query, {
    limit: 20,
    sortBy: 'updatedAt',
  });

  return <ResumeGrid resumes={data?.data || []} />;
};
```

---

### useResumesByStatus

Convenience hook for filtering by status.

```typescript
const { data, isLoading } = useResumesByStatus(status, options);
```

**Example:**
```typescript
const DraftResumes = () => {
  const { data } = useResumesByStatus('draft', { limit: 5 });
  
  return <ResumeList resumes={data?.data || []} />;
};
```

---

### useCreateResume

Create a new resume.

```typescript
const createResume = useCreateResume();
```

**Returns:**
- `mutate: (data: CreateResumeRequest) => void` - Trigger mutation
- `mutateAsync: (data: CreateResumeRequest) => Promise<ResumeResponse>` - Async mutation
- `isPending: boolean` - Loading state
- `error: any` - Error object
- `data: ResumeResponse` - Created resume

**Example:**
```typescript
const CreateResumeButton = () => {
  const createResume = useCreateResume();
  const navigate = useNavigate();

  const handleCreate = async () => {
    try {
      const resume = await createResume.mutateAsync({
        title: 'My New Resume',
        templateId: 'classic',
        content: {
          personalInfo: {
            fullName: 'John Doe',
            title: 'Software Engineer',
            email: 'john@example.com',
            phone: '+1234567890',
            location: 'San Francisco, CA',
          },
        },
      });
      
      navigate(`/resumes/${resume.id}/edit`);
    } catch (error) {
      console.error('Failed to create resume:', error);
    }
  };

  return (
    <button
      onClick={handleCreate}
      disabled={createResume.isPending}
    >
      {createResume.isPending ? 'Creating...' : 'Create Resume'}
    </button>
  );
};
```

---

### useUpdateResume

Update an existing resume with optimistic updates.

```typescript
const updateResume = useUpdateResume(resumeId);
```

**Parameters:**
- `resumeId: string` - The resume ID to update

**Returns:**
- Same as `useCreateResume`

**Example:**
```typescript
const ResumeEditor = ({ resumeId }: { resumeId: string }) => {
  const { data: resume } = useResume(resumeId);
  const updateResume = useUpdateResume(resumeId);

  const handleSave = async (updates: UpdateResumeRequest) => {
    try {
      await updateResume.mutateAsync(updates);
      toast.success('Resume saved successfully');
    } catch (error) {
      toast.error('Failed to save resume');
    }
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleSave({ title: e.currentTarget.title.value });
    }}>
      <input name="title" defaultValue={resume?.title} />
      <button type="submit" disabled={updateResume.isPending}>
        {updateResume.isPending ? 'Saving...' : 'Save'}
      </button>
    </form>
  );
};
```

---

### useDeleteResume

Delete a resume.

```typescript
const deleteResume = useDeleteResume();
```

**Example:**
```typescript
const DeleteResumeButton = ({ resumeId }: { resumeId: string }) => {
  const deleteResume = useDeleteResume();
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this resume?')) return;

    try {
      await deleteResume.mutateAsync(resumeId);
      toast.success('Resume deleted');
      navigate('/resumes');
    } catch (error) {
      toast.error('Failed to delete resume');
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={deleteResume.isPending}
      className="text-red-600"
    >
      {deleteResume.isPending ? 'Deleting...' : 'Delete'}
    </button>
  );
};
```

---

### useDuplicateResume

Duplicate an existing resume.

```typescript
const duplicateResume = useDuplicateResume();
```

**Example:**
```typescript
const DuplicateButton = ({ resumeId }: { resumeId: string }) => {
  const duplicateResume = useDuplicateResume();
  const navigate = useNavigate();

  const handleDuplicate = async () => {
    try {
      const newResume = await duplicateResume.mutateAsync(resumeId);
      navigate(`/resumes/${newResume.id}/edit`);
    } catch (error) {
      toast.error('Failed to duplicate resume');
    }
  };

  return (
    <button onClick={handleDuplicate} disabled={duplicateResume.isPending}>
      {duplicateResume.isPending ? 'Duplicating...' : 'Duplicate'}
    </button>
  );
};
```

---

### useShareResume

Update resume sharing settings.

```typescript
const shareResume = useShareResume(resumeId);
```

**Example:**
```typescript
const ShareResumeToggle = ({ resumeId }: { resumeId: string }) => {
  const { data: resume } = useResume(resumeId);
  const shareResume = useShareResume(resumeId);

  const handleToggle = async () => {
    try {
      const result = await shareResume.mutateAsync({
        isPublic: !resume?.isPublic,
        publicSlug: !resume?.isPublic ? `resume-${Date.now()}` : undefined,
      });

      if (result.isPublic) {
        toast.success(`Resume is now public: ${result.publicUrl}`);
      } else {
        toast.success('Resume is now private');
      }
    } catch (error) {
      toast.error('Failed to update sharing settings');
    }
  };

  return (
    <label className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={resume?.isPublic || false}
        onChange={handleToggle}
        disabled={shareResume.isPending}
      />
      <span>Make Public</span>
    </label>
  );
};
```

---

### useExportResume

Export resume in various formats.

```typescript
const exportResume = useExportResume();
```

**Example:**
```typescript
const ExportButtons = ({ resumeId }: { resumeId: string }) => {
  const exportResume = useExportResume();

  const handleExport = async (format: 'pdf' | 'docx' | 'json') => {
    try {
      await exportResume.mutateAsync({ id: resumeId, format });
      toast.success(`Resume exported as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error('Failed to export resume');
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => handleExport('pdf')}
        disabled={exportResume.isPending}
      >
        Export PDF
      </button>
      <button
        onClick={() => handleExport('docx')}
        disabled={exportResume.isPending}
      >
        Export DOCX
      </button>
      <button
        onClick={() => handleExport('json')}
        disabled={exportResume.isPending}
      >
        Export JSON
      </button>
    </div>
  );
};
```

---

### useImportResume

Import resume from file.

```typescript
const importResume = useImportResume();
```

**Example:**
```typescript
const ImportResumeButton = () => {
  const importResume = useImportResume();
  const navigate = useNavigate();

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const resume = await importResume.mutateAsync(file);
      toast.success('Resume imported successfully');
      navigate(`/resumes/${resume.id}/edit`);
    } catch (error) {
      toast.error('Failed to import resume');
    }
  };

  return (
    <label className="cursor-pointer">
      <input
        type="file"
        accept=".json,.pdf,.docx"
        onChange={handleImport}
        className="hidden"
        disabled={importResume.isPending}
      />
      <span className="btn">
        {importResume.isPending ? 'Importing...' : 'Import Resume'}
      </span>
    </label>
  );
};
```

---

## Advanced Patterns

### Auto-save with Debouncing

```typescript
import { useDebounce } from 'use-debounce';

const AutoSaveEditor = ({ resumeId }: { resumeId: string }) => {
  const { data: resume } = useResume(resumeId);
  const updateResume = useUpdateResume(resumeId);
  const [content, setContent] = useState(resume?.content);
  const [debouncedContent] = useDebounce(content, 1000);

  useEffect(() => {
    if (debouncedContent && resume) {
      updateResume.mutate({ content: debouncedContent });
    }
  }, [debouncedContent]);

  return (
    <textarea
      value={JSON.stringify(content, null, 2)}
      onChange={(e) => setContent(JSON.parse(e.target.value))}
    />
  );
};
```

### Infinite Scroll

```typescript
import { useInfiniteQuery } from '@tanstack/react-query';

const InfiniteResumeList = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['resumes', 'infinite'],
    queryFn: ({ pageParam = 1 }) =>
      resumeService.getResumes({ page: pageParam, limit: 10 }),
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
  });

  return (
    <div>
      {data?.pages.map((page) =>
        page.data.map((resume) => (
          <ResumeCard key={resume.id} resume={resume} />
        ))
      )}
      {hasNextPage && (
        <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
          {isFetchingNextPage ? 'Loading...' : 'Load More'}
        </button>
      )}
    </div>
  );
};
```

### Prefetching

```typescript
const ResumeListWithPrefetch = () => {
  const queryClient = useQueryClient();
  const { data } = useResumes({ page: 1 });

  const handleMouseEnter = (resumeId: string) => {
    // Prefetch resume details on hover
    queryClient.prefetchQuery({
      queryKey: RESUME_KEYS.detail(resumeId),
      queryFn: () => resumeService.getResume(resumeId),
    });
  };

  return (
    <div>
      {data?.data.map((resume) => (
        <div
          key={resume.id}
          onMouseEnter={() => handleMouseEnter(resume.id)}
        >
          <ResumeCard resume={resume} />
        </div>
      ))}
    </div>
  );
};
```

## Error Handling

All hooks return error objects that match the API error format:

```typescript
interface ApiError {
  status: number;
  code: string;
  message: string;
  details?: any;
}
```

**Example:**
```typescript
const { error } = useResume(resumeId);

if (error) {
  switch (error.code) {
    case 'NOT_FOUND':
      return <NotFoundPage />;
    case 'UNAUTHORIZED':
      return <LoginPage />;
    case 'FORBIDDEN':
      return <AccessDeniedPage />;
    default:
      return <ErrorPage message={error.message} />;
  }
}
```

## Best Practices

1. **Use Query Keys Consistently**: Import `RESUME_KEYS` for cache management
2. **Handle Loading States**: Always show loading indicators
3. **Implement Error Boundaries**: Catch and display errors gracefully
4. **Optimize Updates**: Use optimistic updates for better UX
5. **Debounce Auto-save**: Prevent excessive API calls
6. **Prefetch Data**: Improve perceived performance
7. **Clean Up**: React Query handles cleanup automatically

## Testing

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useResume } from './useResume';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

test('useResume fetches resume data', async () => {
  const { result } = renderHook(() => useResume('resume-id'), {
    wrapper: createWrapper(),
  });

  await waitFor(() => expect(result.current.isSuccess).toBe(true));
  expect(result.current.data).toBeDefined();
});
```

## Complete Example

See `src/examples/ResumeManagementExample.tsx` for a full working example demonstrating all hooks.
