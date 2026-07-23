import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { ErrorBoundary } from "./ErrorBoundary";


const ErrComponent = () => {
  throw Error("test error")
}

describe("ErrorBoundary", () => {
  it("should match snapshot for no error", () => {
    const { asFragment } = render(<ErrorBoundary><div></div></ErrorBoundary>)
    expect(asFragment()).toMatchSnapshot();
  });
  it("should match snapshot on error", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const { asFragment } = render(<ErrorBoundary><ErrComponent /></ErrorBoundary>)
    expect(asFragment()).toMatchSnapshot();
    spy.mockRestore();
  })
})
