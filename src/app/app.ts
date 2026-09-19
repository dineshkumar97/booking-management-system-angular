import { Component, HostListener, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoaderService } from './loader-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('bookingmanagementangular');
  constructor(
    public loaderService: LoaderService
  ) { }
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
