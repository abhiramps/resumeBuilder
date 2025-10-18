# Template System

This directory contains the template system foundation for the ATS Resume Builder. The template system provides a structured approach to creating and managing different resume layouts while maintaining ATS compliance.

## Architecture

### TemplateBase Component

The `TemplateBase` component serves as the foundation for all resume templates:

**Features:**
- Consistent prop interface across all templates
- Common utility functions for formatting
- Shared styling utilities
- Print optimization
- ATS compliance helpers
- forwardRef support for PDF generation

**Props:**
- `resume: Resume` - Complete resume data
- `layout: LayoutSettings` - Layout configuration
- `className?: string` - Additional CSS classes
- `printMode?: boolean` - Print-specific rendering

### useTemplate Hook

The `useTemplate` hook provides comprehensive template management:

**Functionality:**
- Get current template configuration
- Switch between templates
- Apply template defaults
- Template validation
- Compatibility checking
- Template recommendations

**API:**
```tsx
const {
  currentTemplate,
  availableTemplates,
  switchTemplate,
  applyTemplateDefaults,
  resetTemplate,
  getTemplate,
  supportsCustomization,
  getRecommendations,
  validateTemplate,
  getTemplatePreview,
  compareTemplates,
} = useTemplate();
```

### Template Helpers

The `templateHelpers` utility provides common formatting functions:

**Categories:**
- **Date Helpers** - Format dates, date ranges, calculate durations
- **Text Helpers** - Truncate, capitalize, clean text
- **URL Helpers** - Format URLs, validate, extract domains
- **Phone Helpers** - Format phone numbers, validate
- **Validation Helpers** - Content validation, email validation
- **Style Helpers** - Generate responsive styles, colors, spacing

## Template Configuration

Each template is defined with a comprehensive configuration:

```typescript
interface TemplateConfig {
  id: TemplateType;
  name: string;
  description: string;
  preview: string;
  styles: {
    header: {
      nameSize: number;
      titleSize: number;
      contactSize: number;
      alignment: "left" | "center" | "right";
    };
    sections: {
      headerStyle: "uppercase" | "title-case" | "lowercase";
      headerSize: number;
      headerDecoration: "border-bottom" | "background" | "none";
      spacing: number;
    };
    layout: {
      maxWidth: number;
      columns: 1 | 2;
    };
    colors: {
      primary: string;
      secondary: string;
      text: string;
      background: string;
    };
  };
}
```

## Available Templates

### 1. Classic Template
- **ID:** `classic`
- **Description:** Traditional chronological format with clean typography
- **Best For:** Traditional industries, conservative companies, senior roles
- **ATS Score:** 95/100
- **Features:** Left-aligned header, uppercase section headers, border decorations

### 2. Modern Template
- **ID:** `modern`
- **Description:** Clean, contemporary design with subtle accents
- **Best For:** Tech companies, startups, creative roles
- **ATS Score:** 90/100
- **Features:** Centered header, title-case sections, background decorations

### 3. Minimal Template
- **ID:** `minimal`
- **Description:** Ultra-clean, space-efficient design
- **Best For:** Academic positions, research roles, content-heavy resumes
- **ATS Score:** 98/100
- **Features:** Compact spacing, no decorations, maximum content density

### 4. Abhiram Template
- **ID:** `abhiram`
- **Description:** Professional template based on successful backend engineer resume
- **Best For:** Backend engineering, DevOps, technical leadership
- **ATS Score:** 100/100
- **Features:** Centered header, proven ATS success, technical focus

## Usage Examples

### Basic Template Usage

```tsx
import { TemplateBase } from '../Templates';

const MyTemplate = forwardRef<HTMLDivElement, TemplateBaseProps>(
  ({ resume, layout, className, printMode }, ref) => {
    return (
      <TemplateBase
        ref={ref}
        resume={resume}
        layout={layout}
        className={className}
        printMode={printMode}
      >
        {/* Custom template content */}
      </TemplateBase>
    );
  }
);
```

### Using Template Helpers

