import { ResultInterest } from "../types/interest_result";
import Profile, { NewProfile } from "../types/profile";
import { trust_bank_06_2025 } from "./trust_bank";

interface testCases {
  name: string;
  profile: Profile;
  expectedInterest: ResultInterest;
}

describe("trust_bank", () => {
  const tests: testCases[] = [
    {
      name: "no interest should return empty",
      profile: NewProfile({}),
      expectedInterest: new ResultInterest(0, 0),
    },
    {
      name: "max interest rate",
      profile: NewProfile({
        Savings: 1_200_000,
        Spending: 150,
        Salary: 1500,
        IsNTUCMember: true,
      }),
      expectedInterest: new ResultInterest(27_000, 1_200_000),
    },
    {
      name: "not ntuc member + 100k",
      profile: NewProfile({
        Savings: 100_000,
        Spending: 150,
        Salary: 1500,
        IsNTUCMember: false,
      }),
      expectedInterest: new ResultInterest(2050, 100_000),
    },
    {
      name: "only spending + 100k",
      profile: NewProfile({ Savings: 100_000, Spending: 150 }),
      expectedInterest: new ResultInterest(1550, 100_000),
    },
    {
      name: "only 100k",
      profile: NewProfile({ Savings: 100_000 }),
      expectedInterest: new ResultInterest(1250, 100_000),
    },
    {
      name: "only 50k",
      profile: NewProfile({ Savings: 50_000 }),
      expectedInterest: new ResultInterest(250, 50_000),
    },
  ];

  for (const testCase of tests) {
    it(testCase.name, () => {
      const result = trust_bank_06_2025(testCase.profile);
      expect(result).toEqual(testCase.expectedInterest);
    });
  }
});
