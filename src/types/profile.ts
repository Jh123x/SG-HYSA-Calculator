export default interface Profile {
    Savings: number
    Age: number
    Salary: number
    Spending: number
    Investment: number
    Insurance: number
    GiroTransactions: number
    MonthlyAccIncrease: number
}

export const NewProfile = ({
    Savings = 0,
    Age = 0,
    Salary = 0,
    Spending = 0,
    Investment = 0,
    Insurance = 0,
    GiroTransactions = 0,
    MonthlyAccIncrease = 0,
}): Profile => {
    return {
        Savings,
        Age,
        Salary,
        Spending,
        Investment,
        Insurance,
        GiroTransactions,
        MonthlyAccIncrease,
    }
}