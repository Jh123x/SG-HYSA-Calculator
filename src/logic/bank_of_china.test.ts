import { ResultInterest } from "../types/interest_result.ts";
import { NewProfile } from "../types/profile.ts";
import { bank_of_china_super_saver_07_2025 } from "./bank_of_china.ts";


describe("Bank of China Smart Saver", () => {
    it("should return the correctly based on their example", () => {
        const profile = NewProfile({ Savings: 100_000, });
        const result = bank_of_china_super_saver_07_2025(profile);
        expect(result).toEqual(new ResultInterest(300 + 880 + 1440, 100_000));
    });
});
