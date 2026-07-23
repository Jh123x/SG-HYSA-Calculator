import { render } from "@testing-library/react";
import { Footer } from "./Footer";
import { expect, it } from "vitest";

describe("Footer", () => {
  it("should match snapshot", () => {
    const { asFragment } = render(<Footer />);
    expect(asFragment()).toMatchSnapshot();
  });
});
