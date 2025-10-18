import React, { useState, useCallback } from "react";
import { Textarea, Button } from "../UI";
import { useResumeContext } from "../../contexts/ResumeContext";

/**
 * Summary Editor Component Props
 */
export interface SummaryEditorProps {
  className?: string;
}

/**
 * ATS Keywords by category for suggestions
 */
const ATS_KEYWORDS = {
  technical: [
    "software development",
    "full-stack",
    "agile",
    "cloud computing",
    "microservices",
    "API development",
    "database design",
    "DevOps",
    "CI/CD",
    "testing",
    "debugging",
    "optimization",
    "scalable",
    "architecture",
  ],
  leadership: [
    "team leadership",
    "project management",
    "mentoring",
    "cross-functional",
    "stakeholder management",
    "strategic planning",
    "process improvement",
    "collaboration",
  ],
  achievements: [
    "increased efficiency",
    "reduced costs",
    "improved performance",
    "delivered projects",
    "exceeded targets",
    "streamlined processes",
    "enhanced user experience",
  ],
};

/**
 * Sample summaries for inspiration
 */
const SAMPLE_SUMMARIES = [
  "Experienced software engineer with 5+ years developing scalable web applications using React, Node.js, and cloud technologies. Proven track record of leading cross-functional teams and delivering high-quality solutions that improve user experience and business outcomes.",

  "Full-stack developer specializing in modern JavaScript frameworks and cloud-native architectures. Strong background in agile methodologies, API development, and database optimization. Passionate about mentoring junior developers and implementing best practices.",

  "Results-driven software engineer with expertise in microservices architecture and DevOps practices. Successfully delivered 15+ projects on time and under budget while maintaining 99.9% system uptime. Experienced in leading technical initiatives and process improvements.",
];

/**
 * Tips for writing effective summaries
 */
const SUMMARY_TIPS = [
  "Keep it concise: 3-5 sentences, 150-300 characters",
  "Start with your years of experience and main expertise",
  "Include 2-3 key technical skills or technologies",
  "Mention leadership or collaboration experience",
  "End with what you're passionate about or seeking",
  "Use action words and quantifiable achievements",
  "Avoid first-person pronouns (I, me, my)",
  "Include industry-specific keywords for ATS",
];

/**
 * Professional Summary Editor Component
 *
 * Provides a comprehensive editor for the professional summary section with:
 * - Large textarea with auto-resize
 * - Character and word count tracking
 * - ATS keyword suggestions
 * - Real-time validation
 * - Sample summaries
 * - Writing tips
 * - Collapsible interface
 */
