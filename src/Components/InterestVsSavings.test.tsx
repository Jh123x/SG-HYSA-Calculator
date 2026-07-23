import { render } from "@testing-library/react";
import { type ChartLine, InterestVsSavingsChart } from "./InterestVsSavingsChart";
import { expect, it, describe } from "vitest";
import { NewProfile } from "../types/profile";

describe("InterestVsSavingsChart", () => {
  it("should match snapshot", () => {
    const profile = NewProfile({});
    const lines: ChartLine[] = []
    const { asFragment } = render(<InterestVsSavingsChart lines={lines} profile={profile} />);

    expect(asFragment()).toMatchSnapshot()
  })
})