```tsx
import { templateHelpers } from '../Templates';

// Format dates
const dateRange = templateHelpers.date.formatDateRange(
  startDate, 
  endDate, 
  isCurrent
);

// Format phone numbers
const formattedPhone = templateHelpers.phone.format(phoneNumber);

// Format URLs
const displayUrl = templateHelpers.url.formatForDisplay(websiteUrl);

// Validate content
const hasContent = templateHelpers.validation.hasContent(section);
```

### Using the Template Hook

```tsx
import { useTemplate } from '../../hooks/useTemplate';

const TemplateSelector = () => {
  const {
    currentTemplate,
    availableTemplates,
    switchTemplate,
    validateTemplate,
  } = useTemplate();

  const handleTemplateChange = (templateId: TemplateType) => {
    switchTemplate(templateId, false); // Don't preserve layout
  };

  return (
    <div>
      <h3>Current: {currentTemplate.name}</h3>
      {availableTemplates.map(template => (
        <button
          key={template.id}
          onClick={() => handleTemplateChange(template.id)}
        >
          {template.name}
        </button>
      ))}
    </div>
  );
};
```

## Template Development Guidelines

### Creating New Templates

1. **Extend TemplateBase** - Use the base component for consistency
2. **Follow ATS Guidelines** - Maintain compliance with ATS requirements
3. **Use Template Helpers** - Leverage existing formatting utilities
4. **Support Print Mode** - Ensure proper print/PDF rendering
5. **Test Thoroughly** - Validate with real ATS systems

### ATS Compliance Requirements

- **Fonts:** Use only ATS-safe fonts (Arial, Helvetica, Times New Roman, Georgia, Calibri)
- **Layout:** Single-column, no tables or complex layouts
- **Headers:** Standard section names
- **Formatting:** Simple bold/italic only
- **Colors:** High contrast, print-friendly
- **Structure:** Logical heading hierarchy

### Performance Considerations

- **Memoization** - Use React.memo for expensive components
- **Lazy Loading** - Load templates on demand
- **Style Optimization** - Minimize inline styles
- **Bundle Size** - Keep template code lightweight

## Template Validation

The system includes comprehensive template validation:

### ATS Compliance Checking
- Font compatibility
- Layout structure
- Section naming
- Color contrast
- Content accessibility

### Content Compatibility
- Section count limits
- Content density analysis
- Required section validation
- Template-specific recommendations

### Performance Validation
- Rendering performance
- Bundle size impact
- Memory usage
- Load time optimization

## Integration Points

### With Preview System
- Templates render within PreviewContainer
- Support zoom and print modes
- Real-time layout updates
- PDF generation compatibility

### With Layout Controls
- Template-specific customization options
- Style inheritance and overrides
- Reset to template defaults
- Live preview updates

### With State Management
- Template switching preserves data
- Layout settings integration
- Undo/redo support
- Auto-save compatibility

## Future Enhancements

### Planned Features
- Custom template creation
- Template marketplace
- Advanced customization options
- Multi-page template support
- Template versioning
- Collaborative template editing

### Template Roadmap
- Industry-specific templates
- Role-based recommendations
- AI-powered template suggestions
- Template performance analytics
- A/B testing for template effectiveness

## Testing Strategy

### Unit Tests
- Template helper functions
- Template configuration validation
- Hook functionality
- Component rendering

### Integration Tests
- Template switching
- Layout application
- Print mode rendering
- PDF generation

### ATS Testing
- Real ATS system validation
- Parse rate testing
- Content extraction verification
- Cross-platform compatibility

## Troubleshooting

### Common Issues

**Template Not Rendering**
- Check template configuration
- Verify component imports
- Validate resume data structure

**Layout Not Applying**
- Ensure template switching triggers layout update
- Check for CSS conflicts
- Verify style inheritance

**Print Issues**
- Check print-specific CSS
- Validate page dimensions
- Test across browsers

**Performance Problems**
- Profile component rendering
- Check for unnecessary re-renders
- Optimize style calculations

### Debug Tools

- React DevTools for component inspection
- Template validation utilities
- ATS compliance checker
- Performance profiler