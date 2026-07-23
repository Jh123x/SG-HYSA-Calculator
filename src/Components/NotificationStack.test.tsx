import { render } from "@testing-library/react";
import { expect, it, describe } from "vitest";
import { NotificationStack } from "./NotificationStack";

describe("NotificationStack", () => {
  it("should match snapshot", () => {
    const { asFragment } = render(<NotificationStack><div>TestCode</div></NotificationStack>);
    expect(asFragment()).toMatchSnapshot();
  })
})

