import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BankToggleChips } from "./BankToggleChips";
import { NewProfile } from "../types/profile";
import { MAX_COMPARISON_BANKS } from "../consts/keys";
import { ALL_SLUGS } from "../logic/slugs";

/** A profile with non-zero savings so EIR percentages appear. */
const profile = NewProfile({ Savings: 50000 });

/** Helper: open the Autocomplete dropdown by clicking the input. */
const openDropdown = (placeholder = "Search banks...") => {
  const input = screen.getByRole("combobox");
  fireEvent.mouseDown(input);
};

describe("BankToggleChips", () => {
  it("renders the search input", () => {
    render(
      <BankToggleChips selected={[]} onChange={() => {}} profile={profile} />,
    );
    expect(screen.getByPlaceholderText("Search banks...")).toBeDefined();
  });

  it("selects a bank from the dropdown", async () => {
    const onChange = vi.fn();
    render(
      <BankToggleChips selected={[]} onChange={onChange} profile={profile} />,
    );
    openDropdown();

    const gxsOption = await screen.findByRole("option", { name: /GXS Savings Account/ });
    fireEvent.click(gxsOption);

    // onChange should be called with the slug "gxs-savings-account"
    expect(onChange).toHaveBeenCalledWith(["gxs-savings-account"]);
  });

  it("deselects a bank when chip delete is clicked", () => {
    const onChange = vi.fn();
    const { container } = render(
      <BankToggleChips
        selected={["gxs-savings-account"]}
        onChange={onChange}
        profile={profile}
      />,
    );
    // MUI Autocomplete chip has a CancelIcon SVG as the delete trigger.
    const chip = container.querySelector(".MuiChip-deletable");
    expect(chip).toBeTruthy();
    const svg = chip!.querySelector('[data-testid="CancelIcon"]');
    if (svg) {
      fireEvent.click(svg);
    }
    if (!svg) {
      fireEvent.click(chip!);
    }
    expect(onChange).toHaveBeenCalledWith([]);
  });

  it("caps at MAX_COMPARISON_BANKS — disabled options not clickable", async () => {
    const onChange = vi.fn();
    const maxed = ALL_SLUGS.slice(0, MAX_COMPARISON_BANKS);
    render(
      <BankToggleChips
        selected={maxed}
        onChange={onChange}
        profile={profile}
      />,
    );
    openDropdown("Add more banks...");

    // Wait for options, then find at least one disabled (unselected)
    const options = await screen.findAllByRole("option");
    const disabled = options.filter(
      (o) => o.getAttribute("aria-disabled") === "true",
    );
    expect(disabled.length).toBeGreaterThan(0);

    // Clicking a disabled option should not fire onChange
    fireEvent.click(disabled[0]);
    expect(onChange).not.toHaveBeenCalled();
  });

  it("shows 'X/Y selected' counter", () => {
    render(
      <BankToggleChips
        selected={["gxs-savings-account", "mari-savings-account"]}
        onChange={() => {}}
        profile={profile}
      />,
    );
    expect(
      screen.getByText(`2/${MAX_COMPARISON_BANKS} selected`),
    ).toBeDefined();
  });

  it("filters banks by search text", async () => {
    render(
      <BankToggleChips selected={[]} onChange={() => {}} profile={profile} />,
    );
    const input = screen.getByRole("combobox");
    await userEvent.type(input, "gxs");

    // After typing, the dropdown should show only matching options
    const gxsOption = await screen.findByText("GXS Savings Account");
    expect(gxsOption).toBeDefined();
  });

  it("Select All fills up to MAX_COMPARISON_BANKS", () => {
    const onChange = vi.fn();
    render(
      <BankToggleChips selected={[]} onChange={onChange} profile={profile} />,
    );
    fireEvent.click(screen.getByText("Select All"));
    const called = onChange.mock.calls[0][0];
    expect(called.length).toBe(MAX_COMPARISON_BANKS);
  });
});