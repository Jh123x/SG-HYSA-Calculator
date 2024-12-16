import { ResultInterest } from "../types/interest_result"
import { stand_chart_interest } from "./stand_chart"
import { NewProfile } from "../types/profile"

describe("Standard Chartered Interest Rates", () => {
    it("should be correct for 100k balance with all interest rates", () => {
        const result = stand_chart_interest(
            NewProfile({
                Savings: 100000,
                Salary: 3000,
                Spending: 2000,
                Investment: 30000,
                Insurance: 12000,
                GiroTransactions: 3,
            })
        )

        expect(result).toEqual(new ResultInterest(7680, 100000))
    })

    it("should be correct for 200k balance with all interest rates", () => {
        const result = stand_chart_interest(NewProfile({
            Savings: 200000,
            Salary: 3000,
            Spending: 2000,
            Investment: 30000,
            Insurance: 12000,
            GiroTransactions: 3,
        }))

        expect(result).toEqual(new ResultInterest(7730, 200000))
    })

    it("should be correct for 200k no condition", () => {
        const result = stand_chart_interest(NewProfile({ Savings: 200000 }))
        expect(result).toEqual(new ResultInterest(100, 200000))
    })

    it("should be correct for 100k balance with 3 req", () => {
        const result = stand_chart_interest(NewProfile({
            Savings: 100000,
            Salary: 3000,
            Spending: 2000,
            GiroTransactions: 3,
        }))

        expect(result).toEqual(new ResultInterest(3680, 100000))
    })

    it("should be correct for 100k balance with no condition", () => {
        const result = stand_chart_interest(NewProfile({ Savings: 100_000, }))

        expect(result).toEqual(new ResultInterest(50, 100_000))
    })

    it("should be correct for 100k balance with salary only", () => {
        const result = stand_chart_interest(NewProfile({
            Savings: 100000,
            Salary: 3000,
        }))

        expect(result).toEqual(new ResultInterest(2050, 100000))
    })

    it("should be correct for 50k balance with salary only", () => {
        const result = stand_chart_interest(NewProfile({
            Savings: 50000,
            Salary: 3000,
        }))

        expect(result).toEqual(new ResultInterest(1025, 50000))
    })

    it("no money should have no interest", () => {
        const result = stand_chart_interest(NewProfile({}))
        expect(result).toEqual(new ResultInterest(0, 0))
    })
})