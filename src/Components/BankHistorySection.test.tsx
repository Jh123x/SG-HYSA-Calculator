import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { BankHistorySection } from "./BankHistorySection";
import { NewProfile } from "../types/profile";

const profile = NewProfile({ Savings: 50000 });

describe("BankHistorySection", () => {
  it("renders bank name and rate history table", () => {
    render(
      <MemoryRouter>
        <BankHistorySection bankSlug="gxs-savings-account" profile={profile} />
      </MemoryRouter>,
    );
    expect(screen.getByText("GXS Savings")).toBeDefined();
    // Should have date column headers
    expect(screen.getByText("Date")).toBeDefined();
    expect(screen.getByText("What Changed")).toBeDefined();
    expect(screen.getByText("Yearly Interest")).toBeDefined();
    expect(screen.getByText("EIR")).toBeDefined();
    // Should have a "View Full Page" button
    expect(screen.getByText("View Full Page")).toBeDefined();
  });

  it("renders error fallback for unknown bank slug", () => {
    render(
      <MemoryRouter>
        <BankHistorySection bankSlug="fake-bank" profile={profile} />
      </MemoryRouter>,
    );
    // Should show error message, not empty
    expect(screen.getByText(/Unable to load history/)).toBeDefined();
  });
});
