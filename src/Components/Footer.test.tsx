import React from "react";
import { render } from "@testing-library/react";
import { Footer } from "./Footer";

describe("Footer", () => {
    it("should match snapshot", () => {
        const tree = render(<Footer />)
        expect(tree).toMatchSnapshot()
    })
})