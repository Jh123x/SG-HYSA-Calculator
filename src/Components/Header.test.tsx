import React from "react";
import { Header } from "./Header";

describe("Header", () => {
    it("should match snapshot", () => {
        expect(<Header />).toMatchSnapshot()
    })
})