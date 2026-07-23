import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { ComparisonChart } from "./ComparisonChart";
import { NewProfile } from "../types/profile";
import { ALL_SLUGS } from "../logic/slugs";

describe("Comparison Chart", () => {
  it("should match snapshot", () => {
    const profile = NewProfile({
      Savings: 150_000,
      Spending: 500,
      Salary: 1000,
    });
    const { asFragment } = render(<ComparisonChart selectedBanks={ALL_SLUGS} profile={profile} chartMode="yearly" />);
    expect(asFragment()).toMatchSnapshot();
  });
});


