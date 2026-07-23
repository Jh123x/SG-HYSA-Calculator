import { render } from "@testing-library/react";
import { expect, describe, it } from "vitest";
import Socials from "./Socials";

describe("Socials", () => {
  it("should match snapshot", () => {
    const { asFragment } = render(<Socials />);
    expect(asFragment()).toMatchSnapshot();
  })
})

