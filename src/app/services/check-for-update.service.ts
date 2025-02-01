import {ApplicationRef, Injectable} from '@angular/core';
import {SwUpdate} from '@angular/service-worker';
import {concat, interval} from 'rxjs';
import {first} from 'rxjs/operators';
import { AuthenticationService } from './authentication.service';


// service used in checking for and applying updates. See https://angular.dev/ecosystem/service-workers/communications#swupdate-service
@Injectable({providedIn: 'root'})
export class CheckForUpdateService {
  constructor(appRef: ApplicationRef, updates: SwUpdate, authenticationService: AuthenticationService) {
    // Allow the app to stabilize first, before starting
    // polling for updates with `interval()`.
    const appIsStable$ = appRef.isStable.pipe(first((isStable) => isStable === true));
    const everySixHours$ = interval(6 * 60 * 60 * 1000);
    const everySixHoursOnceAppIsStable$ = concat(appIsStable$, everySixHours$);
    everySixHoursOnceAppIsStable$.subscribe(async () => {
      try {
        const updateFound = updates.isEnabled && await updates.checkForUpdate();
        console.log(updateFound ? 'A new version is available.' : 'Already on the latest version.');
        if(updateFound){
          authenticationService.logout();
          document.location.reload();
        }
      } catch (err) {
        console.error('Failed to check for updates:', err);
      }
    });
  }
}