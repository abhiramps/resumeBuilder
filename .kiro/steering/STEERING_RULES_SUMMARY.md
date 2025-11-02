# Kiro Steering Rules - Frontend Summary

## Overview

Kiro steering rules have been created to ensure consistent, high-quality, ATS-compliant code throughout the Resume Builder frontend development.

## Created Steering Rules

### 1. project-guidelines.md (Always Active)

**Purpose:** Core development guidelines and best practices

**Key Topics:**
- Project context (Task 35 complete, nearly production-ready)
- Technology stack (React 18, TypeScript 5.5, Vite, Tailwind)
- Coding standards (TypeScript strict mode, functional components)
- Component patterns and architecture
- State management (Context API + useReducer)
- Styling guidelines (Tailwind CSS)
- Performance optimization (memoization, lazy loading)
- Error handling patterns
- Testing guidelines
- API integration
- Accessibility (ARIA, keyboard navigation)
- Common pitfalls to avoid

**Always enforces:**
- Type safety (no `any` types)
- Functional components only
- Proper hook usage
- Immutable state updates
- Consistent file naming
- Component documentation

### 2. ats-compliance.md (Always Active)

**Purpose:** ATS (Applicant Tracking System) compliance requirements

**Key Topics:**
- ATS-safe HTML practices
- Standard section headers
- ATS-safe fonts (Arial, Helvetica, Times New Roman, Georgia, Calibri)
- Text selectability requirements
- Simple bullet points
- No graphics in content
- PDF export requirements
- Real-time ATS scoring
- Validation rules
- Warning system
- Testing checklist

**Always enforces:**
- Simple, parseable HTML (no tables for layout)
- Standard section headers only
- ATS-safe fonts only
- Selectable text (no images/canvas)
- Simple bullet points
- No icons in resume content
- Real-time ATS validation

### 3. README.md

**Purpose:** Documentation and usage guide

**Contains:**
- Overview of steering rules
- How inclusion works
- Usage guidelines
- Key principles
- Current project status
- Adding new rules
- Resources

## How They Work

### Automatic Context

Both steering files use `inclusion: always`:
```markdown
---
inclusion: always
---
```

This means Kiro automatically includes them in every interaction, providing consistent context without manual effort.

### Real-Time Guidance

When you ask Kiro to:
- Create a component → Follows project-guidelines.md patterns
- Add a resume section → Ensures ATS compliance from ats-compliance.md
- Style an element → Uses Tailwind conventions
- Handle state → Uses Context API patterns
- Export PDF → Maintains text selectability

## Critical: ATS Compliance

**Every feature must pass the ATS test:**

1. ✅ Can an ATS system parse this?
2. ✅ Will the text be selectable?
3. ✅ Are we using standard formats?
4. ✅ Is this simple enough for machine reading?

**When in doubt, choose simplicity over creativity.**

### ATS Compliance Checklist

- [ ] No tables for layout
- [ ] Standard section headers
- [ ] ATS-safe fonts only
- [ ] Text is selectable (not images)
- [ ] Simple bullet points
- [ ] No graphics in content
- [ ] Standard date formats
- [ ] Contact info is parseable

## Key Principles

### From project-guidelines.md

1. **ATS Compliance First** - Non-negotiable requirement
2. **Type Safety** - TypeScript strict mode, explicit types
3. **Component Architecture** - Functional components, custom hooks
4. **Performance** - Memoization, lazy loading, optimization
5. **Accessibility** - ARIA labels, keyboard navigation

### From ats-compliance.md

1. **Simple HTML** - Parseable by ATS systems
2. **Standard Headers** - Recognized by all ATS
3. **Safe Fonts** - Machine-readable fonts only
4. **Selectable Text** - No images or canvas for text
5. **Simple Bullets** - Standard bullet points only
6. **No Graphics** - Icons break ATS parsing

## Usage Examples

### Creating a Component

**Kiro will suggest:**
```typescript
// ✅ Follows project-guidelines.md
interface PersonalInfoEditorProps {
  value: PersonalInfo;
  onChange: (value: PersonalInfo) => void;
  disabled?: boolean;
}

export const PersonalInfoEditor: React.FC<PersonalInfoEditorProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  const handleChange = (field: keyof PersonalInfo) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    onChange({ ...value, [field]: e.target.value });
  };

  return (
    <div className="space-y-4">
      <input
        type="text"
        value={value.fullName}
        onChange={handleChange('fullName')}
        disabled={disabled}
        className="w-full px-4 py-2 border rounded-md"
        aria-label="Full Name"
      />
    </div>
  );
};
```

