/**
 * Test file for Layout Components
 * Tests that all layout components render correctly and handle responsive behavior
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import { EditorLayout, MobileEditorLayout } from "../EditorLayout";
import Header from "../Header";
import Footer from "../Footer";

// Mock the ResumeContext to avoid provider issues
jest.mock("../../../contexts/ResumeContext", () => ({
  ResumeProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  useResume: () => ({
    resume: {
      template: "classic",
      personalInfo: { fullName: "Test User" },
      sections: [],
      layout: {},
    },
    dispatch: jest.fn(),
    atsValidation: {
      score: 85,
      issues: [],
      lastValidated: new Date().toISOString(),
    },
    isLoading: false,
    error: null,
  }),
}));

// Mock UI components
jest.mock("../../UI", () => ({
  Select: ({ options, value, onChange }: any) => (
    <select
      data-testid="template-select"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((option: any) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  ),
  Button: ({ children, onClick, ...props }: any) => (
    <button data-testid="button" onClick={onClick} {...props}>
      {children}
    </button>
  ),
}));

// Mock other layout components
jest.mock("../Sidebar", () => () => <div data-testid="sidebar">Sidebar</div>);
jest.mock("../Preview", () => () => <div data-testid="preview">Preview</div>);
jest.mock("../LayoutControls", () => () => (
  <div data-testid="layout-controls">Layout Controls</div>
));

describe("EditorLayout", () => {
  it("should render the three-panel layout", () => {
    render(<EditorLayout />);

    // Check that all main components are rendered
    expect(screen.getByTestId("sidebar")).toBeInTheDocument();
    expect(screen.getByTestId("preview")).toBeInTheDocument();
    expect(screen.getByTestId("layout-controls")).toBeInTheDocument();
  });

  it("should render header and footer", () => {
    render(<EditorLayout />);

    // Check for header elements
    expect(screen.getByText("ATS Resume Builder")).toBeInTheDocument();
    expect(screen.getByTestId("template-select")).toBeInTheDocument();

    // Check for footer elements
    expect(screen.getByText("ATS Score:")).toBeInTheDocument();
    expect(screen.getByText("85/100")).toBeInTheDocument();
  });

  it("should have proper responsive classes", () => {
    const { container } = render(<EditorLayout />);

    // Check for responsive classes
    const leftSidebar = container.querySelector(".w-\\[300px\\]");
    const rightSidebar = container.querySelector(".w-\\[250px\\]");

    expect(leftSidebar).toBeInTheDocument();
    expect(rightSidebar).toBeInTheDocument();
  });
});

describe("MobileEditorLayout", () => {
  it("should render mobile layout with toggle buttons", () => {
    render(<MobileEditorLayout />);

    // Check for mobile navigation buttons
    expect(screen.getByText("Sections")).toBeInTheDocument();
    expect(screen.getByText("Layout")).toBeInTheDocument();
  });

  it("should show preview in center", () => {
    render(<MobileEditorLayout />);

    expect(screen.getByTestId("preview")).toBeInTheDocument();
  });
});

describe("Header Component", () => {
  it("should render logo and title", () => {
    render(<Header />);

    expect(screen.getByText("ATS Resume Builder")).toBeInTheDocument();
  });

  it("should render template selector", () => {
    render(<Header />);

    const templateSelect = screen.getByTestId("template-select");
    expect(templateSelect).toBeInTheDocument();
    expect(templateSelect).toHaveValue("classic");
  });

  it("should render action buttons", () => {
    render(<Header />);

    expect(screen.getByText("Save")).toBeInTheDocument();
    expect(screen.getByText("Export PDF")).toBeInTheDocument();
  });

  it("should have sticky positioning", () => {
    const { container } = render(<Header />);

    const header = container.querySelector("header");
    expect(header).toHaveClass("sticky", "top-0", "z-30");
  });
});

describe("Footer Component", () => {
  it("should render ATS score", () => {
    render(<Footer />);

    expect(screen.getByText("ATS Score:")).toBeInTheDocument();
    expect(screen.getByText("85/100")).toBeInTheDocument();
  });

  it("should render help button", () => {
    render(<Footer />);

    expect(screen.getByText("Help")).toBeInTheDocument();
  });

  it("should have sticky positioning", () => {
    const { container } = render(<Footer />);

    const footer = container.querySelector("footer");
    expect(footer).toHaveClass("sticky", "bottom-0", "z-20");
  });
});

// Test responsive behavior
describe("Responsive Layout", () => {
  it("should hide sidebars on mobile", () => {
    const { container } = render(<EditorLayout />);

    // Check for hidden classes on mobile
    const leftSidebar = container.querySelector(".hidden.lg\\:block");
    const rightSidebar = container.querySelector(".hidden.lg\\:block");

    expect(leftSidebar).toBeInTheDocument();
    expect(rightSidebar).toBeInTheDocument();
  });

  it("should show mobile navigation on small screens", () => {
    const { container } = render(<EditorLayout />);

    // Check for mobile-only elements
    const mobileNav = container.querySelector(".lg\\:hidden");
    expect(mobileNav).toBeInTheDocument();
  });
});

// Test layout structure
describe("Layout Structure", () => {
  it("should have proper flex layout", () => {
    const { container } = render(<EditorLayout />);

    const mainContainer = container.querySelector(
      ".flex-1.flex.overflow-hidden"
    );
    expect(mainContainer).toBeInTheDocument();
  });

  it("should have proper spacing and borders", () => {
    const { container } = render(<EditorLayout />);

    // Check for border classes
    const leftSidebar = container.querySelector(".border-r.border-gray-200");
    const rightSidebar = container.querySelector(".border-l.border-gray-200");

    expect(leftSidebar).toBeInTheDocument();
    expect(rightSidebar).toBeInTheDocument();
  });

  it("should have scrollable sidebars", () => {
    const { container } = render(<EditorLayout />);

    // Check for overflow classes
    const scrollableElements = container.querySelectorAll(".overflow-y-auto");
    expect(scrollableElements.length).toBeGreaterThan(0);
  });
});
