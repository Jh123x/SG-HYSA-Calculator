import React from "react";
import { render } from "@testing-library/react";
import { InterestGraph } from "./InterestGraph";
import { NewProfile } from "../types/profile";

describe("Interest Graph", () => {
    it("should match snapshot if profile is empty", () => {
        const tree = render(<InterestGraph profile={NewProfile({})} />)
        expect(tree).toMatchSnapshot()
    })
    it("should match snapshot if profile is not empty", () => {
        const tree = render(<InterestGraph
            profile={NewProfile({
                Savings: 100000,
                Salary: 3000,
                Spending: 1000,
                LoanInstallment: 0,
                Insurance: 0,
                Investment: 0,
                Age: 10,
                MonthlyAccIncrease: 500,
                GiroTransactions: 0,
            })}
        />)
        expect(tree).toMatchSnapshot()
    })
})