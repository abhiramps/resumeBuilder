import React from "react";
import { useResume } from "../../contexts/ResumeContext";
import { Plus, Eye, EyeOff } from "lucide-react";
import { SummaryEditor, ExperienceEditor, ProjectsEditor, SkillsEditor } from "../Editor";

const Sidebar: React.FC = () => {
  const { resume, dispatch } = useResume();

  const handleSectionToggle = (sectionId: string) => {
    const section = resume.sections.find((s) => s.id === sectionId);
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
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Sections</h3>
        <div className="space-y-2">
          {resume.sections
            .sort((a, b) => a.order - b.order)
            .map((section) => (
              <div
                key={section.id}
                className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50"
              >
                <span className="text-sm text-gray-700">{section.title}</span>
                <button
                  onClick={() => handleSectionToggle(section.id)}
                  className={`p-1 rounded ${section.enabled
                    ? "text-green-600 hover:bg-green-50"
                    : "text-gray-400 hover:bg-gray-50"
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
          className="w-full mt-3 flex items-center justify-center space-x-2 p-2 border-2 border-dashed border-gray-300 rounded-md text-sm text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Section</span>
        </button>
      </div>

      {/* Section Editors */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            Edit Sections
          </h3>

          {/* Personal Information Editor */}
          <div className="mb-6">
            <h4 className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-3">
              Personal Information
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={resume.personalInfo.fullName}
                  onChange={(e) =>
                    dispatch({
                      type: "UPDATE_PERSONAL_INFO",
                      payload: { fullName: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Job Title
                </label>
                <input
                  type="text"
                  value={resume.personalInfo.title}
                  onChange={(e) =>
                    dispatch({
                      type: "UPDATE_PERSONAL_INFO",
                      payload: { title: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g., Senior Software Engineer"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={resume.personalInfo.email}
                  onChange={(e) =>
                    dispatch({
                      type: "UPDATE_PERSONAL_INFO",
                      payload: { email: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={resume.personalInfo.phone}
                  onChange={(e) =>
                    dispatch({
                      type: "UPDATE_PERSONAL_INFO",
                      payload: { phone: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="(555) 123-4567"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={resume.personalInfo.location}
                  onChange={(e) =>
                    dispatch({
                      type: "UPDATE_PERSONAL_INFO",
                      payload: { location: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="City, State"
                />
              </div>
            </div>
          </div>

          {/* Summary Editor */}
          <div className="mb-6">
            <SummaryEditor />
          </div>

          {/* Experience Editor */}
          <div className="mb-6">
            <ExperienceEditor />
          </div>

          {/* Projects Editor */}
          <div className="mb-6">
            <ProjectsEditor />
          </div>

          {/* Skills Editor */}
          <div className="mb-6">
            <SkillsEditor />
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
