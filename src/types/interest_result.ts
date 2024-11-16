export class ResultInterest {
    private yearly_interest: number
    constructor(yearly: number) {
        this.yearly_interest = yearly;
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