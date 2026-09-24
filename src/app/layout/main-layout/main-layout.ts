import { Component, computed, effect, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { Router, RouterLink, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { LoginService } from '../../auth/login/login-service';
import { isPlatformBrowser } from '@angular/common';
import { SocketService, AvailabilityStatus } from '../../core/socket.service';
interface MenuItem {
  label: string;
  icon: string;
  route: string;
}
@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout implements OnInit {
  isDropdownOpen = signal(false);
  socketConnected = false;
  socketId = '';
  activeMenu = signal('Dashboard');
  userName = signal('');
  profileImage = '';
  private platformId = inject(PLATFORM_ID);
  userDetails: any;
  constructor(private router: Router, private loginService: LoginService, private socketService: SocketService) {
  }

  menuItems = signal<MenuItem[]>([]);
  ngOnInit(): void {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe(() => {
        this.updateActiveMenu();
      });
    const user = this.getUser();
    if (user?.role === 'CUSTOMER') {
      this.menuItems.set([
        {
          label: 'Dashboard',
          icon: '📊',
          route: '/customer-dashboard'
        },
        {
          label: 'Service List',
          icon: '👥',
          route: '/customer-service-list'
        },
        {
          label: 'Booking',
          icon: '🏢',
          route: '/customer-booking-list'
        },
        //   {
        //   label: 'Users',
        //   icon: '📊',
        //   route: '/users'
        // },
        {
          label: 'Appointment',
          icon: '📅',
          route: '/customer-appointment-list'
        }
      ]);
    } else if (user?.role === 'STAFF') {
      this.menuItems.set([
        {
          label: 'Dashboard',
          icon: '📊',
          route: '/staff-dashboard'
        },
        //  {
        //   label: 'Users',
        //   icon: '📊',
        //   route: '/users'
        // },
        {
          label: 'Appointments',
          icon: '📅',
          route: '/staff-appointments'
        }]);
    } else if (user?.role === 'ADMIN') {
      this.menuItems.set([
        {
          label: 'Dashboard',
          icon: '📊',
          route: '/admin-dashboard'
        },
        {
          label: 'Users',
          icon: '👥',
          route: '/admin-users'
        },
        {
          label: 'Services',
          icon: '🛠️',
          route: '/admin-service-management'
        },
        {
          label: 'Staff Management',
          icon: '👨‍💼',
          route: '/admin-staff-management'
        },
        {
          label: 'Appointments',
          icon: '📅',
          route: '/admin-appointment-management'
        }
      ]);
    }
    this.setActiveMenu();
  }
  setActiveMenu(): void {
    const currentUrl = this.router.url;
    const menu = this.menuItems().find(
      item => item.route === currentUrl
    );
    if (menu) {
      this.activeMenu.set(menu.label);
    }
  }
  private updateActiveMenu(): void {
    const menu = this.menuItems().find(
      item => item.route === this.router.url
    );
    this.activeMenu.set(
      menu?.label ?? 'Dashboard'
    );
  }
  selectMenu(menu: any) {
    this.activeMenu.set(menu.label);
  }
  getUser(): any {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }
    const userDetails = sessionStorage.getItem('user_details');
    if (!userDetails) {
      return null;
    }
    const user = JSON.parse(userDetails);
    this.userDetails = user;
    if (user?._id) {
      this.getProfile(user._id);
    }
    return user;
  }
  getProfile(userId: string): void {
    this.loginService.getProfile(userId).subscribe({
      next: (response: any) => {
        const user = response.data;
        if (user.name) {
          this.userName.set(user?.name || '');
          this.profileImage = user?.profileImage || '';
          this.loginService.setUser(response.data);
          // this.socketService.connect();
        }
        this.selectedStatus.set(user.availabilityStatus ?? 'available');

      },
      error: (error) => {
        console.error('Get profile failed:', error);
      }
    });
  }

  toggleDropdown() {
    this.isDropdownOpen.update(value => !value);
  }
  profile() {
    this.router.navigate(['/profile'])
    this.isDropdownOpen.set(false);
  }
  settings() {
    this.isDropdownOpen.set(false);
  }
  logout() {
    const user = this.loginService.userDetails();
    this.isDropdownOpen.set(false);
    sessionStorage.clear();
    this.router.navigate(['/login']);
     if (user?.uniqueUserId) {
    this.socketService.disconnect();
  }
  }



  showStatusMenu = false;
  toggleStatusMenu(): void {
    this.showStatusMenu =
      !this.showStatusMenu;
  }
changeStatus(status: AvailabilityStatus): void {

  const staffId =
    this.userDetails?.uniqueUserId;

  if (!staffId) {
    return;
  }

  // 1. Update UI immediately
  this.selectedStatus.set(status);

  // 2. Update current user object
  if (this.userDetails) {
    this.userDetails = {
      ...this.userDetails,
      availabilityStatus: status
    };
  }

  // 3. Update sessionStorage
  const storedUser =
    sessionStorage.getItem('user_details');

  if (storedUser) {

    const user = JSON.parse(storedUser);

    const updatedUser = {
      ...user,
      availabilityStatus: status
    };

    sessionStorage.setItem(
      'user_details',
      JSON.stringify(updatedUser)
    );
  }

  // 4. Save to MongoDB through Socket.IO
  this.socketService.changeStaffStatus(
    staffId,
    status
  );

  // 5. Close dropdown
  this.showStatusMenu = false;
}

  selectedStatus = signal<AvailabilityStatus>('available');
  get status(): AvailabilityStatus {

    return this.selectedStatus();
  }

  get statusText(): string {
    switch (this.selectedStatus()) {
      case 'available':
        return 'Available';
      case 'busy':
        return 'Busy';
      case 'away':
        return 'Away';
      case 'dnd':
        return 'Do not disturb';
      case 'out_of_office':
        return 'Out of office';
      case 'offline':
      default:
        return 'Offline';
    }
  }

  get statusIcon(): string {
    switch (this.selectedStatus()) {
      case 'available':
        return '🟢';
      case 'busy':
        return '🔴';
      case 'away':
        return '🟡';
      case 'dnd':
        return '⛔';
      case 'out_of_office':
        return '🟣';
      case 'offline':
      default:
        return '⚫';
    }
  }
} 
