import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication.service';

interface LoginForm{
  username: FormControl<string>;
  password: FormControl<string>;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  allowRegistration: boolean = true;

  loginForm: FormGroup<LoginForm>;
  loading = false;
  submitted = false;
  returnUrl: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
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

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm?.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm?.invalid) {
      return;
    }

    this.loading = true;
    this.authenticationService.login(this.f?.username.value ?? '', this.f?.password.value ?? '')
      .pipe(first())
      .subscribe(
        (data: any) => {
          this.loading = false;
          if (data.passwordChangeRequired) {
            this.router.navigate(['../passwordChange'], { relativeTo: this.route });
          }
          else {
            this.router.navigate([this.returnUrl]);
          }
        },
        (error: any) => {
            this.loading = false;
        });
  }
}
