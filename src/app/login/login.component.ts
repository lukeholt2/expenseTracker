import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication.service';
import { IonContent, IonInput, IonButton, ToastController } from '@ionic/angular/standalone';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface LoginForm {
  username: FormControl<string>;
  password: FormControl<string>;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [CommonModule, IonContent, IonInput, IonButton, MatFormFieldModule, ReactiveFormsModule],
  standalone: true
})
export class LoginComponent implements OnInit {

  allowRegistration: boolean = true;

  loginForm: FormGroup<LoginForm>;
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private toastController: ToastController,
    private authenticationService: AuthenticationService
  ) {
    this.loginForm = this.formBuilder.group<LoginForm>({
      username: new FormControl<any>('', Validators.required),
      password: new FormControl<any>('', Validators.required)
    });

  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group<LoginForm>({
      username: new FormControl<any>('', Validators.required),
      password: new FormControl<any>('', Validators.required)
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm?.controls; }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'bottom',
    });

    await toast.present();
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm?.invalid) {
      return;
    }

    this.loading = true;
    this.authenticationService.login(this.f?.username.value ?? '', this.f?.password.value ?? '')
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          this.loginForm.reset();
          this.loading = false;
          this.router.navigate(['/']);
        },
        error:async (error: any) => {
          this.loading = false;
          this.presentToast(error.message ?? error);
      }});
  }
}
