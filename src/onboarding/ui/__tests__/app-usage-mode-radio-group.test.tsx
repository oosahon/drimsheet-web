import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { AppUsageModeRadioGroup } from "../app-usage-mode-radio-group";

describe("AppUsageModeRadioGroup", () => {
  it("renders correctly with default state", () => {
    const onChange = vi.fn();
    render(<AppUsageModeRadioGroup value="" onChange={onChange} />);

    expect(screen.getByText("Accounting mode")).toBeInTheDocument();
    expect(screen.getByText("Automated (Recommended)")).toBeInTheDocument();
    expect(screen.getByText("Manual")).toBeInTheDocument();
  });

  it("calls onChange when an option is selected", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<AppUsageModeRadioGroup value="" onChange={onChange} />);

    const manualRadioLabel = screen.getByText("Manual");
    await user.click(manualRadioLabel);

    expect(onChange).toHaveBeenCalledWith("power_user");
    
    const automatedRadioLabel = screen.getByText("Automated (Recommended)");
    await user.click(automatedRadioLabel);
    
    expect(onChange).toHaveBeenCalledWith("non_power_user");
  });

  it("displays an error when error prop is provided", () => {
    const onChange = vi.fn();
    render(
      <AppUsageModeRadioGroup
        value=""
        onChange={onChange}
        error={[{ message: "Mode is required" }]}
      />
    );

    expect(screen.getByText("Mode is required")).toBeInTheDocument();
  });
});
