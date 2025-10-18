import React, { useState, useEffect } from "react";
import { Input, Button } from "../UI";
import { useResumeContext } from "../../contexts/ResumeContext";
import { PersonalInfo } from "../../types/resume.types";

/**
 * Custom link interface for additional URLs
 */
interface CustomLink {
  id: string;
  label: string;
  url: string;
}

/**
 * Personal Info Editor Component Props
 */
export interface PersonalInfoEditorProps {
  className?: string;
}

/**
 * Validation error interface
 */
interface ValidationErrors {
  fullName?: string;
  title?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  customLinks?: { [key: string]: string };
}

/**
 * Personal Information Editor Component
 *
 * Provides a comprehensive form for editing personal information with:
 * - Real-time validation
 * - Custom links management
 * - Context integration
 * - Collapsible sections
 * - Error handling
 */
export const PersonalInfoEditor: React.FC<PersonalInfoEditorProps> = ({
  className = "",
}) => {
  const { resume, dispatch } = useResumeContext();
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>(
    resume.personalInfo
  );
  const [customLinks, setCustomLinks] = useState<CustomLink[]>([]);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Update local state when context changes
  useEffect(() => {
    setPersonalInfo(resume.personalInfo);
  }, [resume.personalInfo]);

  /**
   * Email validation regex
   */
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  /**
   * Phone validation regex (supports various formats)
   */
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;

  /**
   * URL validation regex
   */
  const urlRegex =
    /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;

  /**
   * Validate email format
   */
  const validateEmail = (email: string): string | undefined => {
    if (!email.trim()) {
      return "Email is required";
    }
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    return undefined;
  };

  /**
   * Validate phone format
   */
  const validatePhone = (phone: string): string | undefined => {
    if (!phone.trim()) {
      return "Phone number is required";
    }
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, "");
    if (!phoneRegex.test(cleanPhone)) {
      return "Please enter a valid phone number";
    }
    return undefined;
  };

  /**
   * Validate URL format
   */
  const validateUrl = (url: string, fieldName: string): string | undefined => {
    if (!url.trim()) {
      return undefined; // URLs are optional
    }
    if (!urlRegex.test(url)) {
      return `Please enter a valid ${fieldName} URL`;
    }
    return undefined;
  };

  /**
   * Validate all fields
   */
  const validateForm = (): ValidationErrors => {
    const newErrors: ValidationErrors = {};

    // Required fields
    if (!personalInfo.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!personalInfo.title.trim()) {
      newErrors.title = "Professional title is required";
    }

    if (!personalInfo.location.trim()) {
      newErrors.location = "Location is required";
    }

    // Email validation
    const emailError = validateEmail(personalInfo.email);
    if (emailError) {
      newErrors.email = emailError;
    }

    // Phone validation
    const phoneError = validatePhone(personalInfo.phone);
    if (phoneError) {
      newErrors.phone = phoneError;
    }

    // URL validations
    const linkedinError = validateUrl(personalInfo.linkedin || "", "LinkedIn");
    if (linkedinError) {
      newErrors.linkedin = linkedinError;
    }

    const githubError = validateUrl(personalInfo.github || "", "GitHub");
    if (githubError) {
      newErrors.github = githubError;
    }

    const portfolioError = validateUrl(
      personalInfo.portfolio || "",
      "Portfolio"
    );
    if (portfolioError) {
      newErrors.portfolio = portfolioError;
    }

    // Custom links validation
    const customLinkErrors: { [key: string]: string } = {};
    customLinks.forEach((link) => {
      const urlError = validateUrl(link.url, link.label);
      if (urlError) {
        customLinkErrors[link.id] = urlError;
      }
    });
    if (Object.keys(customLinkErrors).length > 0) {
      newErrors.customLinks = customLinkErrors;
    }

    return newErrors;
  };

  /**
   * Handle input change with real-time validation
   */
  const handleInputChange = (field: keyof PersonalInfo, value: string) => {
    const updatedInfo = { ...personalInfo, [field]: value };
    setPersonalInfo(updatedInfo);

    // Real-time validation for specific fields
    let fieldError: string | undefined;
    switch (field) {
      case "email":
        fieldError = validateEmail(value);
        break;
      case "phone":
        fieldError = validatePhone(value);
        break;
      case "linkedin":
        fieldError = validateUrl(value, "LinkedIn");
        break;
      case "github":
        fieldError = validateUrl(value, "GitHub");
        break;
      case "portfolio":
        fieldError = validateUrl(value, "Portfolio");
        break;
      default:
        fieldError = undefined;
    }

    // Update errors
    setErrors((prev) => ({
      ...prev,
      [field]: fieldError,
    }));

    // Update context
    dispatch({
      type: "UPDATE_PERSONAL_INFO",
      payload: { [field]: value },
    });
  };

  /**
   * Add custom link
   */
  const addCustomLink = () => {
    const newLink: CustomLink = {
      id: Math.random().toString(36).substr(2, 9),
      label: "",
      url: "",
    };
    setCustomLinks([...customLinks, newLink]);
  };

  /**
   * Remove custom link
   */
  const removeCustomLink = (id: string) => {
    setCustomLinks(customLinks.filter((link) => link.id !== id));
    // Clear any errors for this link
    setErrors((prev) => {
      const newErrors = { ...prev };
      if (newErrors.customLinks) {
        delete newErrors.customLinks[id];
      }
      return newErrors;
    });
  };

  /**
   * Update custom link
   */
  const updateCustomLink = (
    id: string,
    field: keyof CustomLink,
    value: string
  ) => {
    setCustomLinks(
      customLinks.map((link) =>
        link.id === id ? { ...link, [field]: value } : link
      )
    );

    // Validate URL if it's the url field
    if (field === "url") {
      const link = customLinks.find((l) => l.id === id);
      const label = link?.label || "Custom link";
      const urlError = validateUrl(value, label);

      setErrors((prev) => ({
        ...prev,
        customLinks: {
          ...prev.customLinks,
          [id]: urlError,
        },
      }));
    }
  };

  /**
   * Handle form submission
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length === 0) {
      // Form is valid, update context
      dispatch({
        type: "UPDATE_PERSONAL_INFO",
        payload: personalInfo,
      });
    } else {
      setErrors(validationErrors);
    }
  };

  /**
   * Collapse/expand icon
   */
  const CollapseIcon = () => (
    <svg
      className={`w-5 h-5 transition-transform duration-200 ${
        isCollapsed ? "rotate-180" : ""
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

  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      {/* Header */}
      <div
        className="flex items-center justify-between p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg
              className="w-5 h-5 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Personal Information
            </h3>
            <p className="text-sm text-gray-500">
              Your contact details and professional identity
            </p>
          </div>
        </div>
        <CollapseIcon />
      </div>

      {/* Form Content */}
      {!isCollapsed && (
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h4 className="text-md font-medium text-gray-900 border-b border-gray-100 pb-2">
              Basic Information
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={personalInfo.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                error={errors.fullName}
                required
                placeholder="John Doe"
              />

              <Input
                label="Professional Title"
                value={personalInfo.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                error={errors.title}
                required
                placeholder="Software Engineer"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Email Address"
                type="email"
                value={personalInfo.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                error={errors.email}
                required
                placeholder="john.doe@email.com"
              />

              <Input
                label="Phone Number"
                type="tel"
                value={personalInfo.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                error={errors.phone}
                required
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <Input
              label="Location"
              value={personalInfo.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              error={errors.location}
              required
              placeholder="San Francisco, CA"
            />
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h4 className="text-md font-medium text-gray-900 border-b border-gray-100 pb-2">
              Social Links
            </h4>

            <div className="space-y-4">
              <Input
                label="LinkedIn URL"
                type="url"
                value={personalInfo.linkedin || ""}
                onChange={(e) => handleInputChange("linkedin", e.target.value)}
                error={errors.linkedin}
                placeholder="https://linkedin.com/in/johndoe"
                helperText="Optional - Your LinkedIn profile"
              />

              <Input
                label="GitHub URL"
                type="url"
                value={personalInfo.github || ""}
                onChange={(e) => handleInputChange("github", e.target.value)}
                error={errors.github}
                placeholder="https://github.com/johndoe"
                helperText="Optional - Your GitHub profile"
              />

              <Input
                label="Portfolio URL"
                type="url"
                value={personalInfo.portfolio || ""}
                onChange={(e) => handleInputChange("portfolio", e.target.value)}
                error={errors.portfolio}
                placeholder="https://johndoe.dev"
                helperText="Optional - Your personal website or portfolio"
              />
            </div>
          </div>

          {/* Custom Links */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-md font-medium text-gray-900 border-b border-gray-100 pb-2">
                Additional Links
              </h4>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={addCustomLink}
                leftIcon={
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                }
              >
                Add Link
              </Button>
            </div>

            {customLinks.map((link) => (
              <div
                key={link.id}
                className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1 space-y-3">
                  <Input
                    label="Link Label"
                    value={link.label}
                    onChange={(e) =>
                      updateCustomLink(link.id, "label", e.target.value)
                    }
                    placeholder="e.g., Blog, Twitter, Medium"
                  />
                  <Input
                    label="URL"
                    type="url"
                    value={link.url}
                    onChange={(e) =>
                      updateCustomLink(link.id, "url", e.target.value)
                    }
                    error={errors.customLinks?.[link.id]}
                    placeholder="https://example.com"
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeCustomLink(link.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </Button>
              </div>
            ))}

            {customLinks.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">
                No additional links added yet. Click "Add Link" to include more
                URLs.
              </p>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end pt-4 border-t border-gray-200">
            <Button
              type="submit"
              variant="primary"
              disabled={Object.keys(errors).length > 0}
            >
              Save Changes
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default PersonalInfoEditor;
