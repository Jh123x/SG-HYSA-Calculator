import { vi, describe, it, expect, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { FaqPage } from "./FaqPage";

const { mockUseMobile } = vi.hoisted(() => ({
  mockUseMobile: vi.fn(),
}));

vi.mock("../hooks/useMobile", () => ({
  useMobile: mockUseMobile,
}));

function renderPage() {
  return render(
    <MemoryRouter>
      <FaqPage />
    </MemoryRouter>,
  );
}

describe("FaqPage desktop", () => {
  beforeEach(() => {
    mockUseMobile.mockReturnValue({ isMobile: false, isCompact: false });
  });

  it("should match snapshot", () => {
    const { asFragment } = renderPage();
    expect(asFragment()).toMatchSnapshot();
  });
});

describe("FaqPage mobile", () => {
  beforeEach(() => {
    mockUseMobile.mockReturnValue({ isMobile: true, isCompact: true });
  });

  it("should match snapshot", () => {
    const { asFragment } = renderPage();
    expect(asFragment()).toMatchSnapshot();
  });
});
