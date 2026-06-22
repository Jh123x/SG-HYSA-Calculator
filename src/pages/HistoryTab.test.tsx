import { vi, describe, it, expect, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HistoryTab } from "./HistoryTab";
import { NewProfile } from "../types/profile";

const { mockUseMobile } = vi.hoisted(() => ({
  mockUseMobile: vi.fn(),
}));

vi.mock("../hooks/useMobile", () => ({
  useMobile: mockUseMobile,
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useSearchParams: () => [new URLSearchParams(), vi.fn()],
  };
});

const profile = NewProfile({ Savings: 50000 });

function renderTab() {
  return render(
    <MemoryRouter>
      <HistoryTab profile={profile} />
    </MemoryRouter>,
  );
}

describe("HistoryTab desktop", () => {
  beforeEach(() => {
    mockUseMobile.mockReturnValue({ isMobile: false, isCompact: false });
  });

  it("should match snapshot", () => {
    const { asFragment } = renderTab();
    expect(asFragment()).toMatchSnapshot();
  });
});

describe("HistoryTab mobile", () => {
  beforeEach(() => {
    mockUseMobile.mockReturnValue({ isMobile: true, isCompact: true });
  });

  it("should match snapshot", () => {
    const { asFragment } = renderTab();
    expect(asFragment()).toMatchSnapshot();
  });
});
