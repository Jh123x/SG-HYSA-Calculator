import { vi, describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { BankDetailPage } from "./BankDetailPage";
import { NewProfile } from "../types/profile";

const { mockUseMobile } = vi.hoisted(() => ({
  mockUseMobile: vi.fn(),
}));

vi.mock("../hooks/useMobile", () => ({
  useMobile: mockUseMobile,
}));

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

describe("BankDetailPage desktop", () => {
  beforeEach(() => {
    mockUseMobile.mockReturnValue({ isMobile: false, isCompact: false });
  });

  it("renders bank detail for a valid slug", () => {
    renderAt("/bank/gxs-savings-account");
    expect(screen.getAllByText("GXS Savings").length).toBeGreaterThan(0);
    expect(screen.getByText("Rate Change History")).toBeDefined();
    expect(screen.getByText("Back")).toBeDefined();
  });

  it("redirects to homepage for invalid slug", () => {
    renderAt("/bank/nonexistent-bank");
    expect(screen.queryByText("Bank Not Found")).toBeNull();
    expect(screen.queryByText("Rate Change History")).toBeNull();
  });

  it("shows summary chip with current EIR", () => {
    renderAt("/bank/gxs-savings-account");
    const eirChip = screen.queryByText(/Current EIR:/);
    expect(eirChip).toBeDefined();
  });

  it("renders the EIR over time chart section", () => {
    renderAt("/bank/gxs-savings-account");
    expect(screen.getByText("Yearly $")).toBeDefined();
  });

  it("should match snapshot", () => {
    const { asFragment } = renderAt("/bank/gxs-savings-account");
    expect(asFragment()).toMatchSnapshot();
  });
});

describe("BankDetailPage mobile", () => {
  beforeEach(() => {
    mockUseMobile.mockReturnValue({ isMobile: true, isCompact: true });
  });

  it("should match snapshot", () => {
    const { asFragment } = renderAt("/bank/gxs-savings-account");
    expect(asFragment()).toMatchSnapshot();
  });
});
