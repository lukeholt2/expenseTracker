import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { Expense } from '../models/expense';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { IonContent, IonLabel, IonList, IonItem, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone'
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.scss'],
  imports: [CommonModule, IonContent, ScrollingModule,
    IonLabel, IonList, IonItem,
    IonGrid, IonRow, IonCol],
  standalone: true
})
export class ListViewComponent {

  @Input() list!: Observable<Expense[]>;

  @Output() onItemSelected: EventEmitter<Expense> = new EventEmitter<Expense>();

  onView(expense: Expense) {
     this.onItemSelected.emit(expense);
  }
}
