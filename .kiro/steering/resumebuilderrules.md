---
inclusion: always
---
# ATS Resume Builder - Cursor Agent Rules

## Project Context
You are building an ATS-friendly resume builder application for software engineers using React, TypeScript, and Tailwind CSS. The application must prioritize ATS compliance while providing extensive customization options.

## Core Principles
1. **ATS Compliance First**: Every feature must maintain resume parseability by ATS systems
2. **Type Safety**: Use TypeScript strictly - no `any` types unless absolutely necessary
3. **Component Reusability**: Create modular, reusable components
4. **Performance**: Optimize for fast rendering and minimal re-renders
5. **User Experience**: Real-time preview, intuitive controls, auto-save

## Technology Stack
- React 18+ with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- react-to-print for PDF generation
- Context API + useReducer for state management
- LocalStorage + IndexedDB for persistence

## Code Style Guidelines

### TypeScript
- Use strict mode
- Define interfaces for all data structures
- Use type inference where obvious
- Prefer `interface` over `type` for object shapes
- Use enums for fixed sets of values
- Export types from dedicated files in `types/` directory

### React Components
- Use functional components exclusively
- Implement proper prop validation with TypeScript interfaces
- Use descriptive component names (PascalCase)
- Keep components under 200 lines - split if larger
- Implement proper error boundaries
- Use React.memo for expensive components

### Hooks Usage
- Custom hooks must start with `use`
- Keep hooks in `hooks/` directory
- Document hook parameters and return values
- Use useMemo and useCallback appropriately
- Avoid excessive hook dependencies

### File Organization
```
Component files: ComponentName.tsx
Hook files: useHookName.ts
Type files: entity.types.ts
Utility files: utilityName.ts
```

### Naming Conventions
- Components: PascalCase (ResumePreview, ExperienceEditor)
- Hooks: camelCase with 'use' prefix (useResume, useAutoSave)
- Utilities: camelCase (formatDate, validateATS)
- Constants: UPPER_SNAKE_CASE (DEFAULT_MARGINS, ATS_SAFE_FONTS)
- Interfaces: PascalCase with descriptive names (ResumeData, LayoutSettings)

## State Management Rules

### Resume Context Structure
- Single source of truth for resume data
- Use reducer pattern for complex state updates
- Implement undo/redo capability
- Auto-save on every state change (debounced)

### State Update Pattern
```typescript
dispatch({
  type: 'UPDATE_SECTION',
  payload: {
    sectionId: string,
    data: Partial<SectionContent>
  }
})
```

### Local State Guidelines
- Use local state for UI-only concerns
- Lift state up when needed by multiple components
- Avoid prop drilling - use context when needed

## ATS Compliance Requirements

### Critical Rules
1. **No Complex Layouts**: Avoid tables, columns, text boxes
2. **Standard Fonts Only**: Arial, Helvetica, Times New Roman, Georgia, Calibri
3. **Simple Formatting**: Use basic bold, italic only
4. **Standard Headers**: Professional Summary, Work Experience, Education, Skills
5. **No Graphics**: No images, icons, or decorative elements in final PDF
6. **Machine Readable**: All text must be selectable and parseable

### ATS Validation Implementation
- Real-time validation as user edits
- Visual indicators for ATS issues
- Suggestions for improvement
- Score calculation (0-100)

## PDF Generation Guidelines

### Print Styling
- Use `@media print` CSS exclusively for PDF output
- Set page size to letter (8.5" x 11")
- Remove all interactive elements in print view
- Ensure proper page breaks
- Test with browser print preview

### Export Quality
- Maintain exact WYSIWYG rendering
- High-resolution text rendering
- Preserve spacing and margins accurately
- Test across Chrome, Firefox, Safari

## Component Development Pattern

### Standard Component Structure
```typescript
import React from 'react';
import { ComponentProps } from './ComponentName.types';

export const ComponentName: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
  // Hooks first
  const [state, setState] = useState();
  
  // Effects
  useEffect(() => {}, []);
  
  // Handlers
  const handleAction = () => {};
  
  // Render
  return (
    <div className="component-container">
      {/* JSX */}
    </div>
  );
};
```

### Props Pattern
- Destructure props in function signature
- Provide default values for optional props
- Document complex props with JSDoc comments

## Styling Guidelines

### Tailwind Usage
- Use utility classes primarily
- Create reusable component classes when needed
- Use `@apply` sparingly in CSS modules
- Maintain consistent spacing scale (4, 8, 12, 16, 24, 32px)

### Responsive Design
- Desktop-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Hide/show elements appropriately per breakpoint

### Color Scheme
- Use CSS custom properties for theme colors
- Support light/dark mode (future enhancement)
- Ensure WCAG AA contrast compliance
- Primary: #2c3e50, Secondary: #555, Text: #333

