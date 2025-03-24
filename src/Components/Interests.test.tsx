import React from "react"
import { render } from "@testing-library/react"
import { Result } from "./Interests"
import { NewProfile } from "../types/profile"

describe("Result Table", () => {
    it("should match snapshot when results is empty", () => {
        expect(render(<Result profile={NewProfile({})} />)).toMatchSnapshot()
    })

    it("should match snapshot when results are full", () => {
        expect(
            render(<Result profile={NewProfile({
                Savings: 100000,
                Salary: 3000,
                Spending: 1000,
                LoanInstallment: 0,
                Insurance:0,
                Investment:0,
                Age: 10,
                MonthlyAccIncrease: 500,
                GiroTransactions: 0,
                IsNTUCMember: false
            })} />)
        ).toMatchSnapshot()
    })
})