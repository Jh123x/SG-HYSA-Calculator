import { describe, it, expect } from "vitest";
import { buildComparisonSeries, type ChartSeriesItem } from "./buildSeries";

describe("buildComparisonSeries", () => {
  it("returns empty array for empty bank list", () => {
    expect(buildComparisonSeries([], "yearlyInterest")).toEqual([]);
  });

  it("builds series for known banks", () => {
    const series = buildComparisonSeries(["GXS"], "yearlyInterest");
    expect(series).toHaveLength(1);
    expect(series[0].dataKey).toBe("GXS_yearlyInterest");
    expect(series[0].label).toContain("GXS");
    expect(series[0].showMark).toBe(true);
    expect(series[0].curve).toBe("stepAfter");
  });

  it("uses eir dataKey when metric is eir", () => {
    const series = buildComparisonSeries(["GXS"], "eir");
    expect(series[0].dataKey).toBe("GXS_eir");
  });

  it("cycles colors from lineColors", () => {
    // Need at least 2 banks with valid data
    const series = buildComparisonSeries(["GXS", "Mari Savings Account"], "yearlyInterest");
    expect(series).toHaveLength(2);
    expect(series[0].color).toBeDefined();
    expect(series[1].color).toBeDefined();
    expect(series[0].color).not.toBe(series[1].color);
  });

  it("valueFormatter: yearlyInterest formats as dollar", () => {
    const series = buildComparisonSeries(["GXS"], "yearlyInterest");
    expect(series[0].valueFormatter(123.456)).toBe("$123.46");
  });

  it("valueFormatter: eir formats as percent", () => {
    const series = buildComparisonSeries(["GXS"], "eir");
    expect(series[0].valueFormatter(2.5)).toBe("2.50%");
  });

  it("valueFormatter returns empty for null", () => {
    const series = buildComparisonSeries(["GXS"], "yearlyInterest");
    expect(series[0].valueFormatter(null)).toBe("");
  });
});
