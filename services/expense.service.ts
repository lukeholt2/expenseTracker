import { Expense } from '../models/expense';
import { Budget } from '../models/budget';
import axios from 'axios';
import { Lifecycle, scoped } from 'tsyringe';
//import { BehaviorSubject, Observable } from 'rxjs';

@scoped(Lifecycle.ContainerScoped)
export class ExpenseService {

  private get baseEndpoint(){
    return `${process.env.NEXT_PUBLIC_API_URL}/expense`;
  }

//   private currentExpensesSubject: BehaviorSubject<Expense[]>;
//   public currentExpenses$: Observable<Expense[]>;


  constructor() {
    
    //this.currentExpensesSubject = new BehaviorSubject<Expense[]>([]);
    //this.currentExpenses$ = this.currentExpensesSubject.asObservable();
  }


//   public addExpense(expense: Expense, receiptImage?: File) {
//     const endpoint = `${this.baseEndpoint}`;
//     const formData = new FormData();
//     formData.append('expense', JSON.stringify(expense));
//     if (receiptImage) {
//       formData.append('image', receiptImage);
//     }
//     return this.http.post(endpoint, formData);
//   }

//   public editExpense(expense: Expense) {
//     const formData = new FormData();
//     formData.append('expense', JSON.stringify(expense));
//     return this.http.put(this.baseEndpoint, formData);
//   }

//   public delete(expense: Expense) {
//     return this.http.delete(`${this.baseEndpoint}/${expense.id}`);
//   }

//   public getAll(monthOfInterest?: number, yearOfInterest?: number, category?: string): Observable<Expense[]> {
//     const endpoint = `${this.baseEndpoint}`;

//     let queryParams = ;
//     if (monthOfInterest !== undefined) {
//       queryParams = queryParams.append("monthOfInterest", monthOfInterest);
//     }
//     if (yearOfInterest !== undefined) {
//       queryParams = queryParams.append("yearOfInterest", yearOfInterest);
//     }
//     if (category !== undefined) {
//       queryParams = queryParams.append("category", category);
//     }

//     return this.http.get<Expense[]>(endpoint, { params: queryParams })
//       .pipe(map((data: Expense[]) => data.map(d => new Expense().deserialize(d))));
//   }

//   public getCategories(monthOfInterest?: number, yearOfInterest?: number): Observable<string[]> {
//     const endpoint = `${this.baseEndpoint}/Categories`;
//     let queryParams: HttpParams = new HttpParams();
//     if (monthOfInterest !== undefined) {
//       queryParams = queryParams.append("monthOfInterest", monthOfInterest);
//     }
//     if (yearOfInterest !== undefined) {
//       queryParams = queryParams.append("yearOfInterest", yearOfInterest);
//     }
//     return this.http.get<string[]>(endpoint, { params: queryParams });
//   }

//   public loadFromFile(file: File, type: string, append: boolean) {
//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append('fileType', type);
//     formData.append("append", `${append}`);
//     return this.http.post(`${this.baseEndpoint}/load`, formData);
//   }

//   public getRecurring() {
//     const endpoint = `${this.baseEndpoint}/Recurring`;
//     return this.http.get<Expense[]>(endpoint).pipe(map((data: Expense[]) => data.map(d => new Expense().deserialize(d))));
//   }

//   public getPaymentTypes() {
//     const endpoint = `${this.baseEndpoint}/PaymentTypes`;
//     return this.http.get<string[]>(endpoint);
//   }

//   public getYears() {
//     const endpoint = `${this.baseEndpoint}/Years`;
//     return this.http.get<number[]>(endpoint);
//   }



}

export interface TotalBreakdown {
  creditTotals: number[];
  debitTotals: number[];
}

export interface CategoryBreakdown {
  category: string;
  value: number;
}
