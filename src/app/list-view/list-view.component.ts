import { Component, ComponentRef, Input, OnInit, model, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Expense } from '../models/expense';
import { ModalController } from '@ionic/angular';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { IonContent, IonLabel, IonList, IonItem, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone'
import { CommonModule } from '@angular/common';
import { NewExpenseDialogComponent } from '../new-expense-dialog/new-expense-dialog.component';
import { ExpenseService } from '../services/expense.service';

@Component({
  selector: 'app-list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, IonContent, ScrollingModule,
    IonLabel, IonList, IonItem,
    IonGrid, IonRow, IonCol],
  standalone: true
})
export class ListViewComponent {

  @Input() list!: Observable<Expense[]>;

  @Output() onItemSelected: EventEmitter<Expense> = new EventEmitter<Expense>();

  onView(expense: Expense) {
     this.onItemSelected.emit(expense)
  }
}
