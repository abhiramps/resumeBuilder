import { Resume } from '../types/resume.types';

/**
 * Keyword categories by job role
 */
export const KEYWORD_DATABASE = {
  frontend: {
    languages: ['JavaScript', 'TypeScript', 'HTML', 'CSS', 'HTML5', 'CSS3'],
    frameworks: ['React', 'Vue', 'Angular', 'Next.js', 'Nuxt.js', 'Svelte', 'Redux', 'MobX', 'Vuex'],
    tools: ['Webpack', 'Vite', 'Babel', 'ESLint', 'Prettier', 'npm', 'yarn', 'pnpm'],
    skills: ['Responsive Design', 'UI/UX', 'Accessibility', 'Performance Optimization', 'SEO', 'Cross-browser Compatibility'],
  },
  backend: {
    languages: ['Node.js', 'Python', 'Java', 'Go', 'Ruby', 'PHP', 'C#', '.NET'],
    frameworks: ['Express.js', 'Django', 'Flask', 'Spring Boot', 'Ruby on Rails', 'Laravel', 'FastAPI'],
    databases: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch', 'DynamoDB'],
    skills: ['REST API', 'GraphQL', 'Microservices', 'Authentication', 'Authorization', 'API Design'],
  },
  fullstack: {
    languages: ['JavaScript', 'TypeScript', 'Python', 'Java', 'Node.js'],
    frameworks: ['React', 'Next.js', 'Express.js', 'Django', 'Spring Boot'],
    databases: ['PostgreSQL', 'MongoDB', 'MySQL', 'Redis'],
    skills: ['Full Stack Development', 'REST API', 'GraphQL', 'Microservices', 'CI/CD', 'Agile'],
  },
  devops: {
    tools: ['Docker', 'Kubernetes', 'Jenkins', 'GitLab CI', 'GitHub Actions', 'Terraform', 'Ansible'],
    cloud: ['AWS', 'Azure', 'GCP', 'Cloud Architecture', 'Serverless'],
    skills: ['CI/CD', 'Infrastructure as Code', 'Monitoring', 'Logging', 'Container Orchestration', 'DevOps'],
    practices: ['Automation', 'Continuous Integration', 'Continuous Deployment', 'Site Reliability'],
  },
  mobile: {
    languages: ['Swift', 'Kotlin', 'Java', 'Dart', 'JavaScript'],
    frameworks: ['React Native', 'Flutter', 'SwiftUI', 'Jetpack Compose', 'Ionic'],
    skills: ['iOS Development', 'Android Development', 'Mobile UI/UX', 'App Store Optimization'],
  },
  data: {
    languages: ['Python', 'R', 'SQL', 'Scala', 'Julia'],
    tools: ['Pandas', 'NumPy', 'Scikit-learn', 'TensorFlow', 'PyTorch', 'Jupyter', 'Tableau', 'Power BI'],
    skills: ['Data Analysis', 'Machine Learning', 'Deep Learning', 'Data Visualization', 'Statistical Analysis'],
    databases: ['PostgreSQL', 'MySQL', 'MongoDB', 'Snowflake', 'BigQuery'],
  },
  general: {
    soft_skills: ['Problem Solving', 'Team Collaboration', 'Communication', 'Leadership', 'Agile', 'Scrum'],
    practices: ['Git', 'Version Control', 'Code Review', 'Testing', 'Debugging', 'Documentation'],
    methodologies: ['Agile', 'Scrum', 'Kanban', 'TDD', 'BDD', 'CI/CD'],
  },
};

/**
 * Experience level keywords
 */
export const EXPERIENCE_KEYWORDS = {
  junior: ['Junior', 'Entry Level', 'Associate', 'Graduate', 'Intern'],
  mid: ['Mid-level', 'Intermediate', 'Software Engineer', 'Developer'],
  senior: ['Senior', 'Lead', 'Principal', 'Staff', 'Architect', 'Expert'],
  management: ['Manager', 'Director', 'VP', 'Head of', 'Chief', 'Team Lead'],
};

