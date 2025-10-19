import React from "react";
import { useResume } from "../../contexts/ResumeContext";
import { Plus, Eye, EyeOff } from "lucide-react";
import { SummaryEditor, ExperienceEditor, ProjectsEditor, SkillsEditor, EducationEditor, CertificationsEditor } from "../Editor";

const Sidebar: React.FC = () => {
  const { resume, dispatch } = useResume();

  const handleSectionToggle = (sectionId: string) => {
    const section = (resume.sections || []).find((s) => s.id === sectionId);
    if (section) {
      dispatch({
        type: "UPDATE_SECTION",
        payload: {
          id: sectionId,
          updates: { enabled: !section.enabled },
        },
      });
    }
  };

  const handleAddSection = () => {
    // TODO: Implement add section functionality
    console.log("Adding new section...");
  };

  return (
    <div className="h-full flex flex-col">
      {/* Section Toggles */}
      <div className="p-6 border-b border-gray-200 bg-gray-50/50">
        <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
          <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
          Sections
        </h3>
        <div className="space-y-1">
          {(resume.sections || [])
            .sort((a, b) => a.order - b.order)
            .map((section) => (
              <div
                key={section.id}
                className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${section.enabled
                  ? "bg-white border border-green-200 shadow-sm"
                  : "bg-gray-50 border border-gray-200 hover:bg-white"
                  }`}
              >
                <span className={`text-sm font-medium ${section.enabled ? "text-gray-900" : "text-gray-500"
                  }`}>
                  {section.title}
                </span>
                <button
                  onClick={() => handleSectionToggle(section.id)}
                  className={`p-1.5 rounded-md transition-colors ${section.enabled
                    ? "text-green-600 hover:bg-green-50 bg-green-50/50"
                    : "text-gray-400 hover:bg-gray-100"
                    }`}
                >
                  {section.enabled ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                </button>
              </div>
            ))}
        </div>

        <button
          onClick={handleAddSection}
          className="w-full mt-4 flex items-center justify-center space-x-2 p-3 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-primary hover:text-primary hover:bg-primary-50/50 transition-all duration-200"
        >
          <Plus className="h-4 w-4" />
          <span>Add Section</span>
        </button>
      </div>

      {/* Section Editors */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
            <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
            Edit Sections
          </h3>

          {/* Personal Information Editor */}
          <div className="mb-8 bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
            <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
              <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></div>
              Personal Information
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={resume.personalInfo?.fullName || ""}
                  onChange={(e) =>
                    dispatch({
                      type: "UPDATE_PERSONAL_INFO",
                      payload: { fullName: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary transition-all duration-200"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Job Title
                </label>
                <input
                  type="text"
                  value={resume.personalInfo?.title || ""}
                  onChange={(e) =>
                    dispatch({
                      type: "UPDATE_PERSONAL_INFO",
                      payload: { title: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary transition-all duration-200"
                  placeholder="e.g., Senior Software Engineer"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={resume.personalInfo?.email || ""}
                  onChange={(e) =>
                    dispatch({
                      type: "UPDATE_PERSONAL_INFO",
                      payload: { email: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary transition-all duration-200"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={resume.personalInfo?.phone || ""}
                  onChange={(e) =>
                    dispatch({
                      type: "UPDATE_PERSONAL_INFO",
                      payload: { phone: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary transition-all duration-200"
                  placeholder="(555) 123-4567"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={resume.personalInfo?.location || ""}
                  onChange={(e) =>
                    dispatch({
                      type: "UPDATE_PERSONAL_INFO",
                      payload: { location: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary transition-all duration-200"
                  placeholder="City, State"
                />
              </div>
            </div>
          </div>

          {/* Summary Editor */}
          <div className="mb-8">
            <SummaryEditor />
          </div>

          {/* Experience Editor */}
          <div className="mb-8">
            <ExperienceEditor />
          </div>

          {/* Projects Editor */}
          <div className="mb-8">
            <ProjectsEditor />
          </div>

          {/* Skills Editor */}
          <div className="mb-8">
            <SkillsEditor />
          </div>

          {/* Education Editor */}
          <div className="mb-8">
            <EducationEditor />
          </div>

          {/* Certifications Editor */}
          <div className="mb-8">
            <CertificationsEditor />
          </div>

          {/* TODO: Add other section editors */}
          <div className="text-center py-8 text-gray-500 text-sm">
            More section editors coming soon...
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
