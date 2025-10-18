# Preview Components

This directory contains the resume preview components that display the formatted resume with proper styling and layout.

## Components

### ResumePreview

The main preview component that renders the resume with:

- **Letter size dimensions** (8.5" x 11")
- **User's layout settings** applied (margins, fonts, colors, spacing)
- **Only enabled sections** displayed
- **Sections in correct order** based on user preferences
- **Print-optimized styling** via CSS media queries
- **ATS-safe formatting** with proper hierarchy
- **forwardRef support** for PDF generation

**Props:**
- `resume: Resume` - The resume data to display
- `className?: string` - Additional CSS classes
- `printMode?: boolean` - Whether to show print-specific styling

**Features:**
- Responsive to layout changes in real-time
- Proper section content rendering for all section types
- Professional typography and spacing
- Contact information formatting
- Empty state handling

### PreviewContainer

A wrapper component that provides:

- **Centered preview** with paper shadow effect
- **Zoom controls** (50% to 200%)
- **Print mode toggle** for exact print preview
- **Responsive scaling** with smooth transitions
- **Scrollable container** for large content

**Props:**
- `className?: string` - Additional CSS classes
- `showZoomControls?: boolean` - Whether to show zoom controls (default: true)
- `showPrintMode?: boolean` - Whether to show print mode toggle (default: true)

**Features:**
- Zoom in/out with buttons or dropdown
- Reset zoom to 100%
- Print mode for exact PDF preview
- Smooth zoom transitions
- Responsive design

## Print Optimization

The preview components include comprehensive print optimization:

### CSS Media Queries
- `@page` setup for letter size
- Hide non-printable elements
- Exact positioning for PDF generation
- Color preservation with `print-color-adjust: exact`

### Page Break Handling
- Avoid breaking sections in the middle
- Keep related content together
- Proper page margins and spacing

### Text Rendering
- High-resolution text for PDF output
- Proper font rendering
- Maintained typography hierarchy

## Usage

```tsx
import { ResumePreview, PreviewContainer } from '../Preview';

// Basic usage
<ResumePreview resume={resumeData} />

// With container and controls
<PreviewContainer>
  <ResumePreview resume={resumeData} printMode={true} />
</PreviewContainer>

// For PDF generation
const previewRef = useRef<HTMLDivElement>(null);
<ResumePreview ref={previewRef} resume={resumeData} printMode={true} />
```

## Integration

The preview components are integrated into the main layout via:

1. **Layout/Preview.tsx** - Wrapper component for the three-panel layout
2. **PreviewContainer** - Provides zoom and print controls
3. **ResumePreview** - Core preview rendering with forwardRef for PDF

## Styling

### Layout Settings Applied
- Font family (ATS-safe fonts only)
- Font sizes (name, title, section headers, body)
- Colors (primary, secondary, text)
- Margins (top, right, bottom, left)
- Section spacing
- Line height

### Print-Specific Styles
- Letter size (8.5" x 11") dimensions
- Proper page margins
- Hidden interactive elements
- Optimized for black & white printing
- Page break controls

## ATS Compliance

The preview maintains ATS compliance by:

- Using only ATS-safe fonts
- Simple, clean formatting
- Standard section headers
- No complex layouts or tables
- Proper text hierarchy
- Machine-readable content

## Performance

- **Memoized rendering** for expensive calculations
- **Smooth transitions** for zoom changes
- **Efficient re-renders** only when resume data changes
- **Optimized print styles** for fast PDF generation

## Accessibility

- Proper semantic HTML structure
- ARIA labels for interactive elements
- Keyboard navigation support
- High contrast support
- Screen reader compatibility

## Browser Support

Tested and optimized for:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Future Enhancements

- Template-specific preview rendering
- Multi-page resume support
- Real-time collaboration preview
- Preview annotations and comments
- Export format options (PDF, Word, etc.)