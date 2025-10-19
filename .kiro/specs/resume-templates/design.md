# Design Document - Resume Templates

## Overview

This design document outlines the architecture and implementation approach for the four resume templates: Classic, Modern, Minimal, and Abhiram. Each template extends the TemplateBase component and implements a unique visual style while maintaining ATS compliance.

## Architecture

### Component Hierarchy

```
TemplateBase (Abstract Base)
├── ClassicTemplate
├── ModernTemplate
├── MinimalTemplate
└── AbhiramTemplate
```

### Template Selection Flow

```
User selects template
    ↓
Template selector dispatches SET_TEMPLATE action
    ↓
ResumeContext updates template type
    ↓
Preview component renders selected template
    ↓
Template applies default styles
    ↓
User customizations overlay on defaults
```

## Components and Interfaces

### ClassicTemplate Component

**Purpose:** Render resume in traditional, conservative format suitable for corporate environments.

**Key Features:**
- Times New Roman font (serif)
- Centered header with name and contact info
- Uppercase section headers with underline
- Traditional bullet points
- Single-column chronological layout
- Black text on white background

**Styling Approach:**
```typescript
const classicStyles = {
  fontFamily: 'Times New Roman',
  header: {
    textAlign: 'center',
    nameSize: 24,
    titleSize: 14,
  },
  sections: {
    headerStyle: 'uppercase',
    decoration: 'underline',
  },
  colors: {
    primary: '#000000',
    secondary: '#333333',
    text: '#000000',
  },
};
```

### ModernTemplate Component

**Purpose:** Provide contemporary design with clean aesthetics for tech and creative industries.

**Key Features:**
- Arial/Helvetica font (sans-serif)
- Centered header with horizontal contact layout
- Title-case section headers with background accent
- User-customizable accent colors
- Modern spacing and visual hierarchy
- Subtle color accents

**Styling Approach:**
```typescript
const modernStyles = {
  fontFamily: 'Arial',
  header: {
    textAlign: 'center',
    nameSize: 26,
    contactLayout: 'horizontal',
  },
  sections: {
    headerStyle: 'title-case',
    decoration: 'background',
    accentColor: 'primary',
  },
  colors: {
    primary: '#1a73e8', // Modern blue
    secondary: '#5f6368',
    text: '#202124',
  },
};
```

### MinimalTemplate Component

**Purpose:** Maximize content density with ultra-clean design for academic and research contexts.

**Key Features:**
- Arial font with compact sizing
- Left-aligned header for space efficiency
- Bold section headers without decoration
- Minimal whitespace
- Reduced section spacing (8-12px)
- Maximum content per page

**Styling Approach:**
```typescript
const minimalStyles = {
  fontFamily: 'Arial',
  header: {
    textAlign: 'left',
    nameSize: 20,
    compact: true,
  },
  sections: {
    headerStyle: 'bold-only',
    decoration: 'none',
    spacing: 10,
  },
  spacing: {
    section: 10,
    lineHeight: 1.3,
  },
};
```

### AbhiramTemplate Component

**Purpose:** Implement proven template based on successful backend engineer resume.

**Key Features:**
- Centered header with specific sizing (22pt name, 12pt title, 9pt contact)
- Uppercase bold section headers with bottom border
- Skills organized in categories
- Job titles bold, companies italic, dates right-aligned
- Optimized for technical roles
- 100% ATS compliance

**Styling Approach:**
```typescript
const abhiramStyles = {
  fontFamily: 'Arial',
  header: {
    textAlign: 'center',
    nameSize: 22,
    titleSize: 12,
    contactSize: 9,
  },
  sections: {
    headerStyle: 'uppercase',
    decoration: 'border-bottom',
    headerSize: 12,
  },
  experience: {
    titleStyle: 'bold',
    companyStyle: 'italic',
    dateAlignment: 'right',
  },
  colors: {
    primary: '#2c3e50',
    secondary: '#555555',
    text: '#333333',
  },
};
```

## Data Models

### TemplateConfig Interface

