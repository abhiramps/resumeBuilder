---
inclusion: always
---

# Resume Builder Frontend - Project Guidelines

## Project Context

This is the **Resume Builder Frontend** - a React-based web application for creating ATS-friendly resumes. The project is built with React 18, TypeScript, Vite, and Tailwind CSS.

**Current Status:** Task 35 complete (nearly production-ready)
**Deployment:** Vercel
**Backend:** Serverless API (Node.js + Prisma + Supabase)

## Core Principles

### 1. ATS Compliance First
- Every feature must maintain ATS compatibility
- No tables, columns, or complex layouts in resume content
- Use simple, parseable HTML/CSS
- Standard section headers only
- Machine-readable fonts (Arial, Helvetica, Times New Roman, Georgia, Calibri)

### 2. Type Safety
- Use TypeScript strict mode
- No `any` types without justification
- Define interfaces for all data structures
- Export types from centralized type files

### 3. Component Architecture
- Functional components only
- Custom hooks for reusable logic
- Keep components focused and single-purpose
- Use composition over inheritance

## Technology Stack

### Core
- **React:** 18.3.1
- **TypeScript:** 5.5.3
- **Vite:** 5.3.4
- **Tailwind CSS:** 3.4.1

### Key Libraries
- **State Management:** React Context API + useReducer
- **PDF Export:** react-to-print
- **Icons:** lucide-react
- **Storage:** LocalStorage + IndexedDB (localforage)

## Project Structure

```
src/
├── components/
│   ├── Editor/          # Section editors (left sidebar)
│   ├── Preview/         # Resume preview (center)
│   ├── Templates/       # Resume templates
│   ├── UI/              # Reusable UI components
│   └── Layout/          # Page layout components
├── contexts/
│   └── ResumeContext.tsx
├── hooks/
│   ├── useResume.ts
│   ├── useAutoSave.ts
│   └── usePDFExport.ts
├── types/
│   ├── resume.types.ts
│   └── template.types.ts
├── utils/
│   ├── atsValidator.ts
│   └── pdfGenerator.ts
└── constants/
    └── defaultResume.ts
```

## Coding Standards

### TypeScript

```typescript
// ✅ Good: Explicit types
interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
}

const updatePersonalInfo = (info: PersonalInfo): void => {
  // Implementation
};

// ❌ Bad: Implicit any
const updatePersonalInfo = (info) => {
  // Implementation
};
```

### React Components

```typescript
// ✅ Good: Functional component with proper typing
interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({ 
  onClick, 
  children, 
  variant = 'primary' 
}) => {
  return (
    <button 
      onClick={onClick}
      className={`btn btn-${variant}`}
    >
      {children}
    </button>
  );
};

// ❌ Bad: Untyped props
export const Button = ({ onClick, children }) => {
  return <button onClick={onClick}>{children}</button>;
};
```

### State Management

```typescript
// ✅ Good: Typed reducer
type ResumeAction = 
  | { type: 'UPDATE_PERSONAL_INFO'; payload: PersonalInfo }
  | { type: 'ADD_SECTION'; payload: Section };

const resumeReducer = (state: Resume, action: ResumeAction): Resume => {
  switch (action.type) {
    case 'UPDATE_PERSONAL_INFO':
      return { ...state, personalInfo: action.payload };
    default:
      return state;
  }
};

// ❌ Bad: Untyped reducer
const resumeReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_PERSONAL_INFO':
      return { ...state, personalInfo: action.payload };
  }
};
```

## File Naming Conventions

- **Components:** PascalCase (e.g., `PersonalInfoEditor.tsx`)
- **Hooks:** camelCase with `use` prefix (e.g., `useAutoSave.ts`)
- **Utils:** camelCase (e.g., `atsValidator.ts`)
- **Types:** camelCase with `.types.ts` suffix (e.g., `resume.types.ts`)
- **Constants:** camelCase (e.g., `defaultResume.ts`)

## Component Guidelines

### 1. Keep Components Small
- Max 200 lines per component
- Extract complex logic to custom hooks
- Split large components into smaller ones

### 2. Props Interface
```typescript
// ✅ Good: Explicit interface
interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

// ❌ Bad: Inline types
const Editor: React.FC<{
  value: string;
  onChange: (value: string) => void;
}> = ({ value, onChange }) => {
  // ...
};
```

### 3. Event Handlers
```typescript
// ✅ Good: Descriptive names
const handlePersonalInfoChange = (info: PersonalInfo) => {
  dispatch({ type: 'UPDATE_PERSONAL_INFO', payload: info });
};

// ❌ Bad: Generic names
const handleChange = (data) => {
  dispatch({ type: 'UPDATE', payload: data });
};
```

## Styling Guidelines

### Tailwind CSS
```typescript
// ✅ Good: Semantic class names
<div className="flex flex-col gap-4 p-6 bg-white rounded-lg shadow-md">
  <h2 className="text-xl font-semibold text-gray-900">Personal Info</h2>
  <input className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
</div>

// ❌ Bad: Inline styles
<div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
  <h2 style={{ fontSize: '20px', fontWeight: 600 }}>Personal Info</h2>
</div>
```

### Responsive Design
```typescript
// ✅ Good: Mobile-first approach
<div className="w-full md:w-1/2 lg:w-1/3">
  {/* Content */}
</div>

// Use Tailwind breakpoints: sm, md, lg, xl, 2xl
```

## State Management

### Context Usage
```typescript
// ✅ Good: Typed context
interface ResumeContextType {
  resume: Resume;
  dispatch: React.Dispatch<ResumeAction>;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export const useResumeContext = () => {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('useResumeContext must be used within ResumeProvider');
  }
  return context;
};
```

