import React from "react";
import { render } from "@testing-library/react";
import { FormInputs } from "./Inputs";

describe("Form Inputs", () => {
    it("should match snapshot", () => {
        const tree = render(<FormInputs updateResult={(_) => { }}></FormInputs>)
        expect(tree).toMatchSnapshot()
    })
})