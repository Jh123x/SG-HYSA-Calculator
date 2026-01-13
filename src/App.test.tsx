import { render } from "@testing-library/react";
import { expect, describe, it } from "vitest";
import { App } from "./App";

describe("App", () => {
  it("should render correctly", () => {
    const { asFragment } = render(<App />);
    expect(asFragment()).toMatchSnapshot();
  });
});
