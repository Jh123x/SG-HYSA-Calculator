import { vi, describe, it, expect, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { CurrentRatesTab } from "./CurrentRatesTab";
import { NewProfile } from "../types/profile";

const { mockUseMobile } = vi.hoisted(() => ({
  mockUseMobile: vi.fn(),
}));

vi.mock("../hooks/useMobile", () => ({
  useMobile: mockUseMobile,
}));

const profile = NewProfile({ Savings: 50000 });

function renderTab() {
  return render(
    <MemoryRouter>
      <CurrentRatesTab profile={profile} />
    </MemoryRouter>,
  );
}

describe("CurrentRatesTab desktop", () => {
  beforeEach(() => {
    mockUseMobile.mockReturnValue({ isMobile: false, isCompact: false });
  });

  it("should match snapshot", () => {
    const { asFragment } = renderTab();
    expect(asFragment()).toMatchSnapshot();
  });
});

describe("CurrentRatesTab mobile", () => {
  beforeEach(() => {
    mockUseMobile.mockReturnValue({ isMobile: true, isCompact: true });
  });

  it("should match snapshot", () => {
    const { asFragment } = renderTab();
    expect(asFragment()).toMatchSnapshot();
  });
});
