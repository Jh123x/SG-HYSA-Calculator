import { render } from "@testing-library/react";
import { WebAlert } from "./Alert";

describe("Web Alert", () => {
    it("should match snapshot", () => {
        const tree = render(<WebAlert
            severity="success"
            hideModel={false}
            onClose={() => { }}
            children="Test Alert"
        />)
        expect(tree).toMatchSnapshot()
    })
})