import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user';
import { UpdateModel } from '../models/updateModel';
import { Register } from '../models/register';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private readonly baseEndpoint = `${environment.apiURL}/api/user`;

  #currentUserSubject: BehaviorSubject<User | null > = new BehaviorSubject<User | null>(null);
  public currentUser$: Observable<User | null> = this.#currentUserSubject.asObservable();

  public get currentUserValue() {
    return this.#currentUserSubject.value;
  }

  public get currentUserToken() {
    return this.currentUserValue?.token ?? this.localStorage?.token;
  }


  constructor(private http: HttpClient, private router: Router) {
    const cachedData: any = this.localStorage;
    if(cachedData){
      const id: number =  cachedData.id;
      setTimeout(() => this.http.get(`${this.baseEndpoint}/${id}`)
        .subscribe((user: any) => this.#currentUserSubject.next(user)));
    }
  }

  public login(username: string, password: string) {

    console.log('logging in!')
    const endpoint = `${this.baseEndpoint}/Authenticate`;
    return this.http.post<any>(endpoint, { username, password })
      .pipe(map(user => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        this.localStorage = user;

        return user;
      }));
  }

  private get localStorage() : User | null{
    try{
      return JSON.parse(atob(localStorage.getItem('currentUser') as any));
    } catch(error){
      return null;
    }
  }

  private set localStorage(user: User) {
    localStorage.setItem('currentUser', btoa(JSON.stringify({ id: user.id, token: user.token })));
    this.#currentUserSubject.next(user);
  }

  public logout() {
    // remove user from local storage and set current user to null
    localStorage.removeItem('currentUser');
    this.#currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  public register(user: any) {
    const register = new Register().deserialize(user);
    const endpoint = `${this.baseEndpoint}/Register`;
    return this.http.post(endpoint, register);
  }

  public changePassword(password: string, passwordConfirmation: string) {
    const endpoint = `${this.baseEndpoint}/ChangePassword`;
    const updateModel = new UpdateModel;
    updateModel.username = this.currentUserValue?.username ?? '';
    updateModel.password = password;
    updateModel.passwordConfirmation = passwordConfirmation;
    return this.http.post(endpoint, updateModel);
  }
}