### Reducer Pattern
```typescript
// ✅ Good: Immutable updates
case 'UPDATE_SECTION':
  return {
    ...state,
    sections: state.sections.map(section =>
      section.id === action.payload.id
        ? { ...section, ...action.payload.updates }
        : section
    ),
  };

// ❌ Bad: Mutating state
case 'UPDATE_SECTION':
  const section = state.sections.find(s => s.id === action.payload.id);
  section.title = action.payload.title; // Mutation!
  return state;
```

## Performance Optimization

### Memoization
```typescript
// ✅ Good: Memoize expensive computations
const atsScore = useMemo(() => {
  return calculateATSScore(resume);
}, [resume]);

// ✅ Good: Memoize callbacks
const handleSectionUpdate = useCallback((sectionId: string, updates: Partial<Section>) => {
  dispatch({ type: 'UPDATE_SECTION', payload: { id: sectionId, updates } });
}, [dispatch]);
```

### Component Optimization
```typescript
// ✅ Good: Memo for pure components
export const SectionHeader = React.memo<SectionHeaderProps>(({ title, icon }) => {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <h3>{title}</h3>
    </div>
  );
});
```

## Error Handling

```typescript
// ✅ Good: Try-catch with user feedback
const handleExportPDF = async () => {
  try {
    setIsExporting(true);
    await exportToPDF(resumeRef.current);
    showSuccessMessage('PDF exported successfully');
  } catch (error) {
    console.error('PDF export failed:', error);
    showErrorMessage('Failed to export PDF. Please try again.');
  } finally {
    setIsExporting(false);
  }
};

// ❌ Bad: Silent failures
const handleExportPDF = async () => {
  await exportToPDF(resumeRef.current);
};
```

## Testing Guidelines

### Component Tests
```typescript
// ✅ Good: Test user interactions
describe('PersonalInfoEditor', () => {
  it('should update name on input change', () => {
    const { getByLabelText } = render(<PersonalInfoEditor />);
    const nameInput = getByLabelText('Full Name');
    
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    
    expect(nameInput).toHaveValue('John Doe');
  });
});
```

## API Integration

### Backend Communication
```typescript
// ✅ Good: Typed API calls
interface CreateResumeRequest {
  title: string;
  templateId: string;
  content: ResumeContent;
}

const createResume = async (data: CreateResumeRequest): Promise<Resume> => {
  const response = await fetch(`${API_BASE_URL}/resumes`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create resume');
  }
  
  return response.json();
};
```

## Accessibility

### ARIA Labels
```typescript
// ✅ Good: Accessible components
<button
  aria-label="Delete section"
  onClick={handleDelete}
  className="btn-icon"
>
  <TrashIcon />
</button>

<input
  id="email"
  type="email"
  aria-describedby="email-error"
  aria-invalid={!!errors.email}
/>
```

### Keyboard Navigation
```typescript
// ✅ Good: Keyboard support
const handleKeyDown = (e: React.KeyboardEvent) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    handleClick();
  }
};

<div
  role="button"
  tabIndex={0}
  onKeyDown={handleKeyDown}
  onClick={handleClick}
>
  Click me
</div>
```

## Common Patterns

### Custom Hooks
```typescript
// ✅ Good: Reusable logic in hooks
export const useAutoSave = (data: Resume, interval: number = 30000) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('resume', JSON.stringify(data));
    }, interval);
    
    return () => clearTimeout(timer);
  }, [data, interval]);
};
```

### Form Handling
```typescript
// ✅ Good: Controlled inputs
const [formData, setFormData] = useState<PersonalInfo>(initialData);

const handleChange = (field: keyof PersonalInfo) => (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  setFormData(prev => ({
    ...prev,
    [field]: e.target.value,
  }));
};

<input
  value={formData.fullName}
  onChange={handleChange('fullName')}
/>
```

## Documentation

### Component Documentation
```typescript
/**
 * PersonalInfoEditor - Edits personal information section of resume
 * 
 * @param value - Current personal info data
 * @param onChange - Callback when data changes
 * @param disabled - Whether the editor is disabled
 * 
 * @example
 * <PersonalInfoEditor
 *   value={resume.personalInfo}
 *   onChange={handlePersonalInfoChange}
 * />
 */
export const PersonalInfoEditor: React.FC<PersonalInfoEditorProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  // Implementation
};
```

## Git Commit Messages

```bash
# ✅ Good: Descriptive commits
feat: add version control for resumes (Task 36)
fix: resolve PDF export layout issue
refactor: extract ATS validation to custom hook
test: add tests for PersonalInfoEditor component

# ❌ Bad: Vague commits
update code
fix bug
changes
```

## Common Pitfalls to Avoid

### 1. Don't Mutate State
```typescript
// ❌ Bad
state.sections.push(newSection);

// ✅ Good
setState({ ...state, sections: [...state.sections, newSection] });
```

### 2. Don't Use Index as Key
```typescript
// ❌ Bad
{sections.map((section, index) => (
  <Section key={index} {...section} />
))}

// ✅ Good
{sections.map((section) => (
  <Section key={section.id} {...section} />
))}
```

### 3. Don't Forget Cleanup
```typescript
// ✅ Good: Cleanup in useEffect
useEffect(() => {
  const timer = setInterval(() => {
    // Do something
  }, 1000);
  
  return () => clearInterval(timer); // Cleanup
}, []);
```

## Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Vite Guide](https://vitejs.dev/guide/)

## Task Reference

Current progress: **Task 35 complete**

See `docs/task_list_optimized.md` for complete task list and implementation details.

## Questions?

When implementing features:
1. Check if similar pattern exists in codebase
2. Follow the established conventions
3. Maintain ATS compliance
4. Write tests for new features
5. Update documentation

**Remember:** ATS compliance is non-negotiable. Every feature must be parseable by ATS systems.
