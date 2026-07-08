import type Profile from "../types/profile";
import type { InputArg } from "./types";

const makeDefaultNumber = (value?: number): number =>
  value === undefined || value === 0 ? 0 : value;

export const numericalInputs: Array<InputArg<number>> = [
  {
    label: "Savings",
    tooltip: "Total savings balance to deposit",
    fn: (profile, v) => ({ ...profile, Savings: v }),
    getStateFromProfile: (profile: Profile) =>
      makeDefaultNumber(profile.Savings),
  },
  {
    label: "Age",
    tooltip: "Current age",
    fn: (profile, v) => ({ ...profile, Age: v }),
    getStateFromProfile: (profile: Profile) => makeDefaultNumber(profile.Age),
  },
  {
    label: "Salary",
    tooltip: "Salary credited to the bank monthly",
    fn: (profile, v) => ({ ...profile, Salary: v }),
    getStateFromProfile: (profile: Profile) =>
      makeDefaultNumber(profile.Salary),
  },
  {
    label: "Investment",
    tooltip: "Total investment contributions to the bank yearly",
    fn: (profile, v) => ({ ...profile, Investment: v }),
    getStateFromProfile: (profile: Profile) =>
      makeDefaultNumber(profile.Investment),
  },
  {
    label: "Insurance",
    tooltip: "Total insurance premiums paid to the bank yearly",
    fn: (profile, v) => ({ ...profile, Insurance: v }),
    getStateFromProfile: (profile: Profile) =>
      makeDefaultNumber(profile.Insurance),
  },
  {
    label: "Spending",
    tooltip: "On eligible cards monthly",
    fn: (profile, v) => ({ ...profile, Spending: v }),
    getStateFromProfile: (profile: Profile) =>
      makeDefaultNumber(profile.Spending),
  },
  {
    label: "GIRO Transactions",
    tooltip: "No. of GIRO Transactions",
    fn: (profile, v) => ({ ...profile, GiroTransactions: v }),
    getStateFromProfile: (profile: Profile) =>
      makeDefaultNumber(profile.GiroTransactions),
  },
  {
    label: "Account Increment",
    tooltip: "Balance increase monthly",
    fn: (profile, v) => ({ ...profile, MonthlyAccIncrease: v }),
    getStateFromProfile: (profile: Profile) =>
      makeDefaultNumber(profile.MonthlyAccIncrease),
  },
  {
    label: "Loan Installment",
    tooltip: "Monthly loan payment",
    fn: (profile, v) => ({ ...profile, LoanInstallment: v }),
    getStateFromProfile: (profile: Profile) =>
      makeDefaultNumber(profile.LoanInstallment),
  },
  {
    label: "One Time Loan",
    tooltip: "Additional one-time loan amount",
    fn: (profile, v) => ({ ...profile, OneTimeLoan: v }),
    getStateFromProfile: (profile: Profile) =>
      makeDefaultNumber(profile.OneTimeLoan),
  },
  {
    label: "PayNow Received",
    tooltip: "Incoming PayNow transfers monthly",
    fn: (profile, v) => ({ ...profile, PayNowReceived: v }),
    getStateFromProfile: (profile: Profile) =>
      makeDefaultNumber(profile.PayNowReceived),
  },
  {
    label: "FX Spend",
    tooltip: "Foreign currency spend monthly",
    fn: (profile, v) => ({ ...profile, FXSpend: v }),
    getStateFromProfile: (profile: Profile) =>
      makeDefaultNumber(profile.FXSpend),
  },
];

export const booleanInputs: Array<InputArg<boolean>> = [
  {
    label: "NTUC Member?",
    tooltip: "Are you an NTUC member (or willing to join)?",
    fn: (profile, v) => ({ ...profile, IsNTUCMember: v }),
    getStateFromProfile: (profile: Profile) => profile.IsNTUCMember,
  },
  {
    label: "Referred Customer?",
    tooltip: "You referred a new Trust credit card customer whose application was approved this month",
    fn: (profile, v) => ({ ...profile, ReferredCustomer: v }),
    getStateFromProfile: (profile: Profile) => profile.ReferredCustomer,
  },
];
