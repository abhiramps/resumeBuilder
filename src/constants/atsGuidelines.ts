/**
 * ATS (Applicant Tracking System) Guidelines and Validation Rules
 * Contains all constants and rules for maintaining ATS compliance
 */

// ATS-safe fonts that are widely supported and parseable
export const ATS_SAFE_FONTS = [
  "Arial",
  "Helvetica",
  "Times New Roman",
  "Georgia",
  "Calibri",
  "Verdana",
  "Tahoma",
  "Trebuchet MS",
  "Courier New",
  "Lucida Sans",
] as const;

// Standard section headers that ATS systems recognize
export const SECTION_HEADERS = {
  SUMMARY: [
    "Professional Summary",
    "Summary",
    "Professional Profile",
    "Career Summary",
    "Objective",
  ],
  EXPERIENCE: [
    "Work Experience",
    "Professional Experience",
    "Employment History",
    "Experience",
    "Career History",
  ],
  EDUCATION: [
    "Education",
    "Academic Background",
    "Educational Background",
    "Academic Qualifications",
  ],
  SKILLS: [
    "Technical Skills",
    "Skills",
    "Core Competencies",
    "Technical Expertise",
    "Key Skills",
  ],
  PROJECTS: [
    "Projects",
    "Key Projects",
    "Notable Projects",
    "Project Experience",
  ],
  CERTIFICATIONS: [
    "Certifications",
    "Professional Certifications",
    "Licenses & Certifications",
    "Credentials",
  ],
} as const;

// ATS validation rules and scoring criteria
export const ATS_RULES = {
  // Font and formatting rules
  FONT: {
    REQUIRED_FONTS: ATS_SAFE_FONTS,
    MAX_FONT_SIZE: 14,
    MIN_FONT_SIZE: 9,
    RECOMMENDED_SIZE: 11,
    PENALTY_SCORE: 10,
  },

  // Layout and structure rules
  LAYOUT: {
    MAX_MARGINS: 1.0, // inches
    MIN_MARGINS: 0.5,
    MAX_COLUMNS: 2,
    RECOMMENDED_COLUMNS: 1,
    PENALTY_SCORE: 15,
  },

  // Content structure rules
  CONTENT: {
    MAX_SECTIONS: 8,
    MIN_SECTIONS: 3,
    REQUIRED_SECTIONS: ["summary", "experience", "education"],
    RECOMMENDED_SECTIONS: ["summary", "experience", "education", "skills"],
    PENALTY_SCORE: 20,
  },

  // Text formatting rules
  FORMATTING: {
    ALLOWED_FORMATTING: ["bold", "italic"],
    FORBIDDEN_FORMATTING: ["underline", "strikethrough", "highlight"],
    MAX_BOLD_PERCENTAGE: 20, // % of total text
    PENALTY_SCORE: 5,
  },

  // File format rules
  FILE_FORMAT: {
    RECOMMENDED_FORMATS: [".pdf", ".doc", ".docx"],
    FORBIDDEN_FORMATS: [".txt", ".rtf", ".html"],
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    PENALTY_SCORE: 25,
  },

  // Keyword optimization rules
  KEYWORDS: {
    MIN_KEYWORDS: 10,
    MAX_KEYWORDS: 50,
    RECOMMENDED_KEYWORDS: 25,
    PENALTY_SCORE: 8,
  },

  // Contact information rules
  CONTACT: {
    REQUIRED_FIELDS: ["fullName", "email", "phone"],
    OPTIONAL_FIELDS: ["location", "linkedin", "github"],
    FORBIDDEN_FIELDS: ["age", "birthDate", "maritalStatus", "photo"],
    PENALTY_SCORE: 30,
  },
} as const;

// Default layout settings optimized for ATS compliance
export const DEFAULT_LAYOUT_SETTINGS = {
  pageMargins: {
    top: 1.0,
    right: 1.0,
    bottom: 1.0,
    left: 1.0,
  },
  sectionSpacing: 16,
  lineHeight: 1.4,
  fontSize: {
    name: 22,
    title: 12,
    sectionHeader: 12,
    body: 11,
  },
  fontFamily: "Arial",
  colors: {
    primary: "#2c3e50",
    secondary: "#555555",
    text: "#333333",
  },
} as const;

