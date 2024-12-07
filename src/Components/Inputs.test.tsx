import React from "react";
import { FormInputs } from "./Inputs";

describe("Form Inputs", () => {
    it("should match snapshot", () => {
        expect(<FormInputs updateResult={(_) => { }}></FormInputs>).toMatchSnapshot()
    })
})