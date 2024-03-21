import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Expense } from '../models/expense';
import { IonContent, IonLabel, IonList, IonItem, IonInfiniteScroll, IonInfiniteScrollContent } from '@ionic/angular/standalone'
import { CommonModule } from '@angular/common';

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
  constructor() { }

  ngOnInit() {
    this.updateList.subscribe((data) => this.list = data);
  }

}
