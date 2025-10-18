# ATS-Friendly Resume Builder - Project Documentation

## 1. Project Overview

### 1.1 Purpose
A React-based resume builder application that enables software engineers to create, customize, and download ATS (Applicant Tracking System) compliant resumes. The application focuses on maximum customization while maintaining ATS compatibility.

### 1.2 Core Objectives
- **ATS Optimization**: Ensure all generated resumes are parseable by major ATS systems
- **High Customizability**: Allow granular control over every section and layout property
- **Professional Output**: Generate print-ready PDF resumes
- **Developer-Focused**: Tailored specifically for software engineering resumes
- **Modern UX**: Intuitive interface with real-time preview

---

## 2. Technical Architecture

### 2.1 Technology Stack

**Frontend Framework**
- React 18+ (with Hooks)
- TypeScript for type safety
- Vite for build tooling

**State Management**
- React Context API + useReducer for global state
- Local state for component-specific data

**Styling**
- Tailwind CSS for utility classes
- CSS Modules for component-specific styles
- Print-specific CSS for PDF generation

**PDF Generation**
- react-to-print for client-side PDF generation
- html2canvas + jsPDF as fallback option
- Native browser print API optimization

**Storage**
- LocalStorage for auto-save functionality
- IndexedDB for storing multiple resume versions
- JSON export/import capability

### 2.2 Project Structure

```
src/
├── components/
│   ├── Editor/
│   │   ├── Sidebar/
│   │   │   ├── PersonalInfoEditor.tsx
│   │   │   ├── ExperienceEditor.tsx
│   │   │   ├── ProjectsEditor.tsx
│   │   │   ├── EducationEditor.tsx
│   │   │   ├── SkillsEditor.tsx
│   │   │   ├── CertificationsEditor.tsx
│   │   │   └── SectionManager.tsx
│   │   ├── Preview/
│   │   │   └── ResumePreview.tsx
│   │   └── Toolbar/
│   │       ├── TemplateSelector.tsx
│   │       ├── LayoutControls.tsx
│   │       └── ExportControls.tsx
│   ├── Templates/
│   │   ├── ClassicTemplate.tsx
│   │   ├── ModernTemplate.tsx
│   │   ├── MinimalTemplate.tsx
│   │   ├── AbhiramTemplate.tsx
│   │   └── TemplateBase.tsx
│   ├── UI/
│   │   ├── Input.tsx
│   │   ├── Button.tsx
│   │   ├── Select.tsx
│   │   ├── RangeSlider.tsx
│   │   └── ColorPicker.tsx
│   └── Layout/
│       ├── EditorLayout.tsx
│       └── LandingPage.tsx
├── contexts/
│   ├── ResumeContext.tsx
│   └── ThemeContext.tsx
├── hooks/
│   ├── useResume.ts
│   ├── useAutoSave.ts
│   ├── usePDFExport.ts
│   └── useTemplateCustomization.ts
├── types/
│   ├── resume.types.ts
│   ├── template.types.ts
│   └── layout.types.ts
├── utils/
│   ├── atsValidator.ts
│   ├── pdfGenerator.ts
│   ├── storageManager.ts
│   └── templateHelpers.ts
└── constants/
    ├── defaultResume.ts
    ├── templateConfigs.ts
    └── atsGuidelines.ts
```

---

## 3. Data Models

### 3.1 Resume Data Structure

```typescript
interface Resume {
  id: string;
  metadata: {
    createdAt: string;
    updatedAt: string;
    version: string;
  };
  personalInfo: PersonalInfo;
  sections: Section[];
  layout: LayoutSettings;
  template: TemplateConfig;
}

interface PersonalInfo {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  customLinks?: CustomLink[];
}

interface Section {
  id: string;
  type: SectionType;
  title: string;
  enabled: boolean;
  order: number;
  content: SectionContent;
  styling: SectionStyling;
}

type SectionType = 
  | 'summary' 
  | 'experience' 
  | 'projects' 
  | 'skills' 
  | 'education' 
  | 'certifications'
  | 'custom';

interface LayoutSettings {
  pageMargins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  sectionSpacing: number;
  lineHeight: number;
  fontSize: {
    name: number;
    title: number;
    sectionHeader: number;
    body: number;
  };
  fontFamily: string;
  colors: {
    primary: string;
    secondary: string;
    text: string;
  };
}
```

