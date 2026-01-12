import { render } from "@testing-library/react";
import { Header } from "./Header";
import * as React from "react";

describe("Header", () => {
  it("should match snapshot", () => {
    expect(render(<Header />).asFragment()).toMatchSnapshot();
  });
});
