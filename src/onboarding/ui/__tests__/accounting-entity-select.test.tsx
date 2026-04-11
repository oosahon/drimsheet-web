import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeAll } from "vitest";
import { AccountingEntitySelect } from "../accounting-entity-select";

describe("AccountingEntitySelect", () => {
  beforeAll(() => {
    window.HTMLElement.prototype.hasPointerCapture = vi.fn(
      () => false,
    ) as unknown as typeof window.HTMLElement.prototype.hasPointerCapture;
    window.HTMLElement.prototype.releasePointerCapture =
      vi.fn() as unknown as typeof window.HTMLElement.prototype.releasePointerCapture;
    window.HTMLElement.prototype.setPointerCapture =
      vi.fn() as unknown as typeof window.HTMLElement.prototype.setPointerCapture;
    window.HTMLElement.prototype.scrollIntoView =
      vi.fn() as unknown as typeof window.HTMLElement.prototype.scrollIntoView;
  });

  it("renders correctly with default state", () => {
    const onChange = vi.fn();
    render(<AccountingEntitySelect value="" onChange={onChange} />);

    expect(screen.getByText("Who is this account for?")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("opens the select and chooses an entity", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<AccountingEntitySelect value="" onChange={onChange} />);

    const trigger = screen.getByRole("combobox");
    await user.click(trigger);

    // Option should be visible
    const option = await screen.findByRole("option", {
      name: /An Individual/i,
    });
    expect(option).toBeInTheDocument();

    await user.click(option);

    expect(onChange).toHaveBeenCalledWith("individual");
  });

  it("displays an error when error prop is provided", () => {
    const onChange = vi.fn();
    render(
      <AccountingEntitySelect
        value=""
        onChange={onChange}
        error={[{ message: "Entity is required" }]}
      />,
    );

    expect(screen.getByText("Entity is required")).toBeInTheDocument();
  });
});
