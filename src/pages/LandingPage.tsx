/**
 * Landing Page
 * Eye-catching and minimal landing page showcasing resume builder features
 */

import React from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  CheckCircle2,
  Palette,
  Download,
  Share2,
  History,
  Upload,
  Sparkles,
  ArrowRight,
  Zap,
  Shield,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export const LandingPage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: Shield,
      title: "ATS-Optimized",
      description:
        "Built specifically to pass Applicant Tracking Systems with 100% parseability",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      icon: Zap,
      title: "Real-Time Preview",
      description: "See your changes instantly with live preview as you edit",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: Palette,
      title: "Multiple Templates",
      description:
        "Choose from 4 professional templates designed for software engineers",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      icon: FileText,
      title: "Highly Customizable",
      description:
        "Control every detail: fonts, colors, margins, spacing, and more",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      icon: Download,
      title: "PDF Export",
      description: "Generate high-quality, print-ready PDFs with one click",
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      icon: History,
      title: "Version Control",
      description: "Track changes and revert to previous versions anytime",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
    {
      icon: Share2,
      title: "Easy Sharing",
      description: "Share your resume with recruiters via secure links",
      color: "text-teal-600",
      bgColor: "bg-teal-50",
    },
    {
      icon: Upload,
      title: "Import/Export",
      description: "Import existing resumes or export your data in JSON format",
      color: "text-pink-600",
      bgColor: "bg-pink-50",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation */}
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-gray-900">
              ResumeBuilder
            </span>
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-sm"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-50 rounded-full mb-8">
            <Sparkles className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-600">
              ATS-Friendly Resume Builder for Software Engineers
            </span>
          </div>

          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Build Resumes That{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Get You Hired
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Create professional, ATS-optimized resumes with our powerful editor.
            Real-time preview, multiple templates, and complete customization
            control.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={isAuthenticated ? "/dashboard" : "/signup"}
              className="group px-8 py-4 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl flex items-center space-x-2"
            >
              <span>Start Building</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            {!isAuthenticated && (
              <Link
                to="/login"
                className="px-8 py-4 bg-white text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all border-2 border-gray-200"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to help you create the perfect resume
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group p-6 rounded-xl bg-white border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300"
                >
                  <div
                    className={`inline-flex p-3 rounded-lg ${feature.bgColor} mb-4`}
                  >
                    <Icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center text-white">
            <h2 className="text-4xl font-bold mb-4">
              Ready to Build Your Perfect Resume?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of software engineers who trust our platform to
              create ATS-friendly resumes
            </p>
            <Link
              to={isAuthenticated ? "/dashboard" : "/signup"}
              className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl"
            >
              <span>Get Started Free</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <FileText className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold text-gray-900">
                ResumeBuilder
              </span>
            </div>
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} ResumeBuilder. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
