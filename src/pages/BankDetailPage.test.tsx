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
    expect(screen.getByText("GXS")).toBeDefined();
    expect(screen.getByText("Rate Change History")).toBeDefined();
    expect(screen.getByText("Back")).toBeDefined();
  });

  it("shows 'Bank Not Found' for invalid slug", () => {
    renderAt("/bank/nonexistent-bank");
    expect(screen.getByText("Bank Not Found")).toBeDefined();
    expect(screen.getByText("Go to Calculator")).toBeDefined();
  });

  it("shows summary chip with current EIR", () => {
    renderAt("/bank/gxs");
    const eirChip = screen.queryByText(/Current EIR:/);
    expect(eirChip).toBeDefined();
  });

  it("renders the interest vs savings chart section", () => {
    renderAt("/bank/gxs");
    expect(screen.getByText("Interest vs Savings Over Time")).toBeDefined();
  });
});
