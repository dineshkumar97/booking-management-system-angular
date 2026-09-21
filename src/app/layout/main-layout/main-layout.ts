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



  ngOnInit(): void {

    if (this.router.url === '/customer-service-list') {
      this.activeMenu.set('Service List');
    } else if (this.router.url === '/customer-booking-list') {
      this.activeMenu.set('Booking');
    } else if (this.router.url === '/customer-dashboard') {
      this.activeMenu.set('Dashboard');
    }else if (this.router.url === '/customer-appointment-list') {
      this.activeMenu.set('Appointment');
    }
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe(() => {
        this.updateActiveMenu();
      });
      this.getUser();

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
    console.log('sk',user)

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

  private updateActiveMenu(): void {
    const menuMap: Record<string, string> = {
      '/customer-dashboard': 'Dashboard',
      '/customer-service-list': 'Service List',
      '/customer-booking-list': 'Booking',
      '/customer-appointment-list': 'Appointment'
    };

    this.activeMenu.set(menuMap[this.router.url] ?? 'Dashboard');
  }


  // userName = 'Dinesh';

  // isDropdownOpen = signal(false);

  // ============================
  // SIDEBAR
  // ============================

  menuItems = signal<MenuItem[]>([
    { label: 'Dashboard', icon: '📊', route: '/customer-dashboard' },
    { label: 'Service List', icon: '👥', route: '/customer-service-list' },
    { label: 'Booking', icon: '🏢', route: '/customer-booking-list' },
    { label: 'Appointment', icon: '🏢', route: '/customer-appointment-list' },
    // { label: 'Projects', icon: '📋', route: '/projects' },
    // { label: 'Inventory', icon: '📋', route: '/inventory' },
    // { label: 'Orders', icon: '🛒', route: '/orders' },
    // { label: 'Suppliers', icon: '🚚', route: '/suppliers' },
    // { label: 'Reports', icon: '📈', route: '/reports' },
    // { label: 'Settings', icon: '⚙️', route: '/settings' }
  ]);

  selectMenu(menu: any) {
    this.activeMenu.set(menu.label);
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
