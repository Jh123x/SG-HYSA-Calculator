import React from "react";
import { render } from "@testing-library/react";
import { FormInputs } from "./Inputs";
import Profile, { NewProfile } from "../types/profile";

describe("Form Inputs", () => {
    it("should match snapshot if profile is empty", () => {
        const tree = render(<FormInputs currProfile={NewProfile({})} setCurrProfile={(_: Profile) => { }}></FormInputs>)
        expect(tree).toMatchSnapshot()
    })
    it("should match snapshot if profile is not empty", () => {
        const tree = render(<FormInputs
            currProfile={{
                Savings: 100000,
                Salary: 3000,
                Spending: 1000,
                LoanInstallment: 0,
                Insurance: 0,
                Investment: 0,
                Age: 10,
                MonthlyAccIncrease: 500,
                GiroTransactions: 0,
            }}
            setCurrProfile={(_: Profile) => { }}
        ></FormInputs>)
        expect(tree).toMatchSnapshot()
    })
})