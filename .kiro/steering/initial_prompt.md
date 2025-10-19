# ATS Resume Builder - Initial Project Setup Prompt

## Project Overview

We are building an **ATS-Friendly Resume Builder** specifically designed for software engineers. This is a React-based web application that allows users to create, customize, and download professional resumes optimized for Applicant Tracking Systems (ATS).

## Core Requirements

### 1. Primary Functionality
- **Resume Creation**: Users can build resumes with customizable sections
- **PDF Export**: Generate and download resume as a high-quality PDF
- **ATS Compliance**: Ensure all resumes are parseable by major ATS systems
- **Real-time Preview**: Live preview of resume as user makes changes
- **Multiple Templates**: Support 4 different resume templates including a custom "Abhiram" template

### 2. Key Features

#### Highly Customizable Sections
Every section must be independently customizable:
- **Personal Information**: Name, title, contact details, social links
- **Professional Summary**: Brief career overview
- **Work Experience**: Job title, company, dates, responsibilities
- **Projects**: Project name, tech stack, dates, descriptions
- **Technical Skills**: Categorized skills (Languages, Databases, Tools, etc.)
- **Education**: Degree, university, dates, coursework
- **Certifications**: Certification name, issuer, dates

#### Layout Customization
- **Page Margins**: Adjustable top, right, bottom, left (0.1" - 2" range)
- **Section Spacing**: Control space between sections (5px - 30px)
- **Line Height**: Adjust line spacing (1.0 - 2.0)
- **Font Sizes**: Independent control for name, title, headers, body text
- **Font Selection**: Choose from ATS-safe fonts (Arial, Helvetica, Times New Roman, Georgia, Calibri)
- **Colors**: Customize primary, secondary, and text colors

#### Section Management
- **Enable/Disable**: Toggle sections on/off
- **Reorder**: Drag-and-drop to reorder sections
- **Custom Sections**: Add user-defined sections
- **Section-specific Styling**: Override global styles per section

### 3. ATS Compliance Requirements

**CRITICAL: All features must maintain ATS compatibility**

ATS-Safe Practices:
- Plain text parseable content
- No tables, columns, or text boxes for layout
- Standard section headers
- Machine-readable fonts only
- No images or graphics in PDF
- Consistent formatting throughout
- Proper heading hierarchy
- Standard bullet points only

ATS Validation System:
- Real-time ATS score (0-100)
- Specific issue identification
- Improvement recommendations
- Best practices tips

### 4. Technical Implementation

#### Technology Stack
- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + CSS Modules
- **State Management**: React Context API + useReducer
- **PDF Generation**: react-to-print library
- **Storage**: LocalStorage (auto-save) + IndexedDB (versions)
- **Icons**: Lucide React

