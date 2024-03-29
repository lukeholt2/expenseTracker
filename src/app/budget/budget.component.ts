import { Component, OnInit } from '@angular/core';
import { Budget } from '../models/budget';
import { ExpenseService } from '../services/expense.service';
import { CommonModule } from '@angular/common';
import { 
  IonContent, IonLabel, IonList, IonItem, 
  IonInfiniteScroll, IonInfiniteScrollContent, IonTitle,
  IonGrid, IonRow, IonCol, IonMenuButton, IonToolbar, IonButtons  } from '@ionic/angular/standalone'

@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.scss'],
  imports: [
    CommonModule, IonContent, IonLabel, 
    IonList, IonItem, IonInfiniteScroll, IonTitle,
    IonInfiniteScrollContent, IonGrid, IonButtons,
    IonRow, IonCol, IonMenuButton, IonToolbar],
  standalone: true
})
export class BudgetComponent  implements OnInit {

  public budget: Budget;

  public monthTitle: string;
  public total: number = 0;

  public headers: string[] = ["Category", "Projected", "Actual", "remove"];

  constructor(private expenseService: ExpenseService) {
    this.budget = new Budget();
    const today = new Date();
    this.monthTitle = `TEST`
  }

  ngOnInit(): void {
    this.expenseService.getBudget()
      .subscribe(budget => {
        this.budget = budget;
        this.budget.categoryLimits?.forEach((value) => this.total += value.actual);
      });
  }

  public updateBudgetSettings() {
    this.expenseService.updateBudget(this.budget)
      .subscribe((budget: Budget) => this.budget = budget);
  }


  public removeCategory(category: string) {
    this.budget.categoryLimits = this.budget.categoryLimits?.filter(limits => limits.category !== category);
    this.updateBudgetSettings();
  }

  public addCategory() {
    this.budget.categoryLimits?.push({ category: `Category${this.budget.categoryLimits.length}`, limit: 0, actual: 0 });
    this.updateBudgetSettings();
  }

}
