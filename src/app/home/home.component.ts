import { Component } from '@angular/core';
import { ExpenseService } from '../services/expense.service';
import { Expense } from '../models/expense';
import { ModalController } from '@ionic/angular';
import { NewExpenseDialogComponent } from '../new-expense-dialog/new-expense-dialog.component';
import { BehaviorSubject, Observable, Subscription, filter, map, tap } from 'rxjs';
import { addIcons } from 'ionicons'; 
import { addCircle } from 'ionicons/icons';
import { IonContent, IonFab, IonFabButton, IonIcon, IonList, IonItem, IonSelect, IonSelectOption } from '@ionic/angular/standalone'
import { ListViewComponent } from '../list-view/list-view.component';
import { CommonModule } from '@angular/common';
import { Filter } from '../models/filter';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [CommonModule, ListViewComponent, IonContent, IonFab, IonFabButton, IonIcon, IonList, IonItem, IonSelect, IonSelectOption],
  standalone: true
})
export class HomeComponent {

  constructor(public expenseService: ExpenseService, private modalCtrl: ModalController) {
    // manually add the circle icon... cause for some reason this is needed
    addIcons({addCircle})
    const date = new Date();
    this.expenseFilter = {
      month: date.getMonth() + 1,
      year: date.getFullYear(),
      category: 'All'
    };
    // hack the event handler to also set our default values
    this.updateFilter({ target: { value: 'All' } });
    this.expenseService.getCategories().subscribe((data) => {
      this.categories = [
        'All',
        ...data
      ]
    })
  }

  total: number = 0;
  listFilters: string[] = ['All', 'Month', 'Year'];

  categories: string[] = ['All']

  #subscription?: Subscription;
  #expenses: BehaviorSubject<Expense[]> = new BehaviorSubject<Expense[]>([])
  expenses$: Observable<Expense[]> = this.#expenses.asObservable();

  // HACK: some of the filtering feels pretty hacky
  expenseFilter: Filter;

  private updateExpenseList() {
    // if(this.#subscription){
    //   this.#subscription.unsubscribe();
    // }
    let observable = this.expenseService
      .getAll(this.expenseFilter?.month, this.expenseFilter?.year)
      .pipe(
        map((data: Expense[]) => {
          return this.expenseFilter.category != 'All' 
            ? data.filter(d => d.category == this.expenseFilter.category)
            : data;
        }),
        tap((expenses: Expense[]) => {
        this.total = 0;
        expenses.forEach((expense: Expense) => this.total += expense.amount);
      }));

      this.#subscription = observable.subscribe((data: Expense[]) => {
        this.#expenses.next(data)
      });
  }

  updateCategory(value: any){
    this.expenseFilter.category = value.detail.value;
    this.updateExpenseList();
  }

  updateFilter(event: any) {
    const listFilter = event.target.value;
    const today = new Date();
    if (listFilter == 'All') {
      this.expenseFilter.month = this.expenseFilter.year = undefined;
    } else if (listFilter == 'Month') {
      this.expenseFilter = {
        month: today.getMonth() + 1,
        year: today.getFullYear(),
        category: this.expenseFilter.category
      }
    } else {
      this.expenseFilter = {
        month: undefined,
        year: today.getFullYear(),
        category: this.expenseFilter.category
      }
    }
    console.log(this.expenseFilter);
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