#### Project Structure Required
```
src/
├── components/
│   ├── Editor/          # Sidebar editors for each section
│   ├── Preview/         # Resume preview component
│   ├── Templates/       # Resume template components
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

### 5. Template Requirements

**Four Templates to Implement:**

1. **Classic Template**: Traditional chronological format
2. **Modern Template**: Clean, contemporary design  
3. **Minimal Template**: Ultra-clean, space-efficient
4. **Abhiram Template**: Based on the provided sample resume

**Abhiram Template Specifications** (from provided HTML):
- Header: Centered name (22pt), role subtitle (12pt), contact info (9pt)
- Section headers: Uppercase, bold, 12pt, with bottom border
- Two-column layout for skills section
- Experience items: Bold job titles, italic company names, right-aligned dates
- Clean professional design with #2c3e50 as primary color
- Optimized spacing for single-page format
- Print button with download functionality

### 6. User Interface Layout

```
┌─────────────────────────────────────────────────────────────┐
│  Header: [Logo] [Templates ▼] [Save] [Export PDF]           │
├─────────────┬──────────────────────────┬────────────────────┤
│             │                          │                    │
│  SIDEBAR    │    RESUME PREVIEW        │  LAYOUT CONTROLS  │
│  (300px)    │    (Flexible center)     │  (250px)          │
│             │                          │                    │
│ ┌─────────┐ │  ┌──────────────────┐   │ ┌───────────────┐ │
│ │Section  │ │  │                  │   │ │ Margins       │ │
│ │Toggles  │ │  │   Live Preview   │   │ │  Top: [===]   │ │
│ └─────────┘ │  │   (Print-sized)  │   │ │  Right: [==]  │ │
│             │  │                  │   │ │  Bottom: [==] │ │
│ ┌─────────┐ │  │   Scrollable     │   │ │  Left: [===]  │ │
│ │Personal │ │  │   Canvas         │   │ └───────────────┘ │
│ │Info     │ │  │                  │   │                    │
│ │Form     │ │  └──────────────────┘   │ ┌───────────────┐ │
│ └─────────┘ │                          │ │ Spacing       │ │
│             │                          │ │  Section: [=] │ │
│ ┌─────────┐ │                          │ │  Line: [===]  │ │
│ │Work Exp │ │                          │ └───────────────┘ │
│ │Editor   │ │                          │                    │
│ └─────────┘ │                          │ ┌───────────────┐ │
│             │                          │ │ Typography    │ │
│ [+ Section] │                          │ │  Font: [▼]    │ │
│             │                          │ │  Sizes: [▼]   │ │
│             │                          │ └───────────────┘ │
└─────────────┴──────────────────────────┴────────────────────┘
│  Footer: ATS Score: 85/100 ⚠️ 2 Warnings [View Details]     │
└─────────────────────────────────────────────────────────────┘
```

### 7. Core Data Model

```typescript
interface Resume {
  id: string;
  personalInfo: {
    fullName: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    github?: string;
    portfolio?: string;
  };
  sections: Array<{
    id: string;
    type: 'summary' | 'experience' | 'projects' | 'skills' | 'education' | 'certifications' | 'custom';
    title: string;
    enabled: boolean;
    order: number;
    content: any; // Section-specific content
  }>;
  layout: {
    pageMargins: { top: number; right: number; bottom: number; left: number; };
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
  };
  template: 'classic' | 'modern' | 'minimal' | 'abhiram';
}
```

### 8. Development Approach

This project will be built incrementally using a task-based approach:

1. **Foundation First**: Set up project structure, types, and basic components
2. **Core Functionality**: Build editor, preview, and state management
3. **Templates**: Implement all four resume templates
4. **Customization**: Add layout controls and styling options
5. **Export & Persistence**: Implement PDF generation and data storage
6. **Polish**: ATS validation, optimization, and UX refinements

Each task should be:
- **Focused**: Address one specific feature or component
- **Independent**: Minimal dependencies on incomplete tasks
- **Testable**: Can be validated individually
- **Documented**: Include inline comments for complex logic

### 9. Important Constraints

#### PDF Generation Must:
- Use browser's native print functionality via react-to-print
- Render exact WYSIWYG output
- Maintain letter size (8.5" x 11")
- Generate selectable, parseable text
- Apply print-specific CSS via `@media print`
- Work across Chrome, Firefox, Safari, Edge

#### Storage Strategy:
- **Auto-save**: Every 30 seconds to LocalStorage
- **Manual save**: Store named versions to IndexedDB
- **Export**: Download resume data as JSON
- **Import**: Upload JSON to restore resume

#### Performance Requirements:
- Preview updates < 100ms
- Template switching < 500ms
- PDF generation < 3 seconds
- No visible lag during typing
- Smooth scrolling in preview

### 10. Success Criteria

The application is complete when:
- ✅ Users can create a complete resume with all sections
- ✅ Real-time preview updates as user types
- ✅ All 4 templates are implemented and switchable
- ✅ Page margins and spacing are fully adjustable
- ✅ Font family, sizes, and colors are customizable
- ✅ Sections can be toggled, reordered, and customized
- ✅ PDF export generates high-quality, ATS-compliant output
- ✅ ATS validation provides real-time feedback
- ✅ Auto-save prevents data loss
- ✅ Application works on desktop browsers (1920x1080+)

### 11. Code Quality Standards

**TypeScript:**
- Strict mode enabled
- No `any` types without justification
- All components properly typed
- Interface definitions for all data structures

**React:**
- Functional components only
- Proper hook usage and dependencies
- Memoization for expensive operations
- Error boundaries for resilience

**Styling:**
- Tailwind utility classes primarily
- CSS Modules for component-specific styles
- Print CSS for PDF output
- Responsive design patterns

**State Management:**
- Single source of truth (ResumeContext)
- Reducer pattern for complex updates
- Proper immutability
- Optimistic UI updates

### 12. Reference Materials

**Abhiram Template HTML** (provided in uploaded file):
The provided resume.html file contains the complete implementation of a professional backend engineer resume. Key elements to extract:
- Header structure with centered name and contact info
- Section header styling with borders
- Experience item layout with company/dates
- Skills grid with categorized technical skills
- Project items with tech stack displays
- Education and certifications sections
- Print button functionality
- Professional color scheme (#2c3e50 primary)
- Optimized spacing and typography

Use this template as the "Abhiram Template" - one of the four templates available in the application.

### 13. What to Build First

**Immediate First Steps:**
1. Initialize Vite + React + TypeScript project
2. Install dependencies (Tailwind, react-to-print, lucide-react)
3. Set up project folder structure
4. Create type definitions in `types/resume.types.ts`
5. Create ResumeContext with reducer
6. Build basic layout shell with three-panel design
7. Create simple PersonalInfo editor and preview

**DO NOT:**
- Build everything at once
- Skip type definitions
- Ignore ATS compliance rules
- Hardcode values that should be customizable
- Create placeholder components without functionality

### 14. Testing Requirements

**Manual Testing Checklist:**
- [ ] All form inputs update preview immediately
- [ ] Template switching preserves data
- [ ] PDF matches preview exactly
- [ ] Margins and spacing controls work
- [ ] Font changes apply correctly
- [ ] Colors update throughout resume
- [ ] Section toggle shows/hides content
- [ ] Auto-save recovers data after page refresh
- [ ] Export/import JSON works correctly

**ATS Testing:**
- [ ] Use online ATS checkers (Jobscan, Resume Worded)
- [ ] Verify text is selectable in PDF
- [ ] Check parsing with real ATS systems if possible
- [ ] Validate standard section recognition
- [ ] Confirm font readability

### 15. Development Environment Setup

```bash
# Create project
npm create vite@latest ats-resume-builder -- --template react-ts