/**
 * Extract text content from resume
 */
export const extractResumeText = (resume: Resume): string => {
  const parts: string[] = [];

  // Personal info
  parts.push(resume.personalInfo.fullName);
  parts.push(resume.personalInfo.title);

  // Sections
  resume.sections.forEach((section) => {
    if (!section.enabled) return;

    parts.push(section.title);

    switch (section.type) {
      case 'summary':
        parts.push((section.content as any).summary || '');
        break;
      case 'experience':
        (section.content as any).experiences?.forEach((exp: any) => {
          parts.push(exp.jobTitle, exp.company, exp.description);
          parts.push(...(exp.achievements || []));
        });
        break;
      case 'projects':
        (section.content as any).projects?.forEach((proj: any) => {
          parts.push(proj.name, proj.description);
          parts.push(...(proj.techStack || []));
        });
        break;
      case 'skills':
        (section.content as any).skills?.forEach((skill: any) => {
          parts.push(skill.name);
        });
        break;
      case 'education':
        (section.content as any).education?.forEach((edu: any) => {
          parts.push(edu.degree, edu.institution);
          parts.push(...(edu.coursework || []));
        });
        break;
      case 'certifications':
        (section.content as any).certifications?.forEach((cert: any) => {
          parts.push(cert.name, cert.issuer);
        });
        break;
      case 'custom':
        parts.push((section.content as any).custom?.content || '');
        break;
    }
  });

  return parts.join(' ');
};

/**
 * Extract keywords from text
 */
