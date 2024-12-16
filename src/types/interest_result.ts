export class ResultInterest {
    private yearly_interest: number
    private savings: number
    constructor(yearly: number, savings: number) {
        this.yearly_interest = parseFloat(yearly.toFixed(2)) ?? 0;
        this.savings = savings
    }

    toYearlyPercent(): number {
        if (this.savings === 0) return 0

        return (this.yearly_interest / this.savings * 100);
    }

    toYearly(): number {
        return this.yearly_interest
    }

    toMonthly(): number {
        return this.yearly_interest / 12
    }

    toDaily(): number {
        return this.yearly_interest / 365
    }
}