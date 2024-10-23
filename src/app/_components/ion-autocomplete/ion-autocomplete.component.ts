import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonItem, IonButton, IonList,
  IonButtons, IonTitle, IonToolbar, IonInput, IonLabel, IonSelect, IonSelectOption
} from '@ionic/angular/standalone'
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-ion-autocomplete',
  templateUrl: './ion-autocomplete.component.html',
  imports: [CommonModule, MatFormFieldModule, ReactiveFormsModule, IonList, IonItem, IonContent, IonButton, IonTitle, IonButtons, IonHeader, IonToolbar, IonInput, IonLabel, IonSelect, IonSelectOption],
  styleUrls: ['./ion-autocomplete.component.scss'],
  standalone: true
})
export class IonAutocompleteComponent implements OnInit {

  @Input() list?: string[] = [];
  
  @Input() label: string = '';

  @Input() value: string = ''

  @Output() onItemSelected: EventEmitter<string> = new EventEmitter<string>();

  focused = false;

  filtered?: Observable<string[]>;

  constructor() { }

  ngOnInit() { }

  toggleFocus() {
    this.focused = !this.focused;
  }

  onSelect(val: string) {
    this.value = val;
    this.onItemSelected.emit(val);
    this.toggleFocus();
  }

  get filteredValues() {
    return this.list?.filter(val => val.toLowerCase().indexOf(this.value.toLowerCase()) === 0);
  }

}
