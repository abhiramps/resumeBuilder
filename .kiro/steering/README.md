# Kiro Steering Rules - Frontend

## Overview

This directory contains Kiro steering rules that provide context and guidelines for AI-assisted development of the Resume Builder frontend.

## Steering Files

### 1. project-guidelines.md (Always Included)
**Purpose:** Core development guidelines and best practices

**Contains:**
- Project context and current status (Task 35 complete)
- Technology stack (React 18, TypeScript, Vite, Tailwind)
- Project structure and organization
- Coding standards (TypeScript, React, State Management)
- File naming conventions
- Component patterns
- Styling guidelines (Tailwind CSS)
- Performance optimization
- Error handling
- Testing guidelines
- API integration patterns
- Accessibility requirements
- Common pitfalls to avoid

**When to reference:** Always active - provides foundation for all development

---

### 2. ats-compliance.md (Always Included)
**Purpose:** ATS (Applicant Tracking System) compliance requirements

**Contains:**
- ATS-safe practices (simple HTML, standard headers, safe fonts)
- What to avoid (tables, graphics, complex layouts)
- ATS validation rules
- Real-time scoring
- PDF export requirements
- Warning system for users
- Testing checklist
- Automated testing examples

**When to reference:** Always active - ATS compliance is the core value proposition

---

## How Steering Rules Work

### Inclusion Types

**1. Always Included (`inclusion: always`)**
- Automatically included in every AI interaction
- Provides consistent context across all tasks
- Both current steering files use this

**2. Conditional Inclusion (`inclusion: fileMatch`)**
- Included when specific files are being worked on
- Example: Template-specific rules when editing template components

**3. Manual Inclusion (`inclusion: manual`)**
- Included only when explicitly referenced with `#` in chat
- Useful for specialized contexts

### File References

Steering files can reference other files:
```markdown
See the complete type definitions in #[[file:src/types/resume.types.ts]]
```

## Usage Guidelines

### For Developers

When working on the frontend:
1. These rules are automatically applied by Kiro
2. Follow the patterns and conventions outlined
3. **Always maintain ATS compliance** - this is non-negotiable
4. Reference specific sections when needed
5. Update rules as project evolves

### For AI Assistants

When helping with frontend development:
1. Always follow project-guidelines.md conventions
2. **Always verify ATS compliance** before suggesting code
3. Suggest code that matches established patterns
4. Point out ATS issues proactively
5. Maintain consistency with existing codebase
6. Never suggest features that break ATS compatibility

## Key Principles

### From project-guidelines.md

1. **ATS Compliance First** - Every feature must maintain ATS compatibility
2. **Type Safety** - TypeScript strict mode, no `any` types
3. **Component Architecture** - Functional components, custom hooks, composition

### From ats-compliance.md

1. **Simple, Parseable HTML** - No tables, no complex layouts
2. **Standard Section Headers** - Use recognized headers only
3. **ATS-Safe Fonts** - Arial, Helvetica, Times New Roman, Georgia, Calibri
4. **Text Must Be Selectable** - No images or canvas for text
5. **Simple Bullet Points** - Standard bullets only
6. **No Graphics in Content** - Icons and images break ATS parsing

## Critical: ATS Compliance

**Every feature must pass the ATS test:**
1. Can an ATS system parse this?
2. Will the text be selectable?
3. Are we using standard formats?
4. Is this simple enough for machine reading?

**When in doubt, choose simplicity over creativity.**

## Current Project Status

**Frontend Status:** Task 35 complete (nearly production-ready)
**Backend Status:** Task 0 (ready to start)

**Completed Features:**
- ✅ All 4 templates (Classic, Modern, Minimal, Abhiram)
- ✅ Resume CRUD operations
- ✅ Layout customization
- ✅ Auto-save functionality
- ✅ PDF export
- ✅ ATS validation
- ✅ Responsive design

**Next Steps:**
1. Integrate with backend API
2. Add user authentication
3. Implement cloud storage
4. Add subscription features

## Adding New Steering Rules

To add new steering rules:

1. Create new `.md` file in this directory
2. Add frontmatter with inclusion type:
```markdown
---
inclusion: always
---
```

3. Document specific guidelines or context
4. Reference from other files if needed

### Suggested Additional Rules

Consider adding:
- `template-guidelines.md` - Template-specific patterns (conditional on template files)
- `state-management.md` - Context API and reducer patterns
- `performance-guidelines.md` - Optimization techniques
- `accessibility-guidelines.md` - WCAG compliance details

## Testing ATS Compliance

### Manual Testing
- Upload PDF to Jobscan, Resume Worded, TopResume
- Verify text is selectable
- Check parsing accuracy
- Validate section recognition

### Automated Testing
```typescript
describe('ATS Compliance', () => {
  it('should use ATS-safe fonts', () => {
    // Test implementation
  });
  
  it('should not use tables for layout', () => {
    // Test implementation
  });
  
  it('should have selectable text', () => {
    // Test implementation
  });
});
```

## Resources

- [Project Documentation](../docs/)
- [Task List](../docs/task_list_optimized.md)
- [Initial Prompt](../docs/initial_prompt.md)
- [Jobscan ATS Guide](https://www.jobscan.co/blog/ats-resume/)
- [Resume Worded](https://resumeworded.com/ats-resume-guide)

## Questions?

When implementing features:
1. Check steering rules for patterns
2. **Verify ATS compliance first**
3. Follow established conventions
4. Write tests
5. Update documentation

**Remember:** ATS compliance is what makes this resume builder valuable. Never compromise on it. These rules ensure consistency, quality, and ATS compatibility across the entire frontend codebase.