### 3.2 Template Configuration

```typescript
interface TemplateConfig {
  id: string;
  name: string;
  thumbnail: string;
  layout: 'single-column' | 'two-column';
  atsScore: number;
  customizable: {
    colors: boolean;
    fonts: boolean;
    spacing: boolean;
    sectionOrder: boolean;
  };
  defaultSettings: LayoutSettings;
}
```

---

## 4. Application Flow

### 4.1 User Journey

```
Landing Page
    ↓
Template Selection
    ↓
Personal Info Input
    ↓
[Editor Interface]
    ├── Add/Edit Sections (Sidebar)
    ├── Real-time Preview (Center)
    └── Customize Layout (Toolbar)
    ↓
ATS Validation Check
    ↓
Download PDF / Export JSON
```

### 4.2 Editor Interface Layout

```
+--------------------------------------------------+
|  Header: [Logo] [Save] [Templates] [Export]     |
+----------+---------------------------+-----------+
|          |                           |           |
|  Sidebar |    Resume Preview         | Layout    |
|  Editor  |    (Live Update)          | Controls  |
|          |                           |           |
|  Section |    Scrollable             | Margins   |
|  Toggles |    Print-sized            | Spacing   |
|          |    Canvas                 | Fonts     |
|  Content |                           | Colors    |
|  Forms   |                           |           |
|          |                           |           |
+----------+---------------------------+-----------+
|  Footer: [ATS Score] [Tips] [Help]              |
+--------------------------------------------------+
```

---

## 5. Key Features Specification

### 5.1 Template System

**Available Templates:**
1. **Classic Template** - Traditional chronological format
2. **Modern Template** - Clean, contemporary design
3. **Minimal Template** - Ultra-clean, space-efficient
4. **Abhiram Template** - Professional backend engineer focused (from provided sample)

**Template Capabilities:**
- Switch between templates without losing data
- Template-specific layout presets
- Customizable while maintaining ATS compliance
- Export custom templates as JSON

### 5.2 Section Management

**Standard Sections:**
- Personal Information (Name, Contact, Links)
- Professional Summary
- Work Experience
- Projects
- Technical Skills
- Education
- Certifications

**Section Features:**
- Enable/disable sections
- Reorder sections via drag-and-drop
- Add custom sections
- Section-specific styling overrides
- Collapsible editor panels

### 5.3 Customization Controls

**Layout Adjustments:**
- Page margins (top, right, bottom, left) - 0.1" to 2" range
- Section spacing - 5px to 30px range
- Line height - 1.0 to 2.0 range
- Font sizes - independent control for each text level

**Typography:**
- Font family selection (ATS-safe fonts only)
  - Arial, Helvetica, Times New Roman, Georgia, Calibri
- Font weight options per section
- Text alignment options

**Colors:**
- Primary color (headers, borders)
- Secondary color (dates, meta info)
- Text color
- Preset color schemes

### 5.4 ATS Compliance Features

**Validation Rules:**
- Plain text parseable content
- No tables, text boxes, or images
- Standard section headers
- Consistent formatting
- Machine-readable fonts
- Proper heading hierarchy
- No columns (or ATS-safe column layout)

**ATS Score Calculator:**
- Real-time score (0-100)
- Specific recommendations
- Common pitfalls warnings
- Best practices tips

### 5.5 PDF Export

**Export Features:**
- High-quality PDF generation
- Preserve exact layout and styling
- Letter size (8.5" x 11") standard
- Print-optimized rendering
- File naming: `[Name]_Resume_[Date].pdf`
- Preview before download

