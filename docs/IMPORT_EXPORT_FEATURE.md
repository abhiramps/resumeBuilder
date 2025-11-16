# Import/Export Feature Documentation

## Overview

The Import/Export feature allows users to export their resumes in multiple formats (JSON, PDF, DOCX) and import resumes from various file types. It also supports bulk operations for exporting multiple resumes at once.

## Features

### 1. Single Resume Export
- **JSON Export**: Export resume data in JSON format for backup and transfer
- **PDF Export**: Generate print-ready PDF documents
- **DOCX Export**: Create editable Word documents

### 2. Bulk Export
- Select multiple resumes using checkbox selection
- Export all selected resumes as a single JSON file
- Includes metadata about the export (count, timestamp, version)

### 3. Resume Import
- **JSON Import**: Import previously exported resumes with full data preservation
- **PDF/DOCX Import**: AI-powered parsing to extract resume content (requires backend support)
- Drag-and-drop file upload support
- File validation and error handling

### 4. Duplicate Resume
- Quick duplication of existing resumes
- Automatically creates a copy with "(Copy)" suffix

## Components

### ImportExportModal
Location: `src/components/UI/ImportExportModal.tsx`

A modal component that provides a unified interface for import and export operations.

**Props:**
```typescript
interface ImportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  resume?: ResumeResponse;           // For single resume operations
  resumes?: ResumeResponse[];        // For bulk operations
  mode: 'single' | 'bulk';
  onImportSuccess?: (resume: ResumeResponse) => void;
}
```

**Features:**
- Tab-based interface (Export/Import)
- Format selection with visual cards
- Drag-and-drop file upload
- Real-time feedback (success/error messages)
- Loading states during operations

## Hooks

### useImportExport
Location: `src/hooks/useImportExport.ts`

Custom hook that manages all import/export operations.

**API:**
```typescript
const {
  isExporting,
  isImporting,
  error,
  exportAsJSON,
  exportAsPDF,
  exportAsDOCX,
  bulkExportAsJSON,
  importFromJSON,
  importFromFile,
  clearError,
} = useImportExport();
```

**Methods:**

- `exportAsJSON(resume)`: Export single resume as JSON
- `exportAsPDF(resumeId)`: Export resume as PDF
- `exportAsDOCX(resumeId)`: Export resume as DOCX
- `bulkExportAsJSON(resumes)`: Export multiple resumes as JSON
- `importFromJSON(file)`: Import resume from JSON file
- `importFromFile(file)`: Import resume from any supported file type
- `clearError()`: Clear error state

## Integration

### Dashboard Page
Location: `src/pages/DashboardPage.tsx`

The dashboard has been enhanced with:

1. **Import Button**: Opens import modal
2. **Select Button**: Enables bulk selection mode
3. **Export Action**: Available in resume card menu
4. **Bulk Actions Bar**: Shows when items are selected

**New UI Elements:**

```typescript
// Bulk selection mode
const [bulkSelectMode, setBulkSelectMode] = useState(false);
const [selectedResumes, setSelectedResumes] = useState<Set<string>>(new Set());

// Import/Export modal
const [showImportExportModal, setShowImportExportModal] = useState(false);
const [selectedResume, setSelectedResume] = useState<ResumeResponse | null>(null);
```

## User Workflows

### Export Single Resume

1. User clicks the menu button (⋮) on a resume card
2. Selects "Export" from dropdown
3. Modal opens with export options
4. User selects format (JSON/PDF/DOCX)
5. Clicks "Export" button
6. File downloads automatically

### Bulk Export

1. User clicks "Select" button in dashboard
2. Checkboxes appear on all resume cards
3. User selects multiple resumes
4. Clicks "Export Selected" in bulk actions bar
5. Modal opens (only JSON format available for bulk)
6. Clicks "Export All" button
7. Single JSON file with all resumes downloads

### Import Resume

1. User clicks "Import" button in dashboard
2. Modal opens on Import tab
3. User either:
   - Drags and drops a file onto the upload area
   - Clicks to browse and select a file
4. File is validated and processed
5. New resume is created
6. User is redirected or dashboard refreshes

### Duplicate Resume

1. User clicks menu button (⋮) on a resume card
2. Selects "Duplicate" from dropdown
3. Copy is created immediately
4. Dashboard refreshes to show the duplicate

## File Formats

### JSON Export Format

