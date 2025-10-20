import React, { useState, useMemo } from 'react';
import { Search, TrendingUp, CheckCircle, AlertCircle, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';
import { useResumeContext } from '../../contexts/ResumeContext';
import {
    extractResumeText,
    analyzeResumeKeywords,
    compareWithJobDescription,
    getSuggestedKeywords,
    analyzeKeywordDensity,
    getIntegrationSuggestions,
    KEYWORD_DATABASE,
} from '../../utils/keywordAnalyzer';

interface KeywordOptimizerProps {
    className?: string;
}

export const KeywordOptimizer: React.FC<KeywordOptimizerProps> = ({ className = '' }) => {
    const { resume } = useResumeContext();
    const [isExpanded, setIsExpanded] = useState(false);
    const [jobDescription, setJobDescription] = useState('');
    const [selectedRole, setSelectedRole] = useState<keyof typeof KEYWORD_DATABASE>('fullstack');
    const [showJobDescInput, setShowJobDescInput] = useState(false);
    const [selectedKeyword, setSelectedKeyword] = useState<string | null>(null);

    const resumeText = useMemo(() => extractResumeText(resume), [resume]);
    const analysis = useMemo(() => analyzeResumeKeywords(resume), [resume]);

    const jobComparison = useMemo(() => {
        if (!jobDescription.trim()) return null;
        return compareWithJobDescription(resumeText, jobDescription);
    }, [resumeText, jobDescription]);

    const suggestedKeywords = useMemo(() => {
        return getSuggestedKeywords(selectedRole);
    }, [selectedRole]);

    const keywordStatus = useMemo(() => {
        return suggestedKeywords.map((keyword) => {
            const density = analyzeKeywordDensity(resumeText, keyword);
            return { keyword, ...density };
        });
    }, [suggestedKeywords, resumeText]);

    return (
        <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>
            {/* Header */}
            <div
                className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 border-b border-gray-200 cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <TrendingUp className="w-5 h-5 text-purple-600" />
                        <div>
                            <h3 className="font-semibold text-gray-900">Keyword Optimizer</h3>
                            <p className="text-sm text-gray-600">
                                {analysis.uniqueKeywords} unique keywords found
                            </p>
                        </div>
                    </div>
                    {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                </div>
            </div>

            {/* Expanded Content */}
            {isExpanded && (
                <div className="p-4 space-y-6">
                    {/* Role Selector */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Your Role
                        </label>
                        <select
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value as keyof typeof KEYWORD_DATABASE)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                            <option value="frontend">Frontend Developer</option>
                            <option value="backend">Backend Developer</option>
                            <option value="fullstack">Full Stack Developer</option>
                            <option value="devops">DevOps Engineer</option>
                            <option value="mobile">Mobile Developer</option>
                            <option value="data">Data Scientist/Engineer</option>
                            <option value="general">General Software Engineer</option>
                        </select>
                    </div>

                    {/* Job Description Comparison */}
                    <div>
                        <button
                            onClick={() => setShowJobDescInput(!showJobDescInput)}
                            className="flex items-center gap-2 text-sm font-medium text-purple-600 hover:text-purple-700"
                        >
                            <Search className="w-4 h-4" />
                            {showJobDescInput ? 'Hide' : 'Compare with Job Description'}
                        </button>

                        {showJobDescInput && (
                            <div className="mt-3 space-y-3">
                                <textarea
                                    value={jobDescription}
                                    onChange={(e) => setJobDescription(e.target.value)}
                                    placeholder="Paste the job description here to analyze keyword match..."
                                    rows={6}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                                />
                                {jobComparison && (
                                    <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium text-gray-700">Match Score</span>
                                            <span className={`text-2xl font-bold ${jobComparison.matchPercentage >= 70 ? 'text-green-600' :
                                                jobComparison.matchPercentage >= 50 ? 'text-yellow-600' : 'text-red-600'
                                                }`}>
                                                {jobComparison.matchPercentage}%
                                            </span>
                                        </div>
                                        {jobComparison.missingKeywords.length > 0 && (
                                            <div className="mt-3">
                                                <p className="text-sm font-medium text-gray-700 mb-2">
                                                    Missing Important Keywords:
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    {jobComparison.missingKeywords.slice(0, 10).map((keyword) => (
                                                        <span
                                                            key={keyword}
                                                            className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded cursor-pointer hover:bg-red-200"
                                                            onClick={() => setSelectedKeyword(keyword)}
                                                        >
                                                            {keyword}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Role Match Scores */}
                    <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Role Match Analysis</h4>
                        <div className="space-y-2">
                            {analysis.roleMatch.slice(0, 3).map(({ role, score }) => (
                                <div key={role} className="flex items-center gap-3">
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm text-gray-700 capitalize">{role}</span>
                                            <span className="text-sm font-medium text-gray-900">{score}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full ${score >= 70 ? 'bg-green-500' :
                                                    score >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                                                    }`}
                                                style={{ width: `${score}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Suggested Keywords */}
                    <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-3">
                            Suggested Keywords for {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}
                        </h4>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                            {keywordStatus.map(({ keyword, count, status }) => (
                                <div
                                    key={keyword}
                                    className={`flex items-center justify-between p-2 rounded-lg border cursor-pointer hover:bg-gray-50 ${status === 'good' ? 'border-green-200 bg-green-50' :
                                            status === 'high' ? 'border-yellow-200 bg-yellow-50' :
                                                'border-gray-200'
                                        }`}
                                    onClick={() => setSelectedKeyword(keyword)}
                                >
                                    <div className="flex items-center gap-2">
                                        {status === 'good' ? (
                                            <CheckCircle className="w-4 h-4 text-green-600" />
                                        ) : status === 'high' ? (
                                            <AlertCircle className="w-4 h-4 text-yellow-600" />
                                        ) : (
                                            <AlertCircle className="w-4 h-4 text-gray-400" />
                                        )}
                                        <span className="text-sm font-medium text-gray-900">{keyword}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-xs px-2 py-1 rounded ${status === 'good' ? 'bg-green-100 text-green-700' :
                                                status === 'high' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-gray-100 text-gray-600'
                                            }`}>
                                            {count === 0 ? 'Missing' : `${count}x`}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Top Keywords in Resume */}
                    <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Top Keywords in Your Resume</h4>
                        <div className="flex flex-wrap gap-2">
                            {analysis.topKeywords.slice(0, 15).map(({ keyword, count }) => (
                                <span
                                    key={keyword}
                                    className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                                >
                                    {keyword} ({count})
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Integration Suggestions */}
                    {selectedKeyword && (
                        <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                            <div className="flex items-start gap-3">
                                <Lightbulb className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                                        How to add "{selectedKeyword}"
                                    </h4>
                                    <ul className="space-y-2 text-sm text-gray-700">
                                        {getIntegrationSuggestions(selectedKeyword).map((suggestion, idx) => (
                                            <li key={idx} className="flex items-start gap-2">
                                                <span className="text-purple-600 mt-1">•</span>
                                                <span>{suggestion}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <button
                                        onClick={() => setSelectedKeyword(null)}
                                        className="mt-3 text-xs text-purple-600 hover:text-purple-700"
                                    >
                                        Close suggestions
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* General Suggestions */}
                    {analysis.suggestions.length > 0 && (
                        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <h4 className="text-sm font-medium text-blue-900 mb-2">Recommendations</h4>
                            <ul className="space-y-1 text-sm text-blue-800">
                                {analysis.suggestions.map((suggestion, idx) => (
                                    <li key={idx} className="flex items-start gap-2">
                                        <span className="text-blue-600">•</span>
                                        <span>{suggestion}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Stats Summary */}
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900">{analysis.totalKeywords}</div>
                            <div className="text-xs text-gray-600">Total Keywords</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900">{analysis.uniqueKeywords}</div>
                            <div className="text-xs text-gray-600">Unique Keywords</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900">
                                {keywordStatus.filter(k => k.status === 'good').length}
                            </div>
                            <div className="text-xs text-gray-600">Optimized</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
