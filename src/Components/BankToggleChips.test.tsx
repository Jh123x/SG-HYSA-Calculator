import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BankToggleChips } from "./BankToggleChips";
import { NewProfile } from "../types/profile";
import { MAX_COMPARISON_BANKS } from "../consts/keys";

/** A profile with non-zero savings so EIR percentages appear on chips. */
const profile = NewProfile({ Savings: 50000 });

describe("BankToggleChips", () => {
  it("renders all bank chips", () => {
    render(
      <BankToggleChips selected={[]} onChange={() => {}} profile={profile} />,
    );
    expect(screen.getByText(/GXS/)).toBeDefined();
    expect(screen.getByText(/Maribank/)).toBeDefined();
    expect(screen.getByText(/UOB Bank/)).toBeDefined();
  });

  it("selects a bank chip on click", () => {
    const onChange = vi.fn();
    render(
      <BankToggleChips selected={[]} onChange={onChange} profile={profile} />,
    );
    fireEvent.click(screen.getByText(/GXS/));
    expect(onChange).toHaveBeenCalledWith(["GXS"]);
  });

  it("deselects a bank chip on second click", () => {
    const onChange = vi.fn();
    render(
      <BankToggleChips
        selected={["GXS"]}
        onChange={onChange}
        profile={profile}
      />,
    );
    fireEvent.click(screen.getByText(/GXS/));
    expect(onChange).toHaveBeenCalledWith([]);
  });

  it("caps at MAX_COMPARISON_BANKS", () => {
    const onChange = vi.fn();
    const maxed = ["GXS", "Maribank", "UOB Bank"].slice(
      0,
      MAX_COMPARISON_BANKS,
    );
    render(
      <BankToggleChips
        selected={maxed}
        onChange={onChange}
        profile={profile}
      />,
    );
    // Find a chip for a bank not in selected — click on OCBC
    const ocbcChip = screen.queryByText(/OCBC Bank/);
    if (ocbcChip) {
      fireEvent.click(ocbcChip);
      expect(onChange).not.toHaveBeenCalled();
    }
  });

  it("shows 'X/Y selected' counter", () => {
    render(
      <BankToggleChips
        selected={["GXS", "Maribank"]}
        onChange={() => {}}
        profile={profile}
      />,
    );
    expect(screen.getByText(/2\/3 selected/)).toBeDefined();
  });

  it("filters banks by search text", () => {
    render(
      <BankToggleChips selected={[]} onChange={() => {}} profile={profile} />,
    );
    const input = screen.getByPlaceholderText("Filter banks...");
    fireEvent.change(input, { target: { value: "gxs" } });
    expect(screen.getByText(/GXS/)).toBeDefined();
    expect(screen.queryByText(/UOB Bank/)).toBeNull();
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

  it("Clear deselects all", () => {
    const onChange = vi.fn();
    render(
      <BankToggleChips
        selected={["GXS", "Maribank"]}
        onChange={onChange}
        profile={profile}
      />,
    );
    fireEvent.click(screen.getByText("Clear"));
    expect(onChange).toHaveBeenCalledWith([]);
  });
});