```json
{
  "version": "1.0.0",
  "exportedAt": "2024-01-15T10:30:00Z",
  "count": 1,
  "resumes": [
    {
      "id": "uuid",
      "title": "Software Engineer Resume",
      "content": {
        "personalInfo": { ... },
        "experience": [ ... ],
        "education": [ ... ],
        "skills": [ ... ]
      },
      "templateId": "modern",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### Bulk Export Format

```json
{
  "version": "1.0.0",
  "exportedAt": "2024-01-15T10:30:00Z",
  "count": 3,
  "resumes": [
    { /* resume 1 */ },
    { /* resume 2 */ },
    { /* resume 3 */ }
  ]
}
```

## Error Handling

The feature includes comprehensive error handling:

1. **File Validation**: Checks file type and format
2. **Parse Errors**: Catches JSON parsing errors
3. **Network Errors**: Handles API failures
4. **User Feedback**: Displays clear error messages

**Example Error Messages:**
- "Invalid JSON format"
- "Missing required fields (metadata or resume)"
- "Failed to parse JSON: Unexpected token"
- "Failed to export resume"
- "Failed to import resume"

## Backend Integration

### API Endpoints Used

```typescript
// Export
POST /api/resumes/:id/export
Body: { format: 'pdf' | 'docx' | 'json' }
Response: Blob (file download)

// Import
POST /api/resumes/import
Body: FormData with file
Response: { data: ResumeResponse }

// Duplicate
POST /api/resumes/:id/duplicate
Response: { data: ResumeResponse }
```

## Styling

The feature uses Tailwind CSS with the following design patterns:

- **Modal**: Centered overlay with backdrop
- **Format Cards**: Interactive cards with hover states
- **Drag-and-Drop**: Dashed border with hover effect
- **Bulk Selection**: Blue highlight for selected items
- **Loading States**: Spinner with descriptive text
- **Success/Error**: Colored banners with icons

## Accessibility

- Keyboard navigation support (Escape to close modal)
- ARIA labels for interactive elements
- Focus management
- Screen reader friendly
- Touch-friendly targets (44x44px minimum)

## Performance Considerations

1. **File Size**: Large files may take time to process
2. **Bulk Operations**: Limited to reasonable batch sizes
3. **Memory**: JSON parsing happens in memory
4. **Network**: File downloads use blob URLs for efficiency

## Future Enhancements

Potential improvements for future versions:

1. **Format Conversion**: Convert between different resume formats
2. **Template Preservation**: Maintain template styling in exports
3. **Batch Import**: Import multiple resumes at once
4. **Cloud Storage**: Integration with Google Drive, Dropbox
5. **Version Control**: Export with version history
6. **Scheduled Exports**: Automatic backup exports
7. **Export Presets**: Save export preferences
8. **Preview Before Import**: Show preview of imported data

## Testing

### Manual Testing Checklist

- [ ] Export single resume as JSON
- [ ] Export single resume as PDF
- [ ] Export single resume as DOCX
- [ ] Import resume from JSON
- [ ] Import resume from PDF
- [ ] Import resume from DOCX
- [ ] Bulk select multiple resumes
- [ ] Bulk export selected resumes
- [ ] Duplicate resume
- [ ] Drag and drop file upload
- [ ] Error handling for invalid files
- [ ] Cancel operations
- [ ] Loading states display correctly
- [ ] Success messages appear
- [ ] Modal closes properly

### Unit Tests

Key areas to test:

1. `useImportExport` hook
   - Export functions
   - Import functions
   - Error handling
   - State management

2. `ImportExportModal` component
   - Tab switching
   - Format selection
   - File upload
   - Modal open/close

3. Integration with Dashboard
   - Bulk selection
   - Menu actions
   - Modal triggers

## Troubleshooting

### Common Issues

**Issue**: Export fails with network error
**Solution**: Check backend API is running and accessible

**Issue**: Import fails with "Invalid JSON"
**Solution**: Verify file was exported from this application

**Issue**: PDF/DOCX export not working
**Solution**: Ensure backend has required dependencies installed

**Issue**: Bulk export only shows JSON option
**Solution**: This is expected - bulk export only supports JSON format

## Related Files

- `src/hooks/useImportExport.ts` - Import/export logic
- `src/components/UI/ImportExportModal.tsx` - Modal UI
- `src/pages/DashboardPage.tsx` - Integration point
- `src/services/resume.service.ts` - API calls
- `src/utils/jsonExporter.ts` - JSON utilities
- `src/types/api.types.ts` - Type definitions

## Support

For issues or questions:
1. Check error messages in the UI
2. Review browser console for detailed errors
3. Verify backend API is functioning
4. Check file format compatibility
