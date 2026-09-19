import { Component, computed, effect, OnInit, signal } from '@angular/core';
import { Router, RouterLink, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { LoginService } from '../../auth/login/login-service';

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

  constructor(private router: Router, private loginService: LoginService) {
    effect(() => {
      const user = this.loginService.userDetails();
      this.userName.set(user?.name || '');
      this.profileImage = user?.profileImage || '';
    });


  }

  ngOnInit(): void {
    if (this.router.url === '/employee') {
      this.activeMenu.set('Employees');
    } else if (this.router.url === '/departments') {
      this.activeMenu.set('Departments');
    } else if (this.router.url === '/dashboard') {
      this.activeMenu.set('Dashboard');
    }
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe(() => {
        this.updateActiveMenu();
      });
  }

  private updateActiveMenu(): void {
    const menuMap: Record<string, string> = {
      '/dashboard': 'Dashboard',
      '/employee': 'Employees',
      '/departments': 'Departments'
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