## Performance Optimization

### Required Optimizations
- Debounce input handlers (300ms)
- Memoize expensive calculations
- Use React.memo for pure components
- Implement virtual scrolling for long lists
- Lazy load templates
- Code splitting for routes

### Avoid
- Inline function definitions in render
- Creating objects/arrays in render
- Unnecessary useEffect dependencies
- Deep object comparisons in dependencies

## Data Persistence

### Auto-Save Strategy
```typescript
useEffect(() => {
  const timer = setTimeout(() => {
    localStorage.setItem('resumeDraft', JSON.stringify(resume));
  }, 30000);
  return () => clearTimeout(timer);
}, [resume]);
```

### Storage Priority
1. LocalStorage: Current draft (auto-save)
2. IndexedDB: Named resume versions
3. JSON Export: User-initiated backup

## Error Handling

### Required Patterns
- Try-catch for async operations
- Error boundaries for component failures
- Graceful degradation
- User-friendly error messages
- Console logging for debugging

### Example
```typescript
try {
  await saveResume(data);
} catch (error) {
  console.error('Save failed:', error);
  showToast('Failed to save resume. Please try again.');
}
```

## Testing Considerations

### Unit Tests Priority
- Utility functions (ATS validation, PDF generation)
- Custom hooks
- State reducers
- Data transformations

### Component Tests
- User interactions
- Form submissions
- State updates
- Conditional rendering

## Accessibility Requirements
- Semantic HTML elements
- ARIA labels for interactive elements
- Keyboard navigation support
- Focus management
- Screen reader compatibility

## Git Workflow
- Feature branches: `feature/section-name`
- Commit messages: Conventional commits format
- Small, focused commits
- Descriptive commit messages

## Documentation Requirements
- JSDoc comments for complex functions
- README with setup instructions
- Type definitions exported and documented
- Inline comments for complex logic

## Security Considerations
- Sanitize user input
- No eval() or dangerous innerHTML
- Validate all file imports
- Safe JSON parsing
- XSS prevention

## Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Development Workflow

### When Starting a New Task
1. Read the task description carefully
2. Check existing code for similar patterns
3. Review relevant type definitions
4. Plan component structure before coding
5. Implement with testing in mind

### When Implementing Features
1. Start with types/interfaces
2. Create basic component structure
3. Implement core logic
4. Add styling
5. Add error handling
6. Test manually
7. Optimize if needed

### When Debugging
1. Check console for errors
2. Verify prop types
3. Inspect state with React DevTools
4. Check network requests
5. Test in different browsers

## Common Patterns

### Form Input Handler
```typescript
const handleInputChange = (field: string, value: string) => {
  dispatch({
    type: 'UPDATE_PERSONAL_INFO',
    payload: { [field]: value }
  });
};
```

### Section Editor Pattern
```typescript
interface SectionEditorProps {
  sectionId: string;
  data: SectionContent;
  onUpdate: (data: Partial<SectionContent>) => void;
}
```

### Preview Component Pattern
```typescript
const Preview = React.forwardRef<HTMLDivElement, PreviewProps>((props, ref) => {
  return <div ref={ref} className="print-container">...</div>;
});
```

## Anti-Patterns to Avoid
- God components (components doing too much)
- Prop drilling more than 2 levels
- Mutating state directly
- Using index as key in lists
- Excessive useState hooks (use useReducer)
- Inline styles (use Tailwind)
- Ignoring TypeScript errors

## Special Considerations

### Template System
- Each template must be ATS compliant
- Templates share same data structure
- Switching templates preserves all data
- Template-specific styling only

### Customization Constraints
- All customizations must maintain ATS compliance
- Validate changes against ATS rules
- Warn users about risky customizations
- Provide safe defaults

### PDF Generation
- Use print media queries exclusively
- Test PDF output with actual ATS systems
- Ensure text selectability
- Maintain layout fidelity

## MCP Server Integration Notes

When using MCP server with browser access:
1. Use browser to research ATS best practices
2. Test resume parsing with online ATS checkers
3. Compare with successful resume examples
4. Validate PDF output quality
5. Check cross-browser compatibility

## Task Execution Guidelines

### Before Starting Each Task
- Read task description completely
- Identify dependencies on other tasks
- Review relevant documentation sections
- Plan approach and file changes needed

### During Task Execution
- Focus on the specific task only
- Follow established patterns
- Write clean, documented code
- Test as you build

### After Completing Task
- Test the specific functionality
- Verify integration with existing code
- Check for TypeScript errors
- Ensure no console warnings

## Remember
- ATS compliance is non-negotiable
- Type safety prevents bugs
- User experience should feel effortless
- Performance matters for real-time preview
- Code quality over speed of delivery
