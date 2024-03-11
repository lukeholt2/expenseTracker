import { Component, OnInit } from '@angular/core';
import { ExpenseService } from '../services/expense.service';
import { Expense } from '../models/expense';
import { ModalController } from '@ionic/angular';
import { NewExpenseDialogComponent } from '../new-expense-dialog/new-expense-dialog.component';


interface ListFilters {
  month: number;
  year: number
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  constructor(public expenseService: ExpenseService, private modalCtrl: ModalController) {
    const today = new Date();
    this.expenseFilter = {
      month: today.getMonth(),
      year: today.getMonth()
    }
  }

  total: number = 0;
  listFilter: string = 'all'

  expenseFilter: ListFilters;

  ngOnInit() {
    this.expenseService.getAll(this.expenseFilter.month, this.expenseFilter.year)
      .subscribe((data: Expense[]) => {
        this.total = 0;
        data.forEach((expense: Expense) => this.total += expense.amount);
      })
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
