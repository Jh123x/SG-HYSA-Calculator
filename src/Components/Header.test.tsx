import { render } from "@testing-library/react";
import { Header } from "./Header";
import * as React from "react";
import { describe, it, expect } from "vitest";

describe("Header", () => {
  it("should match snapshot", () => {
    expect(render(<Header />).asFragment()).toMatchSnapshot();
  });
});
