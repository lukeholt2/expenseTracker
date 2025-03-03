export class Filter {
    month?: number;
    year?: number ;
    category: string = 'All'

    constructor(){
        const date = new Date(Date.now());
        this.month = date.getMonth() + 1;
        this.year = date.getFullYear();
    }

}