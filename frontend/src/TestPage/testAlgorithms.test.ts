import { expect, it } from "vitest";
import { getNextTestDate, MILLIS_PER_DAY, RECALL_UNDER_THRESHOLD_MS } from "./testAlgorithms";

it("correctly calculates next test date", () => {
  const getRelativeNextTestDate = (msUserTookToRecallCorrectly: number, timesRecalledUnderThreshold: number) => {
    return getNextTestDate({ lastTestUnixMs: 0, msUserTookToRecallCorrectly, timesRecalledUnderThreshold }, 1) / MILLIS_PER_DAY;
  };
  expect(getRelativeNextTestDate(RECALL_UNDER_THRESHOLD_MS, 0)).toBe(2);
  expect(getRelativeNextTestDate(RECALL_UNDER_THRESHOLD_MS * 2, 0)).toBe(0.25);
  expect(Math.round(getRelativeNextTestDate(RECALL_UNDER_THRESHOLD_MS * 3, 0)*100)/100).toBe(0.07);
  expect(getRelativeNextTestDate(RECALL_UNDER_THRESHOLD_MS, 1)).toBe(4);
});