# Install dependencies
npm install
npm install -D tailwindcss postcss autoprefixer
npm install react-to-print lucide-react
npm install localforage # For IndexedDB

# Initialize Tailwind
npx tailwindcss init -p

# Start development
npm run dev
```

### 16. Key Technical Decisions

**Why React Context over Redux:**
- Simpler setup for single-purpose app
- Sufficient for our state complexity
- Better TypeScript integration
- Easier to understand and maintain

**Why react-to-print over other PDF libraries:**
- Uses native browser print (best quality)
- Maintains exact layout fidelity
- Smaller bundle size
- Better cross-browser support
- Leverages CSS print media queries

**Why Tailwind CSS:**
- Rapid development
- Consistent design system
- Small production bundle
- Easy customization
- Great developer experience

### 17. Common Pitfalls to Avoid

❌ **Don't:** Create complex table layouts (bad for ATS)
✅ **Do:** Use simple div/flexbox layouts

❌ **Don't:** Use images or icons in resume content
✅ **Do:** Use plain text with careful formatting

❌ **Don't:** Implement multi-column layouts
✅ **Do:** Use single-column or ATS-safe two-column

❌ **Don't:** Add decorative fonts or special characters
✅ **Do:** Stick to standard, machine-readable fonts

❌ **Don't:** Create deeply nested components
✅ **Do:** Keep component hierarchy flat and simple

❌ **Don't:** Mutate state directly
✅ **Do:** Use immutable update patterns

### 18. Final Notes

This is a professional-grade application that should:
- **Feel polished**: Smooth animations, intuitive controls
- **Be reliable**: Auto-save, error handling, graceful degradation  
- **Perform well**: Fast updates, efficient rendering
- **Look professional**: Clean design, consistent styling
- **Help users**: Clear feedback, helpful tips, ATS guidance

The goal is to create a tool that software engineers actually want to use to build their resumes - combining powerful customization with ATS safety nets.

---

## Next Steps

After reviewing this document and the .cursorrules file:

1. Set up the initial project structure
2. Create the type definitions
3. Build the ResumeContext
4. Start with the basic three-panel layout
5. Then proceed with the task-by-task implementation

Each subsequent task will be provided as a focused prompt that builds incrementally on the previous work.

**Ready to begin? Start with Task 1: Project Initialization and Setup.**