export const extractKeywords = (text: string): Map<string, number> => {
  const keywords = new Map<string, number>();
  const words = text.toLowerCase().match(/\b[\w+#.-]+\b/g) || [];

  // Count occurrences
  words.forEach((word) => {
    if (word.length > 2) {
      keywords.set(word, (keywords.get(word) || 0) + 1);
    }
  });

  // Also check for multi-word phrases
  const phrases = [
    'machine learning',
    'deep learning',
    'data science',
    'full stack',
    'front end',
    'back end',
    'software engineer',
    'web development',
    'mobile development',
    'cloud computing',
    'rest api',
    'graphql',
    'ci/cd',
    'version control',
  ];

  const lowerText = text.toLowerCase();
  phrases.forEach((phrase) => {
    const count = (lowerText.match(new RegExp(phrase, 'g')) || []).length;
    if (count > 0) {
      keywords.set(phrase, count);
    }
  });

  return keywords;
};

/**
 * Analyze keyword density
 */
export const analyzeKeywordDensity = (
  resumeText: string,
  keyword: string
): { count: number; density: number; status: 'low' | 'good' | 'high' } => {
  const totalWords = resumeText.split(/\s+/).length;
  const keywordRegex = new RegExp(`\\b${keyword}\\b`, 'gi');
  const count = (resumeText.match(keywordRegex) || []).length;
  const density = (count / totalWords) * 100;

  let status: 'low' | 'good' | 'high' = 'good';
  if (count === 0) status = 'low';
  else if (density > 3) status = 'high'; // More than 3% is keyword stuffing
  else if (density < 0.5) status = 'low';

  return { count, density, status };
};

/**
 * Get suggested keywords for a role
 */
export const getSuggestedKeywords = (role: keyof typeof KEYWORD_DATABASE): string[] => {
  const roleKeywords = KEYWORD_DATABASE[role];
  if (!roleKeywords) return [];

  const allKeywords: string[] = [];
  Object.values(roleKeywords).forEach((category) => {
    allKeywords.push(...category);
  });

  return allKeywords;
};

/**
 * Compare resume against job description
 */
export interface KeywordMatch {
  keyword: string;
  inResume: boolean;
  count: number;
  category?: string;
  importance: 'high' | 'medium' | 'low';
}

export const compareWithJobDescription = (
  resumeText: string,
  jobDescription: string
): {
  matches: KeywordMatch[];
  matchPercentage: number;
  missingKeywords: string[];
} => {
  const resumeKeywords = extractKeywords(resumeText);
  const jobKeywords = extractKeywords(jobDescription);

  const matches: KeywordMatch[] = [];
  const missingKeywords: string[] = [];

  // Technical keywords that are important
  const importantKeywords = new Set([
    ...Object.values(KEYWORD_DATABASE).flatMap((role) =>
      Object.values(role).flat()
    ),
  ]);

  jobKeywords.forEach((jobCount, keyword) => {
    const inResume = resumeKeywords.has(keyword);
    const count = resumeKeywords.get(keyword) || 0;
    
    // Determine importance
    let importance: 'high' | 'medium' | 'low' = 'low';
    if (importantKeywords.has(keyword) || jobCount >= 3) {
      importance = 'high';
    } else if (jobCount >= 2) {
      importance = 'medium';
    }

    matches.push({
      keyword,
      inResume,
      count,
      importance,
    });

    if (!inResume && importance !== 'low') {
      missingKeywords.push(keyword);
    }
  });

  // Calculate match percentage (weighted by importance)
  const totalImportant = matches.filter((m) => m.importance === 'high').length;
  const matchedImportant = matches.filter(
    (m) => m.importance === 'high' && m.inResume
  ).length;

  const matchPercentage =
    totalImportant > 0 ? (matchedImportant / totalImportant) * 100 : 0;

  return {
    matches: matches.sort((a, b) => {
      if (a.importance !== b.importance) {
        const order = { high: 0, medium: 1, low: 2 };
        return order[a.importance] - order[b.importance];
      }
      return b.count - a.count;
    }),
    matchPercentage: Math.round(matchPercentage),
    missingKeywords: missingKeywords.slice(0, 20), // Top 20 missing
  };
};

/**
 * Get keyword integration suggestions
 */
export const getIntegrationSuggestions = (keyword: string): string[] => {
  const suggestions: string[] = [];

  suggestions.push(
    `Add "${keyword}" to your skills section if you have experience with it`
  );
  suggestions.push(
    `Mention "${keyword}" in a project description where you used it`
  );
  suggestions.push(
    `Include "${keyword}" in your professional summary if it's a core skill`
  );
  suggestions.push(
    `Add a bullet point in your experience section highlighting your work with "${keyword}"`
  );

  return suggestions;
};

/**
 * Analyze resume keywords
 */
export interface KeywordAnalysis {
  totalKeywords: number;
  uniqueKeywords: number;
  topKeywords: Array<{ keyword: string; count: number }>;
  roleMatch: { role: string; score: number }[];
  suggestions: string[];
}

export const analyzeResumeKeywords = (resume: Resume): KeywordAnalysis => {
  const resumeText = extractResumeText(resume);
  const keywords = extractKeywords(resumeText);

  // Get top keywords
  const topKeywords = Array.from(keywords.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([keyword, count]) => ({ keyword, count }));

  // Calculate role match scores
  const roleMatch: { role: string; score: number }[] = [];
  Object.keys(KEYWORD_DATABASE).forEach((role) => {
    const roleKeywords = getSuggestedKeywords(role as keyof typeof KEYWORD_DATABASE);
    const matchCount = roleKeywords.filter((kw) =>
      resumeText.toLowerCase().includes(kw.toLowerCase())
    ).length;
    const score = (matchCount / roleKeywords.length) * 100;
    roleMatch.push({ role, score: Math.round(score) });
  });

  roleMatch.sort((a, b) => b.score - a.score);

  // Generate suggestions
  const suggestions: string[] = [];
  if (keywords.size < 30) {
    suggestions.push('Add more technical skills and tools to increase keyword coverage');
  }
  if (roleMatch[0]?.score < 50) {
    suggestions.push(`Consider adding more ${roleMatch[0]?.role} specific keywords`);
  }

  return {
    totalKeywords: Array.from(keywords.values()).reduce((a, b) => a + b, 0),
    uniqueKeywords: keywords.size,
    topKeywords,
    roleMatch,
    suggestions,
  };
};
