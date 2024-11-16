import { ResultInterest } from "../types/interest_result"
import { stand_chart_interest } from "./stand_chart"

describe("Standard Chartered Interest Rates", () => {
    it("should have correct value for 100k balance with all interest rates", () => {
        const result = stand_chart_interest({
            Savings: 100000,
            Age: 0,
            Salary: 3000,
            Spending: 2000,
            Investment: 30000,
            Insurance: 12000,
            GiroTransactions: 3,
            MonthlyAccIncrease: 0,
        })

        expect(result).toEqual(new ResultInterest(7680))
    })
})