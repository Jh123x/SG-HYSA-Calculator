import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { BankDetailPage } from "./BankDetailPage";
import { NewProfile } from "../types/profile";

const profile = NewProfile({ Savings: 50000 });

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route
          path="/bank/:slug"
          element={<BankDetailPage profile={profile} />}
        />
      </Routes>
    </MemoryRouter>,
  );
}

describe("BankDetailPage", () => {
  it("renders bank detail for a valid slug", () => {
    renderAt("/bank/gxs");
    expect(screen.getAllByText("GXS").length).toBeGreaterThan(0);
    expect(screen.getByText("Rate Change History")).toBeDefined();
    expect(screen.getByText("Back")).toBeDefined();
  });

  it("redirects to homepage for invalid slug", () => {
    renderAt("/bank/nonexistent-bank");
    expect(screen.queryByText("Bank Not Found")).toBeNull();
    expect(screen.queryByText("Rate Change History")).toBeNull();
  });

  it("shows summary chip with current EIR", () => {
    renderAt("/bank/gxs");
    const eirChip = screen.queryByText(/Current EIR:/);
    expect(eirChip).toBeDefined();
  });

  it("renders the EIR over time chart section", () => {
    renderAt("/bank/gxs");
    expect(screen.getByText("Interest Rate Over Time")).toBeDefined();
  });
});