---

## 6. Development Phases

### Phase 1: Foundation (Tasks 1-10)
- Project setup and configuration
- Core data models and types
- Basic UI components library
- Resume context and state management

### Phase 2: Editor Core (Tasks 11-20)
- Sidebar section editors
- Live preview component
- Template base structure
- Basic layout controls

### Phase 3: Templates (Tasks 21-30)
- Implement all 4 templates
- Template switching logic
- Template customization system
- Abhiram template from provided HTML

### Phase 4: Advanced Features (Tasks 31-40)
- Advanced customization controls
- Drag-and-drop section reordering
- ATS validation engine
- Auto-save functionality

### Phase 5: Export & Polish (Tasks 41-50)
- PDF generation implementation
- JSON export/import
- Storage management (LocalStorage/IndexedDB)
- UI/UX refinements and responsiveness

### Phase 6: Testing & Optimization (Tasks 51-55)
- ATS testing with real systems
- Performance optimization
- Cross-browser testing
- Documentation

---

## 7. ATS Optimization Guidelines

### 7.1 Content Structure Rules

**DO:**
- Use standard section headings
- Keep formatting simple and consistent
- Use bullet points for lists
- Include relevant keywords naturally
- Use standard date formats
- Stick to common fonts

**DON'T:**
- Use headers/footers
- Include images or graphics
- Use tables for layout
- Use text boxes or columns
- Use special characters excessively
- Use uncommon section titles

### 7.2 Formatting Best Practices

- **Font Size:** 10-12pt for body, 14-22pt for name
- **Margins:** 0.5" - 1" all sides
- **Line Spacing:** 1.0 - 1.3
- **Section Spacing:** Consistent throughout
- **Bold/Italic:** Use sparingly for emphasis
- **Bullet Points:** Standard bullets only

---

## 8. Technical Implementation Notes

### 8.1 PDF Generation Strategy

```typescript
// Preferred approach using react-to-print
const handlePrint = useReactToPrint({
  content: () => componentRef.current,
  documentTitle: `${resume.personalInfo.fullName}_Resume`,
  pageStyle: `
    @page {
      size: letter;
      margin: 0;
    }
    @media print {
      body { margin: 0; }
      .no-print { display: none; }
    }
  `
});
```

### 8.2 Storage Strategy

- **Auto-save:** Every 30 seconds to LocalStorage
- **Manual save:** Store to IndexedDB as named versions
- **Export:** Download as JSON for backup
- **Import:** Upload JSON to restore resume

### 8.3 Responsive Design

- **Desktop First:** Optimize for 1920x1080
- **Editor Layout:** 
  - Sidebar: 300px fixed
  - Preview: Flexible center (max 850px)
  - Controls: 250px fixed
- **Mobile:** Stack layout vertically, hide controls in drawer

---

## 9. Performance Considerations

- Debounce input changes (300ms)
- Memoize preview rendering
- Lazy load templates
- Optimize re-renders with React.memo
- Virtual scrolling for long sections
- Web Workers for PDF generation

---

## 10. Future Enhancements

- Multi-page resume support
- AI-powered content suggestions
- Cover letter generator
- LinkedIn profile import
- ATS system-specific optimizations
- Collaboration features
- Resume analytics dashboard
- Integration with job boards

---

## 11. Success Metrics

- ATS parse rate > 95%
- PDF generation < 3 seconds
- Auto-save reliability 99.9%
- Template switching < 500ms
- Cross-browser compatibility (Chrome, Firefox, Safari, Edge)
- Mobile usability score > 80

---

## 12. Resources & References

- [ATS Best Practices Guide](https://www.jobscan.co/blog/ats-resume/)
- [React-to-Print Documentation](https://github.com/gregnb/react-to-print)
- [PDF Generation Comparison](https://blog.logrocket.com/generate-pdf-react/)
- [Typography for Resumes](https://www.indeed.com/career-advice/resumes-cover-letters/resume-font)
