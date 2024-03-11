import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Expense } from '../models/expense';

@Component({
  selector: 'app-list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.scss'],
})
export class ListViewComponent  implements OnInit {


  @Input() updateList!: Observable<Expense[]>;
  
  list: Expense[] = [];
  constructor() { }

  ngOnInit() {
    this.updateList.subscribe((data) => this.list = data);
  }

}
