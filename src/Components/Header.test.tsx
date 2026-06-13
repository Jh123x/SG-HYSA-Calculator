import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Header } from "./Header";
import { describe, it, expect } from "vitest";

describe("Header", () => {
  it("should match snapshot", () => {
    expect(
      render(
        <MemoryRouter>
          <Header />
        </MemoryRouter>,
      ).asFragment(),
    ).toMatchSnapshot();
  });
});
