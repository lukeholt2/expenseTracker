import { Component } from '@angular/core';
import { ExpenseService } from '../services/expense.service';
import { Expense } from '../models/expense';
import { ModalController } from '@ionic/angular';
import { NewExpenseDialogComponent } from '../new-expense-dialog/new-expense-dialog.component';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import {IONIC_DIRECTIVES} from 'ionic-angular';

interface ListFilters {
  month?: number;
  year?: number
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  directives: [IONIC_DIRECTIVES]
})
export class HomeComponent {

  constructor(public expenseService: ExpenseService, private modalCtrl: ModalController) {
    // hack the event handler to also set our default values
    this.updateFilter({ target: { value: 'Month' } });
  }

  total: number = 0;
  listFilters: string[] = ['All', 'Month', 'Year'];

  #expenses: BehaviorSubject<Expense[]> = new BehaviorSubject<Expense[]>([])
  expenses$: Observable<Expense[]> = this.#expenses.asObservable();

  // HACK: some of the filtering feels pretty hacky
  expenseFilter: ListFilters = {
    month: undefined,
    year: undefined
  };

  private updateExpenseList() {
    console.log(this.expenseFilter);
    this.expenseService
      .getAll(this.expenseFilter?.month, this.expenseFilter?.year)
      .pipe(tap((expenses: Expense[]) => {
        this.total = 0;
        expenses.forEach((expense: Expense) => this.total += expense.amount);
      }))
      .subscribe((data: Expense[]) => this.#expenses.next(data));
  }

  updateFilter(event: any) {
    const listFilter = event.target.value;
    const today = new Date();
    if (listFilter == 'All') {
      this.expenseFilter.month = this.expenseFilter.year = undefined;
    } else if (listFilter == 'Month') {
      this.expenseFilter = {
        month: today.getMonth() + 1,
        year: today.getFullYear()
      }
    } else {
      this.expenseFilter = {
        month: undefined,
        year: today.getFullYear()
      }
    }
    this.updateExpenseList();
  }

  async onAdd() {
    const modal = await this.modalCtrl.create({
      component: NewExpenseDialogComponent,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (role == 'confirm') {
      this.expenseService.addExpense(data).subscribe((data) => console.log(data));
    }
  }


}
