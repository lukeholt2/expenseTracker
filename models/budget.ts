export class Budget {
    public id: number = 0;
    public monthlyLimit: number = 0;
    public monthlyIncome: number = 0;
    public categoryLimits: any[] = [];

    public mapCategories() : any[] | undefined {
        return this.categoryLimits?.map((cat, index) => {
            console.log(cat);
            return {
                key: `${index + 1}`,
                Category: cat.category,
                Budgeted: cat.limit,
                Spent: cat.actual,
                Available: cat.limit - cat.actual
            }
        })
    }
}