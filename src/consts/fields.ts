import type {Profile} from '../types/profile';


interface FieldMeta {
  label: string;
  key: keyof Profile;
  isBoolean: boolean;
}

export const FIELDS: FieldMeta[] = [
  { key: "Savings", label: "Savings", isBoolean: false },
  { key: "Age", label: "Age", isBoolean: false },
  { key: "Salary", label: "Salary", isBoolean: false },
  { key: "Spending", label: "Spending", isBoolean: false },
  { key: "Investment", label: "Investment", isBoolean: false },
  { key: "Insurance", label: "Insurance", isBoolean: false },
  { key: "GiroTransactions", label: "GIRO Txn", isBoolean: false },
  { key: "MonthlyAccIncrease", label: "Acc Increase", isBoolean: false },
  { key: "LoanInstallment", label: "Loan Install", isBoolean: false },
  { key: "OneTimeLoan", label: "One-Time Loan", isBoolean: false },
  { key: "IsNTUCMember", label: "NTUC Member", isBoolean: true },
  { key: "ReferredCustomer", label: "Referred Customer", isBoolean: true },
  { key: "PayNowReceived", label: "PayNow Received", isBoolean: false },
  { key: "FXSpend", label: "FX Spend", isBoolean: false },
];


