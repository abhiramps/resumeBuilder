---
inclusion: always
---

# ATS Compliance Rules - Frontend

## Critical: ATS Compliance is Non-Negotiable

Every feature, component, and styling decision MUST maintain ATS (Applicant Tracking System) compatibility. This is the core value proposition of the application.

## ATS-Safe Practices

### ✅ DO: Use Simple, Parseable HTML

```typescript
// ✅ Good: Simple div-based layout
<div className="resume-section">
  <h2 className="section-header">Work Experience</h2>
  <div className="experience-item">
    <h3 className="job-title">Software Engineer</h3>
    <p className="company">Tech Company</p>
    <ul className="responsibilities">
      <li>Developed features</li>
      <li>Fixed bugs</li>
    </ul>
  </div>
</div>

// ❌ Bad: Tables for layout
<table>
  <tr>
    <td>Work Experience</td>
  </tr>
</table>

// ❌ Bad: Complex CSS Grid/Flexbox that breaks parsing
<div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr' }}>
  {/* Content */}
</div>
```

### ✅ DO: Use Standard Section Headers

```typescript
// ✅ Good: Standard headers
const STANDARD_HEADERS = {
  summary: 'Professional Summary',
  experience: 'Work Experience',
  education: 'Education',
  skills: 'Technical Skills',
  projects: 'Projects',
  certifications: 'Certifications',
};

// ❌ Bad: Creative headers
const headers = {
  summary: '🚀 About Me',
  experience: 'My Journey',
  skills: 'What I Know',
};
```

### ✅ DO: Use ATS-Safe Fonts

```typescript
// ✅ Good: ATS-safe fonts
const ATS_SAFE_FONTS = [
  'Arial',
  'Helvetica',
  'Times New Roman',
  'Georgia',
  'Calibri',
];

// ❌ Bad: Decorative fonts
const fonts = [
  'Comic Sans',
  'Papyrus',
  'Brush Script',
];
```

### ✅ DO: Keep Text Selectable

```typescript
// ✅ Good: Regular text
<p className="text-gray-900">Software Engineer</p>

// ❌ Bad: Text as image
<img src="job-title.png" alt="Software Engineer" />

// ❌ Bad: Text in canvas
<canvas>Software Engineer</canvas>
```

### ✅ DO: Use Simple Bullet Points

```typescript
// ✅ Good: Standard bullets
<ul className="list-disc ml-5">
  <li>Developed features</li>
  <li>Fixed bugs</li>
</ul>

// ❌ Bad: Custom icons as bullets
<div className="flex items-start">
  <CheckIcon className="mt-1" />
  <span>Developed features</span>
</div>
```

### ✅ DO: Avoid Graphics and Icons in Content

```typescript
// ✅ Good: Text-only contact info
<div>
  <p>Email: john@example.com</p>
  <p>Phone: (555) 123-4567</p>
</div>

// ❌ Bad: Icons in resume content
<div className="flex items-center gap-2">
  <MailIcon />
  <span>john@example.com</span>
</div>
```

### ✅ DO: Use Standard Date Formats

```typescript
// ✅ Good: Standard formats
const formatDate = (date: string) => {
  return 'Jan 2020 - Dec 2023';
  // or 'January 2020 - December 2023'
  // or '01/2020 - 12/2023'
};

// ❌ Bad: Ambiguous formats
const formatDate = (date: string) => {
  return '20-23'; // Unclear
};
```

## ATS Validation Rules

### Check Before Allowing

```typescript
// Validate template before allowing user to select
const validateTemplate = (template: Template): ATSValidation => {
  const issues: string[] = [];
  
  // Check for tables
  if (template.config.usesTable) {
    issues.push('Template uses tables for layout');
  }
  
  // Check for columns
  if (template.config.columns > 1) {
    issues.push('Multi-column layouts may not parse correctly');
  }
  
  // Check for images
  if (template.config.hasImages) {
    issues.push('Template includes images in content area');
  }
  
  // Check fonts
  if (!ATS_SAFE_FONTS.includes(template.config.fontFamily)) {
    issues.push(`Font ${template.config.fontFamily} may not be ATS-safe`);
  }
  
  return {
    isValid: issues.length === 0,
    score: calculateATSScore(issues),
    issues,
  };
};
```

### Real-Time ATS Scoring

