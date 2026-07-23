import { render } from "@testing-library/react";
import { expect, it, describe } from "vitest";
import { LocalLink } from "./LocalLink";

describe("LocalLink", () => {
  it("should match snapshot", () => {
    const { asFragment } = render(<LocalLink href="https://example.com">Test</LocalLink>);

    expect(asFragment()).toMatchSnapshot()
  })
})