### Creating Resume Section

**Kiro will suggest:**
```typescript
// ✅ Follows ats-compliance.md
const ExperienceSection: React.FC<ExperienceSectionProps> = ({ items }) => {
  return (
    <div className="resume-section">
      {/* ✅ Standard header */}
      <h2 className="text-xl font-semibold mb-4">Work Experience</h2>
      
      {items.map((item) => (
        <div key={item.id} className="mb-4">
          {/* ✅ Simple, parseable HTML */}
          <h3 className="font-semibold">{item.title}</h3>
          <p className="text-gray-600">{item.company}</p>
          <p className="text-sm text-gray-500">{item.dates}</p>
          
          {/* ✅ Simple bullet points */}
          <ul className="list-disc ml-5 mt-2">
            {item.responsibilities.map((resp, idx) => (
              <li key={idx}>{resp}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};
```

## What Kiro Will Prevent

### ❌ ATS-Breaking Code

```typescript
// ❌ Kiro will warn: Tables break ATS parsing
<table>
  <tr>
    <td>Work Experience</td>
  </tr>
</table>

// ❌ Kiro will warn: Icons in content break ATS
<div className="flex items-center gap-2">
  <MailIcon />
  <span>john@example.com</span>
</div>

// ❌ Kiro will warn: Unsafe font
<div style={{ fontFamily: 'Comic Sans' }}>
  Software Engineer
</div>
```

### ❌ Type Safety Issues

```typescript
// ❌ Kiro will warn: Implicit any
const handleChange = (data) => {
  // data is any
};

// ❌ Kiro will warn: Untyped props
const Button = ({ onClick, children }) => {
  return <button onClick={onClick}>{children}</button>;
};
```

## Benefits

### Code Quality
- ✅ Consistent patterns across codebase
- ✅ Type-safe code
- ✅ Proper error handling
- ✅ Performance optimized
- ✅ Accessible components

### ATS Compliance
- ✅ Every feature maintains compatibility
- ✅ Real-time validation
- ✅ User warnings for issues
- ✅ Automatic compliance checking

### Developer Experience
- ✅ Faster development
- ✅ Less context switching
- ✅ Automatic best practices
- ✅ Easier code reviews
- ✅ Reduced bugs

## Current Project Status

**Frontend:** Task 35 complete (nearly production-ready)

**Completed:**
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

## Testing Steering Rules

### Manual Testing
```bash
# Ask Kiro to create a component
# Verify it follows project-guidelines.md

# Ask Kiro to add a resume section
# Verify it maintains ATS compliance
```

### Automated Testing
```typescript
describe('Steering Rules Compliance', () => {
  it('should use ATS-safe fonts', () => {
    const { container } = render(<ResumePreview />);
    const style = window.getComputedStyle(container.firstChild);
    expect(ATS_SAFE_FONTS.some(font => 
      style.fontFamily.includes(font)
    )).toBe(true);
  });
  
  it('should not use tables for layout', () => {
    const { container } = render(<ResumePreview />);
    expect(container.querySelectorAll('table').length).toBe(0);
  });
});
```

## Updating Steering Rules

As the project evolves:

1. Edit `.kiro/steering/*.md` files
2. Add new patterns and conventions
3. Document lessons learned
4. Update best practices
5. Commit changes to git

Kiro will automatically use updated rules.

## Resources

- [Project Guidelines](.kiro/steering/project-guidelines.md)
- [ATS Compliance](.kiro/steering/ats-compliance.md)
- [Task List](../docs/task_list_optimized.md)
- [Initial Prompt](../docs/initial_prompt.md)
- [Jobscan ATS Guide](https://www.jobscan.co/blog/ats-resume/)

## Summary

Kiro steering rules provide:

✅ **Automatic Context** - No need to repeat guidelines
✅ **Consistent Quality** - Every component follows standards
✅ **ATS Compliance** - Automatic validation and enforcement
✅ **Type Safety** - TypeScript best practices
✅ **Performance** - Optimization patterns
✅ **Accessibility** - WCAG compliance
✅ **Security** - Input validation, error handling
✅ **Maintainability** - Clear patterns and conventions

**Result:** High-quality, ATS-compliant code that follows best practices automatically.

---

**Ready to develop with confidence!** 🚀

The steering rules ensure that every component, every feature, and every line of code maintains ATS compliance while following React and TypeScript best practices.

**Remember:** ATS compliance is what makes this resume builder valuable. The steering rules ensure we never compromise on it.
