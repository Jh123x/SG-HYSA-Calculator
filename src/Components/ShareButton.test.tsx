import { render } from "@testing-library/react";
import { expect, it, describe } from "vitest";
import { ShareButton } from "./ShareButton";
import { type Profile, NewProfile } from "../types/profile";

describe("ShareButton", () => {
  it("should match snapshot", () => {
    const profile: Profile = NewProfile({});
    const { asFragment } = render(<ShareButton profile={profile}></ShareButton>);
    expect(asFragment()).toMatchSnapshot()
  })
})
