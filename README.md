# ATS Resume Builder

A professional-grade resume builder specifically designed for software engineers, optimized for Applicant Tracking Systems (ATS) compliance.

## Features

- **Real-time Preview**: Live preview of your resume as you make changes
- **ATS Compliance**: Built-in validation to ensure your resume passes ATS systems
- **Multiple Templates**: 4 professional templates including the "Abhiram" template
- **Highly Customizable**: Adjust margins, spacing, fonts, colors, and more
- **PDF Export**: Generate high-quality PDFs using browser's native print functionality
- **Auto-save**: Never lose your work with automatic saving to localStorage
- **Section Management**: Enable/disable sections, reorder content, add custom sections

## Technology Stack

- **Frontend**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: React Context API + useReducer
- **PDF Generation**: react-to-print
- **Storage**: LocalStorage + IndexedDB
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd resumeBuilder
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run TypeScript type checking

## Project Structure

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

## Templates

### 1. Classic Template

Traditional chronological format with clean typography and standard layout.

### 2. Modern Template

Clean, contemporary design with subtle accents and centered header.

### 3. Minimal Template

Ultra-clean, space-efficient design with minimal styling.

### 4. Abhiram Template

Professional template based on a successful backend engineer resume with optimized spacing and typography.

## ATS Compliance

The application includes built-in ATS validation that checks for:

- Required fields (name, email, phone)
- ATS-safe fonts (Arial, Helvetica, Times New Roman, Georgia, Calibri)
- Standard section headers
- Proper formatting
- Machine-readable content

## Customization Options

### Layout Controls

- **Page Margins**: Adjustable top, right, bottom, left (0.1" - 2" range)
- **Section Spacing**: Control space between sections (5px - 30px)
- **Line Height**: Adjust line spacing (1.0 - 2.0)

### Typography

- **Font Family**: Choose from ATS-safe fonts
- **Font Sizes**: Independent control for name, title, headers, body text
- **Colors**: Customize primary, secondary, and text colors

### Section Management

- **Enable/Disable**: Toggle sections on/off
- **Reorder**: Drag-and-drop to reorder sections
- **Custom Sections**: Add user-defined sections

## PDF Export

The application uses the browser's native print functionality to generate PDFs:

- High-quality rendering
- Exact WYSIWYG output
- Letter size (8.5" x 11")
- Selectable, parseable text
- Cross-browser compatibility

## Data Persistence

- **Auto-save**: Every 30 seconds to localStorage
- **Manual save**: Store named versions (planned)
- **Export**: Download resume data as JSON
- **Import**: Upload JSON to restore resume (planned)

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Development

### Code Quality Standards

- **TypeScript**: Strict mode enabled, no `any` types
- **React**: Functional components only, proper hook usage
- **Styling**: Tailwind utility classes, CSS Modules for component-specific styles
- **State Management**: Single source of truth, reducer pattern

### Contributing

1. Follow the established code patterns
2. Maintain ATS compliance in all features
3. Add proper TypeScript types
4. Test across different browsers
5. Ensure responsive design

## License

ISC License

## Support

For issues or questions, please create an issue in the repository.
