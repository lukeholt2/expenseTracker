import { Component, EventEmitter, Input, OnInit, Output , ViewChild} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { Expense } from '../models/expense';
import { ExpenseService } from '../services/expense.service';
import { map, startWith } from 'rxjs/operators';
import { ModalController } from '@ionic/angular';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonButton, IonButtons, IonTitle, IonToolbar, IonInput, IonLabel, IonSelect, IonSelectOption } from '@ionic/angular/standalone'
import { CommonModule } from '@angular/common';

interface IExpenseForm{
  id: FormControl<number>;
  date: FormControl<any>,
  amount: FormControl<number>,
  item:FormControl<string>,
  location:FormControl<string>,
  paymentType: FormControl<string>,
  category: FormControl<string>,
}

@Component({
  selector: 'app-new-expense-dialog',
  templateUrl: './new-expense-dialog.component.html',
  styleUrls: ['./new-expense-dialog.component.scss'],
  imports: [CommonModule, MatFormFieldModule, ReactiveFormsModule, IonContent, IonButton, IonTitle, IonButtons, IonHeader, IonToolbar, IonInput, IonLabel, IonSelect, IonSelectOption],
  standalone: true
})
export class NewExpenseDialogComponent implements OnInit {

  @Input() expense?: Expense;


  public title: string = 'Add';
  public customType: string = '';

  filteredCategories?: Observable<string[]>;
  public availableCategories?: string[];


  /** Form group containing the new expense values */
  public form!: FormGroup<IExpenseForm>;

  #paymentTypesSubject: BehaviorSubject<string[]> = new BehaviorSubject<string[]>(['Direct', 'Credit']);
  public paymentTypes: Observable<string[]> = this.#paymentTypesSubject.asObservable();
  #receipt?: File;

  constructor(private formbuilder: FormBuilder,
              private modalCtrl: ModalController,
    private expenseService: ExpenseService) {
  }

  ngOnInit(): void {
    if(this.expense){
      this.title = 'Edit'
    }
    this.setExpense(this.expense);
    // this.filteredCategories = this.form?.controls['category'].valueChanges
    //   .pipe(
    //     startWith(''),
    //     map(state => state ? this.filterCategories(state) : this.availableCategories?.slice())
    //   );
    this.expenseService.getPaymentTypes().subscribe({
      next: (types: string[]) => {
        if (types && types.length > 0)
          this.#paymentTypesSubject.next(types);
      }
    });
  }

  setExpense(expense?: Expense){
    expense ??= new Expense();
    this.form = this.formbuilder.group<IExpenseForm>({
      id: new FormControl<any>(expense.id),
      date: new FormControl<any>(new Date(expense.date).toISOString().slice(0, 10), Validators.required),
      amount: new FormControl<any>(expense.amount, [Validators.required]),
      item: new FormControl<any>(expense.item, Validators.required),
      location: new FormControl<any>(expense.location, Validators.required),
      paymentType: new FormControl<any>(expense.paymentType, Validators.required),
      category: new FormControl<any>(expense.category),
    });
  }

  /** Helper to grab the current form controls */
  public get f(){
    return this.form?.controls;
  }


  public SendExpense() {
    const expenseToAdd: Expense = new Expense({
      id: this.f?.id.value,
      date: new Date(new Date(this.f?.date?.value ?? '').toUTCString()),
      amount: this.f?.amount?.value,
      item: this.f?.item?.value,
      location: this.f?.location?.value,
      paymentType: this.f?.paymentType?.value,
      category: this.f?.category?.value,
      reciept: this.#receipt
    });

    this.modalCtrl?.dismiss(expenseToAdd, 'confirm');
  }

  public cancel(){  
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  public addReceipt(event: any) {
    this.#receipt = event.target.files[0];
  }

  public onCustomType() {
    if (this.customType && this.customType !== 'Other') {
      this.form?.patchValue({'paymentType': this.customType});
      this.#paymentTypesSubject.value.push(this.customType);
    }
    this.customType = '';
  }

  public customTypeDisabled() {
    return !this.customType || this.customType === '' || this.customType === 'Other'
  }

  public UpdateCategory(cat: string){
    this.form?.patchValue({ 'category': cat });
  }

  filterCategories(name: string) {
    return this.availableCategories?.filter(category => category.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }

}
