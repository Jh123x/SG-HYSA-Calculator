import React from "react"
import { Result } from "./Interests"
import { ResultInterest } from "../types/interest_result"

describe("Result Table", () => {
    it("should match snapshot when results is empty", () => {
        expect(<Result results={{}}></Result>).toMatchSnapshot()
    })

    it("should match snapshot when results are full", () => {
        expect(
            <Result results={{
                "UOB Bank": {
                    interest: new ResultInterest(1000),
                    url: "https://jh123x.com",
                    remarks: "Testing remarks"
                }
            }}></Result>
        ).toMatchSnapshot()
    })
})