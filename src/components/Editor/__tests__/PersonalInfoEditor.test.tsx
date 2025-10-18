import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { PersonalInfoEditor } from "../PersonalInfoEditor";
import { ResumeProvider } from "../../../contexts/ResumeContext";

// Mock the UI components
jest.mock("../../UI", () => ({
  Input: ({
    label,
    value,
    onChange,
    error,
    required,
    placeholder,
    ...props
  }: any) => (
    <div>
      <label htmlFor={props.id || "input"}>
        {label}
        {required && <span>*</span>}
      </label>
      <input
        id={props.id || "input"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        {...props}
      />
      {error && <div data-testid="error">{error}</div>}
    </div>
  ),
  Button: ({ children, onClick, type, disabled, ...props }: any) => (
    <button onClick={onClick} type={type} disabled={disabled} {...props}>
      {children}
    </button>
  ),
}));

// Test wrapper component
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ResumeProvider>{children}</ResumeProvider>
);

describe("PersonalInfoEditor", () => {
  it("renders personal information form", () => {
    render(
      <TestWrapper>
        <PersonalInfoEditor />
      </TestWrapper>
    );

    expect(screen.getByText("Personal Information")).toBeInTheDocument();
    expect(screen.getByText("Basic Information")).toBeInTheDocument();
    expect(screen.getByText("Social Links")).toBeInTheDocument();
    expect(screen.getByText("Additional Links")).toBeInTheDocument();
  });

  it("renders required form fields", () => {
    render(
      <TestWrapper>
        <PersonalInfoEditor />
      </TestWrapper>
    );

    expect(screen.getByLabelText(/Full Name/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Professional Title/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone Number/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Location/)).toBeInTheDocument();
  });

  it("renders optional social link fields", () => {
    render(
      <TestWrapper>
        <PersonalInfoEditor />
      </TestWrapper>
    );

    expect(screen.getByLabelText(/LinkedIn URL/)).toBeInTheDocument();
    expect(screen.getByLabelText(/GitHub URL/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Portfolio URL/)).toBeInTheDocument();
  });

  it("shows validation errors for invalid email", async () => {
    render(
      <TestWrapper>
        <PersonalInfoEditor />
      </TestWrapper>
    );

    const emailInput = screen.getByLabelText(/Email Address/);
    fireEvent.change(emailInput, { target: { value: "invalid-email" } });

    await waitFor(() => {
      expect(
        screen.getByText("Please enter a valid email address")
      ).toBeInTheDocument();
    });
  });

  it("shows validation errors for invalid phone", async () => {
    render(
      <TestWrapper>
        <PersonalInfoEditor />
      </TestWrapper>
    );

    const phoneInput = screen.getByLabelText(/Phone Number/);
    fireEvent.change(phoneInput, { target: { value: "abc123" } });

    await waitFor(() => {
      expect(
        screen.getByText("Please enter a valid phone number")
      ).toBeInTheDocument();
    });
  });

  it("shows validation errors for invalid URLs", async () => {
    render(
      <TestWrapper>
        <PersonalInfoEditor />
      </TestWrapper>
    );

    const linkedinInput = screen.getByLabelText(/LinkedIn URL/);
    fireEvent.change(linkedinInput, { target: { value: "not-a-url" } });

    await waitFor(() => {
      expect(
        screen.getByText("Please enter a valid LinkedIn URL")
      ).toBeInTheDocument();
    });
  });

  it("allows adding custom links", () => {
    render(
      <TestWrapper>
        <PersonalInfoEditor />
      </TestWrapper>
    );

    const addButton = screen.getByText("Add Link");
    fireEvent.click(addButton);

    expect(screen.getByText("Link Label")).toBeInTheDocument();
    expect(screen.getByText("URL")).toBeInTheDocument();
  });

  it("allows removing custom links", () => {
    render(
      <TestWrapper>
        <PersonalInfoEditor />
      </TestWrapper>
    );

    const addButton = screen.getByText("Add Link");
    fireEvent.click(addButton);

    const removeButton = screen.getByRole("button", { name: "" });
    fireEvent.click(removeButton);

    expect(screen.queryByText("Link Label")).not.toBeInTheDocument();
  });

  it("collapses and expands section", () => {
    render(
      <TestWrapper>
        <PersonalInfoEditor />
      </TestWrapper>
    );

    const header = screen.getByText("Personal Information");
    fireEvent.click(header);

    // After clicking, the form should be hidden
    expect(screen.queryByText("Basic Information")).not.toBeInTheDocument();
  });

  it("shows required field indicators", () => {
    render(
      <TestWrapper>
        <PersonalInfoEditor />
      </TestWrapper>
    );

    const requiredFields = screen.getAllByText("*");
    expect(requiredFields).toHaveLength(5); // fullName, title, email, phone, location
  });
});
