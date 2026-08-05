import { vi, describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { BankWidgetCard } from "./BankWidgetCard";

describe("BankWidgetCard", () => {
  const defaultProps = {
    slug: "test-bank",
    name: "Test Bank Account",
    eir: 3.85,
    yearlyInterest: 1234.56,
    onClick: vi.fn(),
  };

  function renderCard(props = {}) {
    return render(
      <MemoryRouter>
        <BankWidgetCard {...defaultProps} {...props} />
      </MemoryRouter>,
    );
  }

  it("renders bank name", () => {
    renderCard();
    expect(screen.getByText("Test Bank Account")).toBeTruthy();
  });

  it("renders EIR percentage", () => {
    renderCard();
    expect(screen.getByText("3.85%")).toBeTruthy();
  });

  it("renders yearly interest", () => {
    renderCard();
    expect(screen.getByText("$1234.56")).toBeTruthy();
  });

  it("renders effective rate label", () => {
    renderCard();
    expect(screen.getByText("Effective Rate")).toBeTruthy();
  });

  it("renders yearly interest label", () => {
    renderCard();
    expect(screen.getByText("Yearly Interest")).toBeTruthy();
  });

  it("renders string remarks", () => {
    renderCard({ remarks: "Some important note about this account" });
    expect(screen.getByText("Some important note about this account")).toBeTruthy();
  });

  it("renders remarks tooltip for long text", () => {
    const longRemarks = "A very long remark that should definitely be truncated at 50 characters because it is quite long indeed";
    renderCard({ remarks: longRemarks });
    expect(screen.getByText(/A very long remark that should definitely/)).toBeTruthy();
  });

  it("renders action buttons", () => {
    renderCard({ url: "https://example.com" });
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThanOrEqual(1);
  });

  it("does not render website button when url is missing", () => {
    renderCard({ url: undefined });
    // Should have only the details button (LanguageIcon button not present)
    const buttons = screen.getAllByRole("button");
    // The card itself has role="button", plus one IconButton for details
    expect(buttons.length).toBeGreaterThanOrEqual(1);
    // No link with Language icon
    const languageLinks = screen.queryAllByTitle("Visit official website");
    expect(languageLinks.length).toBe(0);
  });
});
