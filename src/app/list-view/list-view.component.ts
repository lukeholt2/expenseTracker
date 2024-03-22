import { Component, ComponentRef, Input, OnInit, model } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Expense } from '../models/expense';
import { ModalController } from '@ionic/angular';
import { IonContent, IonLabel, IonList, IonItem, IonInfiniteScroll, IonInfiniteScrollContent } from '@ionic/angular/standalone'
import { CommonModule } from '@angular/common';
import { NewExpenseDialogComponent } from '../new-expense-dialog/new-expense-dialog.component';
import { ExpenseService } from '../services/expense.service';

@Component({
  selector: 'app-list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.scss'],
  imports: [CommonModule, IonContent, IonLabel, IonList, IonItem, IonInfiniteScroll, IonInfiniteScrollContent],
  standalone: true
})
export class ListViewComponent  implements OnInit {


  @Input() updateList!: Observable<Expense[]>;
  
  list: Expense[] = [];
  
  constructor(public expenseService: ExpenseService, private modalCtrl: ModalController) { }

  ngOnInit() {
    this.updateList.subscribe((data) => this.list = data);
  }

  async onView(expense: Expense) {
    const modal = await this.modalCtrl.create({
      component: NewExpenseDialogComponent,
      componentProps: {
        expense: expense
      }
    });
    
    modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (role == 'confirm') {
      this.expenseService.addExpense(data).subscribe((data) => console.log(data));
    }
  }
}