export const SummaryEditor: React.FC<SummaryEditorProps> = ({
  className = "",
}) => {
  const { resume, dispatch } = useResumeContext();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [showSamples, setShowSamples] = useState(false);
  const [showKeywords, setShowKeywords] = useState(false);

  // Find the summary section
  const summarySection = resume.sections.find(
    (section) => section.type === "summary"
  );

  const currentSummary = summarySection?.content
    ? (summarySection.content as { summary: string }).summary
    : "";

  // Character and word counts
  const charCount = currentSummary.length;
  const wordCount = currentSummary.trim() ? currentSummary.trim().split(/\s+/).length : 0;

  // Validation states
  const isOptimalLength = charCount >= 150 && charCount <= 300;
  const hasSpecialChars = /[^\w\s.,;:!?()-]/.test(currentSummary);
  const isValidFormat = !hasSpecialChars;

  /**
   * Debounced update function
   */
  const debouncedUpdate = useCallback(
    (() => {
      let timeoutId: ReturnType<typeof setTimeout>;
      return (value: string) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          if (summarySection) {
            dispatch({
              type: "UPDATE_SECTION",
              payload: {
                id: summarySection.id,
                updates: {
                  content: { summary: value },
                },
              },
            });
          }
        }, 300);
      };
    })(),
    [dispatch, summarySection]
  );

  /**
   * Handle summary text change
   */
  const handleSummaryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    debouncedUpdate(value);
  };

  /**
   * Insert sample summary
   */
  const insertSample = (sample: string) => {
    if (summarySection) {
      dispatch({
        type: "UPDATE_SECTION",
        payload: {
          id: summarySection.id,
          updates: {
            content: { summary: sample },
          },
        },
      });
    }
    setShowSamples(false);
  };

  /**
   * Insert keyword at cursor position
   */
  const insertKeyword = (keyword: string) => {
    const textarea = document.querySelector('textarea[data-summary-editor]') as HTMLTextAreaElement;
    if (textarea && summarySection) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const currentText = currentSummary;
      const newText = currentText.substring(0, start) + keyword + currentText.substring(end);

      dispatch({
        type: "UPDATE_SECTION",
        payload: {
          id: summarySection.id,
          updates: {
            content: { summary: newText },
          },
        },
      });

      // Restore cursor position
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + keyword.length, start + keyword.length);
      }, 0);
    }
  };

  /**
   * Get character count color based on length
   */
  const getCharCountColor = () => {
    if (charCount < 150) return "text-orange-600";
    if (charCount > 300) return "text-red-600";
    return "text-green-600";
  };

  /**
   * Collapse/expand icon
   */
  const CollapseIcon = () => (
    <svg
      className={`w-5 h-5 transition-transform duration-200 ${isCollapsed ? "rotate-180" : ""
        }`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 9l-7 7-7-7"
      />
    </svg>
  );

  // Don't render if no summary section exists
  if (!summarySection) {
    return null;
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      {/* Header */}
      <div
        className="flex items-center justify-between p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
            <svg
              className="w-5 h-5 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Professional Summary
            </h3>
            <p className="text-sm text-gray-500">
              A compelling overview of your experience and skills
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {/* Character count indicator */}
          <span className={`text-xs font-medium ${getCharCountColor()}`}>
            {charCount}/300
          </span>
          <CollapseIcon />
        </div>
      </div>

      {/* Editor Content */}
      {!isCollapsed && (
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Editor */}
            <div className="lg:col-span-2 space-y-4">
              <Textarea
                data-summary-editor
                label="Professional Summary"
                value={currentSummary}
                onChange={handleSummaryChange}
                placeholder="Write a compelling 3-5 sentence summary highlighting your experience, key skills, and career objectives..."
                autoResize
                maxLength={500}
                showCharCount={false}
                rows={6}
                className="text-base leading-relaxed"
                helperText={
                  !isValidFormat
                    ? "Avoid special characters for ATS compatibility"
                    : isOptimalLength
                      ? "Perfect length for ATS scanning"
                      : charCount < 150
                        ? "Consider adding more detail (150-300 characters recommended)"
                        : "Consider shortening for better readability"
                }
                error={!isValidFormat ? "Contains special characters that may not be ATS-friendly" : undefined}
              />

              {/* Stats */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-4">
                  <span className="text-gray-600">
                    Words: <span className="font-medium">{wordCount}</span>
                  </span>
                  <span className="text-gray-600">
                    Characters: <span className={`font-medium ${getCharCountColor()}`}>{charCount}</span>
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  {isOptimalLength && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      ✓ Optimal Length
                    </span>
                  )}
                  {isValidFormat && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      ✓ ATS-Friendly
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSamples(!showSamples)}
                  leftIcon={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  }
                >
                  Sample Summaries
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowKeywords(!showKeywords)}
                  leftIcon={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  }
                >
                  ATS Keywords
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowTips(!showTips)}
                  leftIcon={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
                >
                  Writing Tips
                </Button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Writing Tips */}
              {showTips && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-blue-900 mb-3 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Writing Tips
                  </h4>
                  <ul className="space-y-2 text-xs text-blue-800">
                    {SUMMARY_TIPS.map((tip, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* ATS Keywords */}
              {showKeywords && (
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-green-900 mb-3 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    ATS Keywords
                  </h4>
                  <div className="space-y-3">
                    {Object.entries(ATS_KEYWORDS).map(([category, keywords]) => (
                      <div key={category}>
                        <h5 className="text-xs font-medium text-green-800 mb-1 capitalize">
                          {category}
                        </h5>
                        <div className="flex flex-wrap gap-1">
                          {keywords.slice(0, 6).map((keyword) => (
                            <button
                              key={keyword}
                              onClick={() => insertKeyword(keyword)}
                              className="inline-flex items-center px-2 py-1 rounded text-xs bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
                            >
                              {keyword}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sample Summaries */}
              {showSamples && (
                <div className="bg-purple-50 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-purple-900 mb-3 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Sample Summaries
                  </h4>
                  <div className="space-y-3">
                    {SAMPLE_SUMMARIES.map((sample, index) => (
                      <div key={index} className="bg-white rounded p-3 border border-purple-200">
                        <p className="text-xs text-gray-700 mb-2 leading-relaxed">
                          {sample}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => insertSample(sample)}
                          className="text-purple-600 hover:text-purple-700 hover:bg-purple-100"
                        >
                          Use This Sample
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SummaryEditor;