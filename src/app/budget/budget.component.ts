import { Component, OnInit } from '@angular/core';
import { Budget } from '../models/budget';
import { ExpenseService } from '../services/expense.service';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { trash } from 'ionicons/icons';
import { 
  IonContent, IonLabel, IonList, IonItem, IonIcon,
  IonInfiniteScroll, IonInfiniteScrollContent, IonTitle, IonItemSliding, IonItemOption, IonItemOptions,
  IonGrid, IonRow, IonCol, IonMenuButton, IonToolbar, IonButtons, IonButton, IonInput  } from '@ionic/angular/standalone'

@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.scss'],
  imports: [
    CommonModule, IonContent, IonLabel, IonButton, IonIcon,
    IonList, IonItem, IonInfiniteScroll, IonTitle, IonInput,
    IonInfiniteScrollContent, IonGrid, IonButtons,
    IonItemSliding, IonItemOption, IonItemOptions,
    IonRow, IonCol, IonMenuButton, IonToolbar],
  standalone: true
})
export class BudgetComponent  implements OnInit {

  public budget: Budget;

  public monthTitle: string = '';
  public totalProjected: number = 0;
  public totalActual: number = 0;

  public headers: string[] = ["Category", "Projected", "Actual", "remove"];

  constructor(private expenseService: ExpenseService) {
    addIcons({ trash })
    this.budget = new Budget();
  }

  ngOnInit(): void {
    this.expenseService.getBudget()
      .subscribe(budget => {
        this.budget = budget;
        this.budget.categoryLimits?.forEach((value) => {
            this.totalActual += value.actual;
            this.totalProjected += value.limit;
          });
      });
  }

  updateCategory(event: any, index: number){
    if(this.budget.categoryLimits && index < this.budget.categoryLimits.length){
      this.budget.categoryLimits[index].category = event.target.value;
      this.updateBudgetSettings();
    }
  }

  updateLimit(event: any, index: number){
    if(this.budget.categoryLimits && index < this.budget.categoryLimits.length){
      this.budget.categoryLimits[index].limit = event.target.value;
      this.updateBudgetSettings();
    }
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