```typescript
// Calculate ATS score as user edits
const calculateATSScore = (resume: Resume): number => {
  let score = 100;
  
  // Deduct for missing required sections
  if (!resume.sections.find(s => s.type === 'experience')) {
    score -= 20;
  }
  if (!resume.sections.find(s => s.type === 'education')) {
    score -= 10;
  }
  
  // Deduct for missing contact info
  if (!resume.personalInfo.email) score -= 15;
  if (!resume.personalInfo.phone) score -= 10;
  
  // Deduct for unsafe fonts
  if (!ATS_SAFE_FONTS.includes(resume.layout.fontFamily)) {
    score -= 15;
  }
  
  // Deduct for special characters in section headers
  resume.sections.forEach(section => {
    if (/[^a-zA-Z0-9\s]/.test(section.title)) {
      score -= 5;
    }
  });
  
  return Math.max(0, score);
};
```

## PDF Export Requirements

### Ensure Text is Selectable

```typescript
// ✅ Good: Use react-to-print with proper HTML
import { useReactToPrint } from 'react-to-print';

const handlePrint = useReactToPrint({
  content: () => resumeRef.current,
  documentTitle: `${resume.personalInfo.fullName}_Resume`,
});

// The resume component should render as HTML, not canvas
const ResumePreview = forwardRef<HTMLDivElement>((props, ref) => {
  return (
    <div ref={ref} className="resume-preview">
      {/* HTML content that will be selectable in PDF */}
    </div>
  );
});
```

### Print-Specific CSS

```css
/* ✅ Good: Print-optimized styles */
@media print {
  /* Remove interactive elements */
  .no-print {
    display: none !important;
  }
  
  /* Ensure proper page breaks */
  .resume-section {
    page-break-inside: avoid;
  }
  
  /* Optimize for black & white printing */
  * {
    color: #000 !important;
    background: #fff !important;
  }
  
  /* Ensure text is selectable */
  * {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}
```

## Warning Users

### Show ATS Warnings

```typescript
// Warn users about ATS issues
const ATSWarning: React.FC<{ issues: string[] }> = ({ issues }) => {
  if (issues.length === 0) return null;
  
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
      <div className="flex items-start gap-2">
        <AlertTriangleIcon className="text-yellow-600 mt-0.5" />
        <div>
          <h4 className="font-semibold text-yellow-900">ATS Compatibility Issues</h4>
          <ul className="mt-2 space-y-1 text-sm text-yellow-800">
            {issues.map((issue, index) => (
              <li key={index}>• {issue}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
```

## Testing ATS Compliance

### Manual Testing Checklist

```typescript
// Test checklist for ATS compliance
const ATS_TEST_CHECKLIST = [
  'Text is selectable in PDF',
  'No tables used for layout',
  'Standard section headers used',
  'ATS-safe fonts only',
  'Contact info is parseable',
  'Dates are in standard format',
  'No images in content area',
  'No special characters in headers',
  'Single-column layout (or ATS-safe two-column)',
  'Bullet points are simple',
];
```

### Automated Testing

```typescript
// Test that resume maintains ATS compliance
describe('ATS Compliance', () => {
  it('should use ATS-safe fonts', () => {
    const { container } = render(<ResumePreview resume={mockResume} />);
    const computedStyle = window.getComputedStyle(container.firstChild as Element);
    const fontFamily = computedStyle.fontFamily;
    
    expect(ATS_SAFE_FONTS.some(font => fontFamily.includes(font))).toBe(true);
  });
  
  it('should not use tables for layout', () => {
    const { container } = render(<ResumePreview resume={mockResume} />);
    const tables = container.querySelectorAll('table');
    
    expect(tables.length).toBe(0);
  });
  
  it('should have selectable text', () => {
    const { getByText } = render(<ResumePreview resume={mockResume} />);
    const element = getByText('Software Engineer');
    
    expect(element.tagName).not.toBe('IMG');
    expect(element.tagName).not.toBe('CANVAS');
  });
});
```

## Resources

- [Jobscan ATS Guide](https://www.jobscan.co/blog/ats-resume/)
- [Resume Worded ATS Tips](https://resumeworded.com/ats-resume-guide)
- [TopResume ATS Checker](https://www.topresume.com/resume-review)

## Remember

**Every feature must pass the ATS test:**
1. Can an ATS system parse this?
2. Will the text be selectable?
3. Are we using standard formats?
4. Is this simple enough for machine reading?

**When in doubt, choose simplicity over creativity.**

ATS compliance is what makes this resume builder valuable. Never compromise on it.