```typescript
interface TemplateConfig {
  id: TemplateType;
  name: string;
  description: string;
  preview: string;
  targetAudience: string[];
  atsScore: number;
  defaultLayout: Partial<LayoutSettings>;
  features: string[];
  bestFor: string[];
}
```

### Template Type Enum

```typescript
type TemplateType = 'classic' | 'modern' | 'minimal' | 'abhiram';
```

## Template Rendering Logic

### Section Rendering Pattern

Each template follows this pattern for rendering sections:

1. **Filter enabled sections** - Only show sections marked as enabled
2. **Sort by order** - Respect user-defined section ordering
3. **Apply template-specific styling** - Use template's style configuration
4. **Render section content** - Use appropriate content renderer for section type
5. **Apply spacing** - Use template's spacing configuration

### Content Type Renderers

Each template implements renderers for:
- **Summary** - Paragraph text with optional formatting
- **Experience** - Job entries with title, company, dates, description, achievements
- **Projects** - Project entries with name, tech stack, dates, description, links
- **Skills** - Categorized or flat list of skills
- **Education** - Degree entries with institution, dates, GPA, coursework
- **Certifications** - Certification entries with issuer, dates, credentials
- **Custom** - User-defined content sections

## Error Handling

### Template Loading Errors

```typescript
try {
  const TemplateComponent = getTemplate(templateType);
  return <TemplateComponent {...props} />;
} catch (error) {
  console.error('Template loading failed:', error);
  return <FallbackTemplate {...props} />;
}
```

### Missing Data Handling

- Display placeholder text for missing required fields
- Hide optional sections with no content
- Validate data structure before rendering
- Provide helpful error messages in development mode

## Testing Strategy

### Unit Tests
- Template component rendering
- Style application logic
- Data transformation functions
- ATS compliance validation

### Integration Tests
- Template switching
- Layout customization
- Print mode rendering
- PDF generation

### Visual Regression Tests
- Screenshot comparison for each template
- Cross-browser rendering validation
- Print output verification

## Performance Optimization

### Memoization Strategy

```typescript
const ClassicTemplate = React.memo(
  forwardRef<HTMLDivElement, TemplateBaseProps>((props, ref) => {
    // Template implementation
  }),
  (prevProps, nextProps) => {
    // Custom comparison logic
    return (
      prevProps.resume.id === nextProps.resume.id &&
      prevProps.resume.updatedAt === nextProps.resume.updatedAt &&
      prevProps.layout === nextProps.layout
    );
  }
);
```

### Lazy Loading

```typescript
const ClassicTemplate = lazy(() => import('./ClassicTemplate'));
const ModernTemplate = lazy(() => import('./ModernTemplate'));
const MinimalTemplate = lazy(() => import('./MinimalTemplate'));
const AbhiramTemplate = lazy(() => import('./AbhiramTemplate'));
```

### Style Optimization

- Use CSS-in-JS for dynamic styles only
- Leverage CSS classes for static styles
- Minimize inline style objects
- Cache computed styles with useMemo

## Accessibility Considerations

- Semantic HTML structure
- Proper heading hierarchy (h1 → h2 → h3)
- Sufficient color contrast (WCAG AA)
- Screen reader friendly content
- Keyboard navigation support (for interactive elements)

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Print Optimization

### Print-Specific CSS

```css
@media print {
  .template-base {
    box-shadow: none;
    page-break-inside: avoid;
  }
  
  .no-print {
    display: none;
  }
  
  @page {
    size: letter;
    margin: 0;
  }
}
```

### Page Break Control

- Avoid breaking within sections
- Keep related content together
- Respect user-defined page margins
- Handle multi-page resumes gracefully

## Future Enhancements

1. **Custom Template Builder** - Allow users to create custom templates
2. **Template Marketplace** - Share and download community templates
3. **AI Template Recommendations** - Suggest templates based on role and industry
4. **Multi-Page Support** - Handle resumes longer than one page
5. **Template Versioning** - Track and manage template versions
6. **Collaborative Editing** - Multiple users editing same template
7. **Template Analytics** - Track which templates perform best with ATS systems
