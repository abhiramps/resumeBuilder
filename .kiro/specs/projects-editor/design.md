# Projects Section Editor - Design Document

## Overview

The Projects Section Editor is a React component that manages multiple project entries with full CRUD operations, tech stack tag management, drag-and-drop reordering, and comprehensive form validation. The component follows established patterns from the ExperienceEditor while adding specialized functionality for project management.

## Architecture

### Component Hierarchy

```
ProjectsEditor (Main Container)
├── ProjectEntry (Individual Entry)
│   ├── ProjectForm (Entry Form Fields)
│   ├── TechStackManager (Tech Stack Tags)
│   ├── DescriptionManager (Project Descriptions)
│   └── ProjectActions (Edit/Delete/Duplicate)
├── AddProjectButton (Add New Entry)
└── DragDropProvider (Reordering Context)
```

### Data Flow

1. **Context Integration**: Component connects to ResumeContext to access and update project data
2. **Local State Management**: Uses useState for UI state (collapsed entries, editing modes, tag input)
3. **Debounced Updates**: Implements 300ms debounced auto-save for performance
4. **Tag Management**: Specialized state management for tech stack tags with suggestions

## Components and Interfaces

### ProjectsEditor (Main Component)

```typescript
interface ProjectsEditorProps {
  className?: string;
}

interface ProjectsEditorState {
  isCollapsed: boolean;
  editingProjectId: string | null;
  draggedProjectId: string | null;
  showDeleteConfirm: string | null;
}
```

### ProjectEntry (Individual Entry Component)

```typescript
interface ProjectEntryProps {
  project: Project;
  isEditing: boolean;
  onUpdate: (id: string, updates: Partial<Project>) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onToggleEdit: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
}
```

### TechStackManager (Tech Stack Component)

```typescript
interface TechStackManagerProps {
  techStack: string[];
  onUpdate: (techStack: string[]) => void;
  suggestions?: string[];
  maxTags?: number;
}
```

### DescriptionManager (Project Descriptions)

```typescript
interface DescriptionManagerProps {
  descriptions: string[];
  onUpdate: (descriptions: string[]) => void;
  maxDescriptions?: number;
}
```

## Data Models

### Project Interface (Extended)

```typescript
interface Project {
  id: string;
  name: string;
  description: string;
  techStack: string[];
  startDate: string; // YYYY-MM format or empty
  endDate: string;   // YYYY-MM format or empty
  current: boolean;
  url?: string;      // Project demo URL
  githubUrl?: string; // GitHub repository URL
  order?: number;    // For drag-and-drop ordering
}
```

### Tech Stack Categories

```typescript
interface TechStackSuggestions {
  languages: string[];
  frameworks: string[];
  databases: string[];
  tools: string[];
  cloud: string[];
  mobile: string[];
  testing: string[];
  other: string[];
}
```

### Validation Schema

```typescript
interface ProjectValidation {
  name: {
    required: true;
    minLength: 2;
    maxLength: 100;
    pattern: /^[a-zA-Z0-9\s\-.,()&/]+$/;
  };
  description: {
    required: false;
    maxLength: 300;
    pattern: /^[a-zA-Z0-9\s\-.,()&/%$#@!?:;'"]+$/;
  };
  techStack: {
    maxItems: 15;
    itemMaxLength: 30;
    pattern: /^[a-zA-Z0-9\s\-.,()&/+#]+$/;
  };
  url: {
    required: false;
    pattern: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
  };
  githubUrl: {
    required: false;
    pattern: /^https:\/\/github\.com\/[a-zA-Z0-9\-_]+\/[a-zA-Z0-9\-_\.]+\/?$/;
  };
}
```

## Tech Stack Management

### Suggestion System

```typescript
const TECH_STACK_SUGGESTIONS: TechStackSuggestions = {
  languages: [
    "JavaScript", "TypeScript", "Python", "Java", "C#", "C++", "Go", "Rust",
    "PHP", "Ruby", "Swift", "Kotlin", "Dart", "Scala", "R", "MATLAB"
  ],
  frameworks: [
    "React", "Vue.js", "Angular", "Next.js", "Nuxt.js", "Svelte", "Express.js",
    "Node.js", "Django", "Flask", "Spring Boot", "ASP.NET", "Laravel", "Rails"
  ],
  databases: [
    "PostgreSQL", "MySQL", "MongoDB", "Redis", "SQLite", "Oracle", "SQL Server",
    "Cassandra", "DynamoDB", "Firebase", "Supabase", "PlanetScale"
  ],
  tools: [
    "Git", "Docker", "Kubernetes", "Jenkins", "GitHub Actions", "GitLab CI",
    "Webpack", "Vite", "Babel", "ESLint", "Prettier", "Jest", "Cypress"
  ],
  cloud: [
    "AWS", "Google Cloud", "Azure", "Vercel", "Netlify", "Heroku", "DigitalOcean",
    "Cloudflare", "Firebase", "Supabase"
  ],
  mobile: [
    "React Native", "Flutter", "Swift", "Kotlin", "Xamarin", "Ionic", "Cordova"
  ],
  testing: [
    "Jest", "Cypress", "Selenium", "Playwright", "Testing Library", "Mocha",
    "Chai", "Jasmine", "PHPUnit", "JUnit"
  ],
  other: [
    "GraphQL", "REST API", "WebSocket", "PWA", "Microservices", "Serverless",
    "Machine Learning", "AI", "Blockchain", "IoT"
  ]
};
```

