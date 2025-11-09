import { describe, expect, it } from "@jest/globals";
import { getUpcomingWeekendDates, isWeekend } from "@/lib/utils";

describe("weekend helpers", () => {
  it("returns only saturday or sunday", () => {
    const dates = getUpcomingWeekendDates(4);
    expect(dates).toHaveLength(4);
    dates.forEach((date) => expect(isWeekend(date)).toBe(true));
  });
});
