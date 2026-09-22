import { Component, computed, effect, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { Router, RouterLink, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { LoginService } from '../../auth/login/login-service';
import { isPlatformBrowser } from '@angular/common';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
}

interface Product {
  sku: string;
  name: string;
  category: string;
  stock: number;
  reorderPoint: number;
  status: 'Low Stock' | 'Out of Stock';
}
@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout implements OnInit {
  isDropdownOpen = signal(false);

  activeMenu = signal('Dashboard');

  userName = signal('');
  profileImage = '';
  private platformId = inject(PLATFORM_ID);

  constructor(private router: Router, private loginService: LoginService) {
  }


  menuItems = signal<MenuItem[]>([]);
  ngOnInit(): void {

    // if (this.router.url === '/customer-service-list') {
    //   this.activeMenu.set('Service List');
    // } else if (this.router.url === '/customer-booking-list') {
    //   this.activeMenu.set('Booking');
    // } else if (this.router.url === '/customer-dashboard') {
    //   this.activeMenu.set('Dashboard');
    // } else if (this.router.url === '/customer-appointment-list') {
    //   this.activeMenu.set('Appointment');
    // }
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
          route: '/admin-appointments'
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
    console.log('sk', user)

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
          console.log(this.userName())
        }
      },

      error: (error) => {
        console.error('Get profile failed:', error);
      }
    });
  }


  // ============================
  // DASHBOARD STATISTICS
  // ============================



  // ============================
  // REVENUE DATA
  // ============================

  revenueData = signal([
    { month: 'Jan', value: 43 },
    { month: 'Feb', value: 38 },
    { month: 'Mar', value: 52 },
    { month: 'Apr', value: 48 },
    { month: 'May', value: 57 },
    { month: 'Jun', value: 63 },
    { month: 'Jul', value: 60 },
    { month: 'Aug', value: 67 },
    { month: 'Sep', value: 72 },
    { month: 'Oct', value: 69 },
    { month: 'Nov', value: 76 },
    { month: 'Dec', value: 86 }
  ]);

  maxRevenue = computed(() => {
    return Math.max(
      ...this.revenueData().map(item => item.value)
    );
  });


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
    this.isDropdownOpen.set(false);
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }


}
