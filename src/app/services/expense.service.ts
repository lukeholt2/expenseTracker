import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Expense } from '../models/expense';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Budget } from '../models/budget';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  private readonly baseEndpoint = `${environment.apiURL}/api/expense`;

  #currentExpensesSubject: BehaviorSubject<Expense[]>;
  public currentExpenses$: Observable<Expense[]>;

  constructor(private http: HttpClient) {
    this.#currentExpensesSubject = new BehaviorSubject<Expense[]>([]);
    this.currentExpenses$ = this.#currentExpensesSubject.asObservable();
  }
  
  public updateBudget(budget: Budget){
    const endpoint = `${this.baseEndpoint}/Budget`;
    return this.http.put(endpoint, budget);
  }

  public addExpense(expense: Expense, receiptImage?: File) {
    const endpoint = `${this.baseEndpoint}`;
    const formData = new FormData();
    formData.append('expense', JSON.stringify(expense));
    if(receiptImage){
      formData.append('image', receiptImage);
    }
    return this.http.post(endpoint, formData);
  }

  public editExpense(expense: Expense){
      return this.http.put(this.baseEndpoint, expense);
  }

  public delete(expense: Expense){
      return this.http.delete(`${this.baseEndpoint}/${expense.id}`);
  }

  public getAll(monthOfInterest?: number, yearOfInterest?: number) : Observable<Expense[]> {
    const endpoint = `${this.baseEndpoint}`;

    let queryParams: HttpParams = new HttpParams();
    if(monthOfInterest !== undefined){
      queryParams = queryParams.append("monthOfInterest", monthOfInterest);
    }
    if(yearOfInterest !== undefined){
      queryParams = queryParams.append("yearOfInterest", yearOfInterest);
    }

    return this.http.get<Expense[]>(endpoint, { params: queryParams} )
      .pipe(map((data: Expense[]) => data.map(d => new Expense().deserialize(d))));
  }

  public loadFromFile(file: File, type: string, append: boolean){
    const formData = new FormData();
    formData.append("file", file);
    formData.append('fileType', type);
    formData.append("append", `${append}`);
    return this.http.post(`${this.baseEndpoint}/load`, formData);
  }

  public getRecurring(){
    const endpoint = `${this.baseEndpoint}/Recurring`;
    return this.http.get<Expense[]>(endpoint).pipe(map((data: Expense[]) => data.map(d => new Expense().deserialize(d))));
  }

  public getPaymentTypes(){
    const endpoint = `${this.baseEndpoint}/PaymentTypes`;
    return this.http.get<string[]>(endpoint);
  }

  public getYears(){
    const endpoint = `${this.baseEndpoint}/Years`;
    return this.http.get<number[]>(endpoint);
  }

  public getCategories(){
    const endpoint = `${this.baseEndpoint}/Categories`;
    return this.http.get<string[]>(endpoint);
  }

  public getBudget(){
    const endpoint = `${this.baseEndpoint}/Budget`;
    return this.http.get<Budget>(endpoint);
  }

}

export interface TotalBreakdown {
  creditTotals: number[];
  debitTotals: number[];
}

export interface CategoryBreakdown {
  category: string;
  value: number;
}
