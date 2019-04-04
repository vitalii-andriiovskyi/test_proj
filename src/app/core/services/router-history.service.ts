import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RouterHistoryService {

  private previousUrl: string;
  private currentUrl: string;

  constructor(private router: Router) {
    this.currentUrl = '';
    this.previousUrl = '';

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      tap((e: NavigationEnd) => {
        this.previousUrl = this.currentUrl;
        this.currentUrl = e.url;
        // console.log('prev:', this.previousUrl);
        // console.log('curr:', this.currentUrl);
      })
    )
    .subscribe();
  }

  public getPreviousUrl() {
    return this.previousUrl;
  }
}