### Tag Input Component

```typescript
interface TagInputProps {
  tags: string[];
  suggestions: string[];
  onTagsChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
  allowCustom?: boolean;
}
```

## Error Handling

### Validation Errors

```typescript
interface ProjectValidationErrors {
  [projectId: string]: {
    name?: string;
    description?: string;
    techStack?: string;
    url?: string;
    githubUrl?: string;
    dateRange?: string;
  };
}
```

### URL Validation

```typescript
const validateURL = (url: string, type: 'project' | 'github'): string | undefined => {
  if (!url.trim()) return undefined;
  
  if (type === 'github') {
    const githubPattern = /^https:\/\/github\.com\/[a-zA-Z0-9\-_]+\/[a-zA-Z0-9\-_\.]+\/?$/;
    return githubPattern.test(url) ? undefined : "Please enter a valid GitHub repository URL";
  }
  
  const urlPattern = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
  return urlPattern.test(url) ? undefined : "Please enter a valid URL";
};
```

## Testing Strategy

### Unit Tests

1. **Component Rendering**: Test all component states and props
2. **Form Validation**: Test all validation rules and edge cases
3. **CRUD Operations**: Test create, read, update, delete functionality
4. **Tech Stack Management**: Test tag addition, removal, and suggestions
5. **URL Validation**: Test project and GitHub URL validation
6. **Drag and Drop**: Test reordering logic and edge cases

### Integration Tests

1. **User Workflows**: Test complete user journeys
2. **Context Updates**: Test integration with ResumeContext
3. **Auto-save**: Test debounced save functionality
4. **Tag Suggestions**: Test tech stack suggestion system

## Performance Considerations

### Optimization Strategies

1. **React.memo**: Memoize ProjectEntry components
2. **useCallback**: Memoize event handlers
3. **useMemo**: Memoize tech stack suggestions and filtering
4. **Debounced Updates**: Prevent excessive API calls
5. **Virtual Scrolling**: For users with many projects (>15)

### Tag Input Optimization

1. **Fuzzy Search**: Efficient suggestion filtering
2. **Debounced Input**: Prevent excessive suggestion updates
3. **Memoized Suggestions**: Cache filtered suggestions

## Security Considerations

### Input Sanitization

1. **XSS Prevention**: Sanitize all user input
2. **URL Validation**: Validate and sanitize URLs
3. **Content Validation**: Check for malicious patterns

### Data Privacy

1. **Local Storage**: Encrypt sensitive project data
2. **URL Safety**: Validate external URLs for safety

## Browser Compatibility

### Supported Features

1. **Drag and Drop API**: HTML5 with polyfills
2. **CSS Grid/Flexbox**: Modern layout with fallbacks
3. **ES6+ Features**: Transpiled for compatibility

### Fallback Strategies

1. **Drag and Drop**: Button-based reordering for touch devices
2. **Tag Input**: Standard input with manual entry fallback

## Future Enhancements

### Planned Features

1. **GitHub Integration**: Import project data from GitHub API
2. **Project Templates**: Pre-filled project templates by category
3. **Tech Stack Analytics**: Suggest trending technologies
4. **Project Screenshots**: Image upload and management
5. **Collaboration Features**: Team project support

### API Integration

1. **GitHub API**: Fetch repository information
2. **Tech Stack API**: Real-time technology suggestions
3. **URL Preview**: Generate project previews from URLs

## Accessibility Features

### ARIA Support

1. **Tag Management**: Proper ARIA labels for tag operations
2. **Drag and Drop**: Keyboard-accessible reordering
3. **Form Validation**: Screen reader announcements
4. **Focus Management**: Proper focus handling during interactions

### Keyboard Navigation

1. **Tab Order**: Logical tab sequence
2. **Keyboard Shortcuts**: Quick actions for power users
3. **Screen Reader**: Full compatibility with screen readers