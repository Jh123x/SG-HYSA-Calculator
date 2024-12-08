import React from "react"
import { render } from "@testing-library/react"
import { Result } from "./Interests"
import { ResultInterest } from "../types/interest_result"

describe("Result Table", () => {
    it("should match snapshot when results is empty", () => {
        expect(render(<Result results={{}} />)).toMatchSnapshot()
    })

    it("should match snapshot when results are full", () => {
        expect(
            render(<Result results={{
                "UOB Bank": {
                    interest: new ResultInterest(1000),
                    url: "https://jh123x.com",
                    remarks: "Testing remarks"
                }
            }} />)
        ).toMatchSnapshot()
    })
})