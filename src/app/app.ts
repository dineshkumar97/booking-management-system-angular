import {
  Component,
  signal,
  OnInit,
  PLATFORM_ID,
  inject
} from '@angular/core';

import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { RouterOutlet } from '@angular/router';

import { LoaderService } from './loader-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {

  protected readonly title =
    signal('BMS');

  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);

  private logoutCheckTimer: ReturnType<typeof setInterval> | null = null;

  constructor(
    public loaderService: LoaderService
  ) { }

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    // Check token every 1 second
    this.logoutCheckTimer = setInterval(() => {
      const token = sessionStorage.getItem('authToken');
      // User is not logged in
      if (!token) {
        return;
      }
      try {
        const payload = JSON.parse(
          atob(token.split('.')[1])
        );
        const expiryTime = payload.exp * 1000;
        const remainingTime = expiryTime - Date.now();
        /* console.log('Token remaining:',
          Math.ceil(remainingTime / 1000),
          'seconds'
        ); */
        if (remainingTime <= 0) {
          console.log('JWT expired. Auto logout');
          this.logout();
        }
      } catch (error) {
        console.error('Invalid JWT:', error);
        this.logout();
      }
    }, 1000);
  }

  private logout(): void {
    if (this.logoutCheckTimer) {
      clearInterval(this.logoutCheckTimer);
      this.logoutCheckTimer = null;
    }
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('user_details');
    this.router.navigate(['/login']);
  }
   /*
     @HostListener('document:keydown', ['$event'])
    preventDevTools(event: KeyboardEvent): void {

      // F12
      if (event.key === 'F12') {
        event.preventDefault();
      }

      // Ctrl + Shift + I
      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'i') {
        event.preventDefault();
      }

      // Ctrl + Shift + J
      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'j') {
        event.preventDefault();
      }

      // Ctrl + U
      if (event.ctrlKey && event.key.toLowerCase() === 'u') {
        event.preventDefault();
      }
    }

    @HostListener('document:contextmenu', ['$event'])
    preventRightClick(event: MouseEvent): void {
      event.preventDefault();
    }

  */


}