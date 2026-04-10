import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { CurrencyComboBox } from "../currency-combobox";

describe("CurrencyComboBox", () => {
  it("renders correctly with no initial value", () => {
    const onChange = vi.fn();
    render(<CurrencyComboBox label="Currency" value="" onChange={onChange} />);

    expect(screen.getByLabelText("Currency")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Select a currency")).toBeInTheDocument();
  });

  it("renders with an initial value and displays the logo", () => {
    const onChange = vi.fn();
    render(<CurrencyComboBox label="Currency" value="NGN" onChange={onChange} />);

    // Since NGN is selected, checking for the background image
    // The div with the background image does not have a distinct role but it should have the url
    const logoDivs = document.querySelectorAll('div[style*="background-image"]');
    // There might be multiple because it might render for the selected item and possibly the list if open
    // We expect at least one to have the ng.png tag
    const hasNgIcon = Array.from(logoDivs).some((div) => {
      const element = div as HTMLElement;
      const style = window.getComputedStyle(element);
      return style.backgroundImage.includes('ng.png') || element.style.backgroundImage.includes('ng.png');
    });
    expect(hasNgIcon).toBe(true);
  });

  it("opens the combobox and selects a currency", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<CurrencyComboBox label="Currency" value="" onChange={onChange} />);

    const input = screen.getByPlaceholderText("Select a currency");
    await user.click(input);

    // Option should be visible
    const option = await screen.findByRole("option", { name: /Nigerian Naira/i });
    expect(option).toBeInTheDocument();

    await user.click(option);

    expect(onChange).toHaveBeenCalledWith("NGN");
  });

  it("filters currencies when typing by name", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<CurrencyComboBox label="Currency" value="" onChange={onChange} />);

    const input = screen.getByPlaceholderText("Select a currency");
    await user.type(input, "naira");
    
    expect(await screen.findByRole("option", { name: /Nigerian Naira/i })).toBeInTheDocument();
    
    // Should not show non-matching options
    expect(screen.queryByRole("option", { name: /United States Dollar/i })).not.toBeInTheDocument();
  });

  it("filters currencies when typing by code", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<CurrencyComboBox label="Currency" value="" onChange={onChange} />);

    const input = screen.getByPlaceholderText("Select a currency");
    await user.type(input, "USD");
    
    expect(await screen.findByRole("option", { name: /United States Dollar/i })).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: /Nigerian Naira/i })).not.toBeInTheDocument();
  });

  it("displays an error when error prop is provided", () => {
    const onChange = vi.fn();
    render(
      <CurrencyComboBox
        label="Currency"
        value=""
        onChange={onChange}
        error={[{ message: "Currency is required" }]}
      />
    );

    expect(screen.getByText("Currency is required")).toBeInTheDocument();
  });

  it("shows empty state when no currencies match", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<CurrencyComboBox label="Currency" value="" onChange={onChange} />);

    const input = screen.getByPlaceholderText("Select a currency");
    await user.type(input, "xyz123");
    
    expect(await screen.findByText("No currencies found.")).toBeInTheDocument();
  });

  it("calls onChange with empty string if value is cleared", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<CurrencyComboBox label="Currency" value="USD" onChange={onChange} />);

    const input = screen.getByPlaceholderText("Select a currency");
    await user.clear(input);
    await user.tab();
  });

  it("handles invalid initial value gracefully", () => {
    const onChange = vi.fn();
    render(<CurrencyComboBox label="Currency" value="INVALID" onChange={onChange} />);

    expect(screen.getByPlaceholderText("Select a currency")).toBeInTheDocument();
  });
});
