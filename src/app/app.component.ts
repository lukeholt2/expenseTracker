import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonApp, IonRouterOutlet,
  IonTitle,  IonItem, IonLabel, IonList,
  IonHeader, IonContent,
  IonMenu, IonToolbar, IonMenuButton} from '@ionic/angular/standalone'
import { AuthenticationService } from './services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [IonApp, IonRouterOutlet, IonTitle,
    IonItem, IonLabel, IonList, IonHeader, IonContent,
    IonMenu, IonToolbar, IonMenuButton],
  standalone: true
})
export class AppComponent {
  constructor(private authenticationService: AuthenticationService,
              private router: Router) {}

  logout(){
    this.authenticationService.logout();
    this.router.navigate(['/login'])
  }

  navigate(route: string){
    this.router.navigate([route])
  }
}