// ATS scoring weights for different aspects
export const ATS_SCORING_WEIGHTS = {
  FONT_COMPLIANCE: 0.15,
  LAYOUT_COMPLIANCE: 0.2,
  CONTENT_STRUCTURE: 0.25,
  FORMATTING_COMPLIANCE: 0.1,
  KEYWORD_OPTIMIZATION: 0.2,
  CONTACT_COMPLETENESS: 0.1,
} as const;

// Common ATS keywords for software engineering roles
export const SOFTWARE_ENGINEERING_KEYWORDS = [
  // Programming Languages
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "C++",
  "C#",
  "Go",
  "Rust",
  "PHP",
  "Ruby",
  "Swift",
  "Kotlin",
  "Scala",
  "R",
  "MATLAB",

  // Frameworks & Libraries
  "React",
  "Angular",
  "Vue.js",
  "Node.js",
  "Express.js",
  "Django",
  "Flask",
  "Spring Boot",
  "Laravel",
  "Symfony",
  "ASP.NET",
  "Ruby on Rails",

  // Databases
  "PostgreSQL",
  "MySQL",
  "MongoDB",
  "Redis",
  "Elasticsearch",
  "SQLite",
  "Oracle",
  "SQL Server",
  "Cassandra",
  "DynamoDB",

  // Cloud & DevOps
  "AWS",
  "Azure",
  "Google Cloud",
  "Docker",
  "Kubernetes",
  "Jenkins",
  "GitLab CI",
  "GitHub Actions",
  "Terraform",
  "Ansible",

  // Tools & Technologies
  "Git",
  "Linux",
  "REST API",
  "GraphQL",
  "Microservices",
  "Agile",
  "Scrum",
  "CI/CD",
  "TDD",
  "Unit Testing",
  "Integration Testing",
] as const;

// ATS validation error messages
export const ATS_ERROR_MESSAGES = {
  INVALID_FONT:
    "Font not ATS-compatible. Use Arial, Helvetica, or Times New Roman.",
  COMPLEX_LAYOUT:
    "Complex layouts may not parse correctly. Use single-column format.",
  MISSING_SECTIONS:
    "Required sections missing: Professional Summary, Work Experience, Education.",
  EXCESSIVE_FORMATTING: "Excessive formatting may interfere with ATS parsing.",
  INCOMPLETE_CONTACT:
    "Missing required contact information: name, email, or phone.",
  FILE_TOO_LARGE: "File size exceeds 5MB limit for ATS systems.",
  LOW_KEYWORD_DENSITY:
    "Consider adding more relevant keywords for better ATS matching.",
} as const;

// ATS optimization suggestions
export const ATS_SUGGESTIONS = {
  IMPROVE_KEYWORDS: [
    "Add more industry-specific keywords",
    "Include technologies mentioned in job descriptions",
    "Use standard terminology for your field",
    "Include both technical and soft skills",
  ],

  OPTIMIZE_FORMATTING: [
    "Use standard section headers",
    "Keep formatting simple and clean",
    "Use bullet points for achievements",
    "Maintain consistent formatting throughout",
  ],

  ENHANCE_STRUCTURE: [
    "Place most relevant experience first",
    "Use reverse chronological order",
    "Include quantifiable achievements",
    "Keep descriptions concise but impactful",
  ],

  IMPROVE_COMPATIBILITY: [
    "Save as PDF for best ATS compatibility",
    "Use standard fonts and sizes",
    "Avoid images, tables, and complex layouts",
    "Test with online ATS checkers",
  ],
} as const;

// ATS compliance checklist
export const ATS_CHECKLIST = [
  "✓ Uses ATS-safe fonts (Arial, Helvetica, Times New Roman)",
  "✓ Single-column layout with standard margins",
  "✓ Standard section headers",
  "✓ Includes required contact information",
  "✓ Uses simple formatting (bold, italic only)",
  "✓ Contains relevant keywords",
  "✓ Proper file format (.pdf recommended)",
  "✓ Appropriate file size (< 5MB)",
  "✓ No images, tables, or complex graphics",
  "✓ Consistent formatting throughout",
] as const;

// Export utility functions
export const getATSCompliantFonts = (): readonly string[] => ATS_SAFE_FONTS;
export const getStandardHeaders = (
  section: keyof typeof SECTION_HEADERS
): readonly string[] => SECTION_HEADERS[section];
export const getSoftwareKeywords = (): readonly string[] =>
  SOFTWARE_ENGINEERING_KEYWORDS;
export const getATSComplianceScore = (violations: number): number =>
  Math.max(0, 100 - violations * 5);
