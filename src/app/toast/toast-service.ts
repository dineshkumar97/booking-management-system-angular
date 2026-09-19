
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  success(message: string): void {
    this.show(message, 'success');
  }

  error(message: string): void {
    this.show(message, 'error');
  }

  warning(message: string): void {
    this.show(message, 'warning');
  }

  info(message: string): void {
    this.show(message, 'info');
  }

  private show(
    message: string,
    type: 'success' | 'error' | 'warning' | 'info'
  ): void {

    // Remove existing toast
    const existingToast = document.querySelector('.custom-toast');

    if (existingToast) {
      existingToast.remove();
    }

    // Create toast
    const toast = document.createElement('div');

    toast.className = `custom-toast ${type}`;

    // Icon
    const icon = document.createElement('span');
    icon.className = 'toast-icon';

    if (type === 'success') {
      icon.textContent = '✓';
    } else if (type === 'error') {
      icon.textContent = '✕';
    } else if (type === 'warning') {
      icon.textContent = '!';
    } else {
      icon.textContent = 'i';
    }

    // Message
    const text = document.createElement('span');
    text.className = 'toast-message';
    text.textContent = message;

    toast.appendChild(icon);
    toast.appendChild(text);

    document.body.appendChild(toast);

    // Remove after 3 seconds
    setTimeout(() => {
      toast.remove();
    }, 3000);
  }
}