import { Component, OnInit } from '@angular/core';
import { ExpenseService } from '../services/expense.service';
import { Expense } from '../models/expense';
import { ModalController } from '@ionic/angular';
import { NewExpenseDialogComponent } from '../new-expense-dialog/new-expense-dialog.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent  implements OnInit {

  constructor(public expenseService: ExpenseService, private modalCtrl: ModalController) { }

  total: number = 0;

  ngOnInit() {
    const today = new Date();
    this.expenseService.getAll(today.getDate(), today.getMonth())
      .subscribe((data: Expense[]) => {
        this.total = 0;
        data.forEach((expense: Expense) => this.total += expense.amount);
      })
  }

  async onAdd(){
    const modal = await this.modalCtrl.create({
      component: NewExpenseDialogComponent,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();
    if(role == 'confirm'){
      this.expenseService.addExpense(data).subscribe((data) => console.log(data));
    }
  }


}
