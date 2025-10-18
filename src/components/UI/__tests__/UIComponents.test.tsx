/**
 * Test file for UI Components Library
 * Tests that all components render and handle events correctly
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Input,
  Textarea,
  Button,
  Select,
  RangeSlider,
  ColorPicker,
} from "../index";

// Mock console.error to suppress React warnings in tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("Warning: ReactDOM.render is no longer supported")
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

describe("Input Component", () => {
  it("should render with label and value", () => {
    render(<Input label="Test Input" value="test value" />);

    expect(screen.getByLabelText("Test Input")).toBeInTheDocument();
    expect(screen.getByDisplayValue("test value")).toBeInTheDocument();
  });

  it("should handle onChange events", async () => {
    const handleChange = jest.fn();
    render(<Input label="Test Input" onChange={handleChange} />);

    const input = screen.getByLabelText("Test Input");
    await userEvent.type(input, "hello");

    expect(handleChange).toHaveBeenCalledTimes(5);
  });

  it("should display error message", () => {
    render(<Input label="Test Input" error="This field is required" />);

    expect(screen.getByText("This field is required")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("should show required indicator", () => {
    render(<Input label="Test Input" required />);

    expect(screen.getByText("*")).toBeInTheDocument();
  });
});

describe("Textarea Component", () => {
  it("should render with label and value", () => {
    render(<Textarea label="Test Textarea" value="test content" />);

    expect(screen.getByLabelText("Test Textarea")).toBeInTheDocument();
    expect(screen.getByDisplayValue("test content")).toBeInTheDocument();
  });

  it("should handle onChange events", async () => {
    const handleChange = jest.fn();
    render(<Textarea label="Test Textarea" onChange={handleChange} />);

    const textarea = screen.getByLabelText("Test Textarea");
    await userEvent.type(textarea, "hello world");

    expect(handleChange).toHaveBeenCalledTimes(11);
  });

  it("should show character count when enabled", () => {
    render(
      <Textarea
        label="Test Textarea"
        value="test"
        maxLength={100}
        showCharCount
      />
    );

    expect(screen.getByText("4/100")).toBeInTheDocument();
  });

  it("should display error message", () => {
    render(<Textarea label="Test Textarea" error="This field is required" />);

    expect(screen.getByText("This field is required")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });
});

describe("Button Component", () => {
  it("should render with text content", () => {
    render(<Button>Click me</Button>);

    expect(
      screen.getByRole("button", { name: "Click me" })
    ).toBeInTheDocument();
  });

  it("should handle click events", async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    const button = screen.getByRole("button", { name: "Click me" });
    await userEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("should show loading state", () => {
    render(<Button loading>Loading...</Button>);

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-disabled", "true");
  });

  it("should render different variants", () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-primary");

    rerender(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-gray-100");

    rerender(<Button variant="ghost">Ghost</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-transparent");

    rerender(<Button variant="danger">Danger</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-red-600");
  });

  it("should render different sizes", () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    expect(screen.getByRole("button")).toHaveClass("px-3", "py-1.5", "text-sm");

    rerender(<Button size="md">Medium</Button>);
    expect(screen.getByRole("button")).toHaveClass("px-4", "py-2", "text-sm");

    rerender(<Button size="lg">Large</Button>);
    expect(screen.getByRole("button")).toHaveClass("px-6", "py-3", "text-base");
  });
});

describe("Select Component", () => {
  const options = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
  ];

  it("should render with label and options", () => {
    render(<Select label="Test Select" options={options} />);

    expect(screen.getByLabelText("Test Select")).toBeInTheDocument();
    expect(screen.getByText("Select an option...")).toBeInTheDocument();
  });

  it("should open dropdown on click", async () => {
    render(<Select label="Test Select" options={options} />);

    const button = screen.getByLabelText("Test Select");
    await userEvent.click(button);

    expect(screen.getByText("Option 1")).toBeInTheDocument();
    expect(screen.getByText("Option 2")).toBeInTheDocument();
    expect(screen.getByText("Option 3")).toBeInTheDocument();
  });

  it("should handle option selection", async () => {
    const handleChange = jest.fn();
    render(
      <Select label="Test Select" options={options} onChange={handleChange} />
    );

    const button = screen.getByLabelText("Test Select");
    await userEvent.click(button);

    const option1 = screen.getByText("Option 1");
    await userEvent.click(option1);

    expect(handleChange).toHaveBeenCalledWith("option1");
  });

  it("should support keyboard navigation", async () => {
    const handleChange = jest.fn();
    render(
      <Select label="Test Select" options={options} onChange={handleChange} />
    );

    const button = screen.getByLabelText("Test Select");
    await userEvent.click(button);

    // Press ArrowDown to focus first option
    await userEvent.keyboard("{ArrowDown}");

    // Press Enter to select
    await userEvent.keyboard("{Enter}");

    expect(handleChange).toHaveBeenCalledWith("option1");
  });

  it("should display error message", () => {
    render(
      <Select
        label="Test Select"
        options={options}
        error="This field is required"
      />
    );

    expect(screen.getByText("This field is required")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });
});

describe("RangeSlider Component", () => {
  it("should render with label and value", () => {
    render(<RangeSlider label="Test Slider" value={50} min={0} max={100} />);

    expect(screen.getByLabelText("Test Slider")).toBeInTheDocument();
    expect(screen.getByDisplayValue("50")).toBeInTheDocument();
  });

  it("should display current value with unit", () => {
    render(
      <RangeSlider
        label="Test Slider"
        value={50}
        min={0}
        max={100}
        unit="px"
        showValue
      />
    );

    expect(screen.getByText("50px")).toBeInTheDocument();
  });

  it("should handle value changes", async () => {
    const handleChange = jest.fn();
    render(
      <RangeSlider
        label="Test Slider"
        value={50}
        min={0}
        max={100}
        onChange={handleChange}
      />
    );

    const slider = screen.getByLabelText("Test Slider");
    fireEvent.change(slider, { target: { value: "75" } });

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it("should display min and max values", () => {
    render(
      <RangeSlider label="Test Slider" value={50} min={0} max={100} unit="px" />
    );

    expect(screen.getByText("0px")).toBeInTheDocument();
    expect(screen.getByText("100px")).toBeInTheDocument();
  });

  it("should display error message", () => {
    render(
      <RangeSlider
        label="Test Slider"
        value={50}
        min={0}
        max={100}
        error="Invalid value"
      />
    );

    expect(screen.getByText("Invalid value")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });
});

describe("ColorPicker Component", () => {
  it("should render with label and color value", () => {
    render(<ColorPicker label="Test Color" value="#ff0000" />);

    expect(screen.getByLabelText("Test Color")).toBeInTheDocument();
    expect(
      screen.getByLabelText("Selected color: #ff0000")
    ).toBeInTheDocument();
  });

  it("should open color picker on click", async () => {
    render(<ColorPicker label="Test Color" value="#ff0000" />);

    const button = screen.getByLabelText("Selected color: #ff0000");
    await userEvent.click(button);

    expect(screen.getByText("Choose Color")).toBeInTheDocument();
    expect(screen.getByText("Preset Colors")).toBeInTheDocument();
  });

  it("should handle color changes", async () => {
    const handleChange = jest.fn();
    render(
      <ColorPicker label="Test Color" value="#ff0000" onChange={handleChange} />
    );

    const button = screen.getByLabelText("Selected color: #ff0000");
    await userEvent.click(button);

    const colorInput = screen.getByDisplayValue("#ff0000");
    fireEvent.change(colorInput, { target: { value: "#00ff00" } });

    expect(handleChange).toHaveBeenCalledWith("#00ff00");
  });

  it("should handle hex input changes", async () => {
    const handleChange = jest.fn();
    render(
      <ColorPicker
        label="Test Color"
        value="#ff0000"
        onChange={handleChange}
        showHexInput
      />
    );

    const hexInput = screen.getByDisplayValue("#ff0000");
    await userEvent.clear(hexInput);
    await userEvent.type(hexInput, "#00ff00");

    expect(handleChange).toHaveBeenCalledWith("#00ff00");
  });

  it("should display error message", () => {
    render(
      <ColorPicker label="Test Color" value="#ff0000" error="Invalid color" />
    );

    expect(screen.getByText("Invalid color")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });
});

// Integration test for all components
describe("UI Components Integration", () => {
  it("should render all components together", () => {
    render(
      <div>
        <Input label="Name" value="John Doe" />
        <Textarea label="Description" value="Test description" />
        <Button>Submit</Button>
        <Select label="Category" options={[{ value: "test", label: "Test" }]} />
        <RangeSlider label="Size" value={50} min={0} max={100} />
        <ColorPicker label="Color" value="#ff0000" />
      </div>
    );

    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Description")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
    expect(screen.getByLabelText("Category")).toBeInTheDocument();
    expect(screen.getByLabelText("Size")).toBeInTheDocument();
    expect(screen.getByLabelText("Color")).toBeInTheDocument();
  });
});
