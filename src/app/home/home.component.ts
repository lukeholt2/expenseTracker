import { Component, OnInit } from '@angular/core';
import { ExpenseService } from '../services/expense.service';
import { Expense } from '../models/expense';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent  implements OnInit {

  constructor(public expenseService: ExpenseService) { }

  total: number = 0;

  ngOnInit() {
    const today = new Date();
    this.expenseService.getAll(today.getMonth(), today.getFullYear())
      .subscribe((data: Expense[]) => {
        this.total = 0;
        data.forEach((expense: Expense) => this.total += expense.amount);
      })
  }

  onAdd(){
    // TODO:
  }

}
