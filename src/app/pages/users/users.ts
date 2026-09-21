import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';

import { UserService, User } from './user-service';
import { isPlatformBrowser } from '@angular/common';
// import { CommonDatePipe } from '../../common/common-date.pipe';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [],
  templateUrl: './users.html',
  styleUrl: './users.scss'
})
export class Users implements OnInit {

  users = signal<User[]>([]);
  private platformId = inject(PLATFORM_ID);
  constructor(private userService: UserService) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.getUsers();
    }
  }

  getUsers(): void {

    this.userService.getUsers().subscribe({

      next: (response) => {
        console.log('Users API response:', response);
        this.users.set(response);
      },

      error: (error) => {
        console.error('Users API error:', error);
      }

    });

  }

}