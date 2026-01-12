import * as React from "react";
import { render } from "@testing-library/react";
import { WebAlert } from "./Alert";

describe("Web Alert", () => {
  it("should match snapshot", () => {
    const { asFragment } = render(
      <WebAlert
        severity="success"
        hideModel={false}
        onClose={() => {}}
        children="Test Alert"
      />,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
