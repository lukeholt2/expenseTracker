import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonApp, IonRouterOutlet,
  IonTitle,  IonItem, IonLabel, IonList, IonTabButton,
  IonHeader, IonContent, IonTabBar, IonTabs, IonIcon,
  IonMenu, IonToolbar, IonMenuButton} from '@ionic/angular/standalone'
import { AuthenticationService } from './services/authentication.service';
import { addIcons } from 'ionicons';
import { walletOutline, logOutOutline, cashOutline } from 'ionicons/icons';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [CommonModule, IonApp, IonRouterOutlet, IonTitle, IonTabBar, IonTabs, IonTabButton,
    IonItem, IonLabel, IonList, IonHeader, IonContent, IonIcon,
    IonMenu, IonToolbar, IonMenuButton],
  standalone: true
})
export class AppComponent {
  constructor(public authenticationService: AuthenticationService,
              private router: Router) {
                addIcons({ walletOutline, logOutOutline, cashOutline });
              }

  logout(){
    this.authenticationService.logout();
  }

  navigate(route: string){
    this.router.navigate([route])
  }
}
