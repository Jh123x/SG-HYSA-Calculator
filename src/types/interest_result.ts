export class ResultInterest {
    private yearly_interest: number
    constructor(yearly: number) {
        this.yearly_interest = parseFloat(yearly.toFixed(2));
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