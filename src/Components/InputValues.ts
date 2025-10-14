import type Profile from "../types/profile";
import type { InputArg } from "./types";


const makeDefaultNumber = (value?: number): number => (value === undefined || value === 0 ? 0 : value);

export const numericalInputs: Array<InputArg<number>> = [
    {
        label: "Savings",
        tooltip: "To be deposited at bank",
        fn: (profile, v) => ({ ...profile, Savings: v }),
        getStateFromProfile: (profile: Profile) => makeDefaultNumber(profile.Savings),
    },
    {
        label: "Age",
        tooltip: "Current age",
        fn: (profile, v) => ({ ...profile, Age: v }),
        getStateFromProfile: (profile: Profile) => makeDefaultNumber(profile.Age),
    },
    {
        label: "Salary",
        tooltip: "Credited to bank monthly",
        fn: (profile, v) => ({ ...profile, Salary: v }),
        getStateFromProfile: (profile: Profile) => makeDefaultNumber(profile.Salary),
    },
    {
        label: "Investment",
        tooltip: "Pay to bank yearly",
        fn: (profile, v) => ({ ...profile, Investment: v }),
        getStateFromProfile: (profile: Profile) => makeDefaultNumber(profile.Investment),
    },
    {
        label: "Insurance",
        tooltip: "Pay to bank yearly",
        fn: (profile, v) => ({ ...profile, Insurance: v }),
        getStateFromProfile: (profile: Profile) => makeDefaultNumber(profile.Insurance),
    },
    {
        label: "Spending",
        tooltip: "On eligible cards monthly",
        fn: (profile, v) => ({ ...profile, Spending: v }),
        getStateFromProfile: (profile: Profile) => makeDefaultNumber(profile.Spending),
    },
    {
        label: "Giro Transactions",
        tooltip: "No. of GIRO Transactions",
        fn: (profile, v) => ({ ...profile, GiroTransactions: v }),
        getStateFromProfile: (profile: Profile) => makeDefaultNumber(profile.GiroTransactions),
    },
    {
        label: "Account Increment",
        tooltip: "Balance increase monthly",
        fn: (profile, v) => ({ ...profile, MonthlyAccIncrease: v }),
        getStateFromProfile: (profile: Profile) => makeDefaultNumber(profile.MonthlyAccIncrease),
    },
    {
        label: "Loan Installment",
        tooltip: "Monthly loan payment",
        fn: (profile, v) => ({ ...profile, LoanInstallment: v }),
        getStateFromProfile: (profile: Profile) => makeDefaultNumber(profile.LoanInstallment),
    },
    {
        label: "One Time Loan",
        tooltip: "Additional 1 time loan",
        fn: (profile, v) => ({ ...profile, OneTimeLoan: v }),
        getStateFromProfile: (profile: Profile) => makeDefaultNumber(profile.OneTimeLoan),
    }
];

export const booleanInputs: Array<InputArg<boolean>> = [
    {
        label: "NTUC Member?",
        tooltip: "Is/Willing to be NTUC Member",
        fn: (profile, v) => ({ ...profile, IsNTUCMember: v }),
        getStateFromProfile: (profile: Profile) => profile.IsNTUCMember,
    },
];
