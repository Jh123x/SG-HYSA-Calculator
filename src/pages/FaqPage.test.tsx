import { vi, describe, it, expect, beforeEach, beforeAll } from "vitest";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { FaqPage } from "./FaqPage";

// IntersectionObserver is not available in jsdom. Use a minimal mock that
// treats everything as "intersecting" so FaqToc doesn't throw on mount.
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

beforeAll(() => {
  class MockIntersectionObserver {
    readonly observe = vi.fn();
    readonly unobserve = vi.fn();
    readonly disconnect = vi.fn();
    readonly root = null;
    readonly rootMargin = "";
    readonly thresholds: number[] = [];
    readonly takeRecords = () => [] as IntersectionObserverEntry[];
  }
  vi.stubGlobal("IntersectionObserver", MockIntersectionObserver as unknown as typeof IntersectionObserver);
});

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
