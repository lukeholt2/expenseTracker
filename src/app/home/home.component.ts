import { Component } from '@angular/core';
import { ExpenseService } from '../services/expense.service';
import { Expense } from '../models/expense';
import { ModalController } from '@ionic/angular';
import { NewExpenseDialogComponent } from '../new-expense-dialog/new-expense-dialog.component';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { addIcons } from 'ionicons';
import { addCircle } from 'ionicons/icons';
import { IonContent, IonFab, IonFabButton, IonIcon, IonList,
     IonItem, IonSelect, IonSelectOption, IonLabel, IonHeader,
     IonGrid, IonRow, IonCol, IonButtons, IonButton,
     IonMenu, IonToolbar, IonMenuButton, IonTitle } from '@ionic/angular/standalone'
import { ListViewComponent } from '../list-view/list-view.component';
import { CommonModule } from '@angular/common';
import { Filter } from '../models/filter';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [CommonModule, 
    ListViewComponent, IonContent, IonFab, IonLabel,
    IonFabButton, IonIcon, IonList, IonItem, IonHeader,
    IonSelect, IonSelectOption, IonButtons, IonButton,
    IonGrid, IonRow, IonCol, IonTitle,
    IonMenu, IonToolbar, IonMenuButton
  ],
  standalone: true
})
export class HomeComponent {

  constructor(public expenseService: ExpenseService, 
              private modalCtrl: ModalController) {
    // manually add the circle icon... cause for some reason this is needed
    addIcons({ addCircle })
    const date = new Date();
    this.expenseFilter = {
      month: date.getMonth() + 1,
      year: date.getFullYear(),
      category: 'All'
    };
    // hack the event handler to also set our default values
    this.updateFilter({ target: { value: 'Month' } });
  }

  total: number = 0;
  listFilters: string[] = ['All', 'Month', 'Year'];

  categories: string[] = ['All']

  #expenses: BehaviorSubject<Expense[]> = new BehaviorSubject<Expense[]>([])
  expenses$: Observable<Expense[]> = this.#expenses.asObservable();

  expenseFilter: Filter;

  private updateExpenseList() {
    this.expenseService
      .getAll(this.expenseFilter?.month, this.expenseFilter?.year, this.expenseFilter.category)
      .pipe(tap((expenses: Expense[]) => {
        this.total = 0;
        expenses.forEach((expense: Expense) => this.total += expense.amount);
      })).subscribe((data: Expense[]) => {
        this.#expenses.next(data.reverse()) // reverse the list to get it loosely in chronological order
      });
      // when the list updates, the available categories should also be updated
      // that way we don't see any categories that are irrelevant in the current context
      this.expenseService.getCategories(this.expenseFilter?.month, this.expenseFilter?.year)
        .subscribe((data) => {
          this.categories = [
            'All',
            ...data
          ]
      });
  }

  updateCategory(event: any){
    this.expenseFilter.category = event.detail.value;
    this.updateExpenseList();
  }

  updateFilter(event: any) {
    const listFilter: string = event.target.value;
    console.log(listFilter);
    const today = new Date();
    switch (listFilter.toUpperCase()) {
      case 'ALL': {
        this.expenseFilter.month = this.expenseFilter.year = undefined;
        break;
      }
      case 'MONTH': {
        this.expenseFilter.month = today.getMonth() + 1;
        this.expenseFilter.year ??= today.getFullYear();
        break;
      }
      case 'YEAR': {
        this.expenseFilter.month = undefined;
        this.expenseFilter.year ??= today.getFullYear();
        break;
      }
      default:
        break;
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
      this.expenseService.addExpense(data)
        .subscribe(() => this.updateExpenseList());
    }
  }
}
