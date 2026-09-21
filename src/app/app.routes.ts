import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  // =========================
  // AUTH
  // =========================

  {
    path: 'login',
    title: 'BMS | Login',
    loadComponent: () =>
      import('./auth/login/login')
        .then(m => m.Login)
  },

  {
    path: 'forgot-password',
    title: 'BMS | Forgot Password',
    loadComponent: () =>
      import('./auth/forgot-password/forgot-password')
        .then(m => m.ForgotPassword)
  },

  {
    path: 'reset-password',
    title: 'BMS | Reset Password',
    loadComponent: () =>
      import('./auth/reset-page/reset-page')
        .then(m => m.ResetPage)
  },

  {
    path: 'signup',
    title: 'BMS | Sign Up',
    loadComponent: () =>
      import('./auth/singup/singup')
        .then(m => m.Singup)
  },

  // =========================
  // MAIN LAYOUT
  // =========================

  {
    path: '',
    loadComponent: () =>
      import('./layout/main-layout/main-layout')
        .then(m => m.MainLayout),

    children: [

      // =========================
      // CUSTOMER DASHBOARD
      // Role restricted
      // =========================

      {
        path: 'customer-dashboard',
        title: 'BMS | Customer Dashboard',
        canActivate: [authGuard],
        data: {
          roles: ['CUSTOMER']
        },
        loadComponent: () =>
          import('./layouts/customer-layout/customer-dashboard/customer-dashboard')
            .then(m => m.CustomerDashboard)
      },

      // =========================
      // CUSTOMER PAGES
      // Login required only
      // =========================

      {
        path: 'customer-service-list',
        title: 'BMS | Services',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./layouts/customer-layout/customer-service-list/customer-service-list')
            .then(m => m.CustomerServiceList)
      },

      {
        path: 'customer-booking-list',
        title: 'BMS | Booking',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./layouts/customer-layout/customer-booking/customer-booking')
            .then(m => m.CustomerBooking)
      },

      {
        path: 'customer-appointment-list',
        title: 'BMS | My Appointments',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./layouts/customer-layout/customer-appointments-list/customer-appointments-list')
            .then(m => m.CustomerAppointmentsList)
      },

      {
        path: 'customer-appointment-details/:id',
        title: 'BMS | Appointment Details',
        canActivate: [authGuard],
        data: {
          renderMode: 'client'
        },
        loadComponent: () =>
          import('./layouts/customer-layout/customer-appointment-details/customer-appointment-details')
            .then(m => m.CustomerAppointmentDetails)
      },
      {
        path: 'staff-dashboard',
        title: 'BMS | Staff Dashboard',
        canActivate: [authGuard],
        data: {
          roles: ['STAFF']
        },
        loadComponent: () =>
          import('./layouts/staff-layout/staff-dashboard/staff-dashboard')
            .then(m => m.StaffDashboard)
      },
      {
        path: 'staff-appointments',
        title: 'BMS | Staff Appointments',
        canActivate: [authGuard],
        data: {
          roles: ['STAFF']
        },
        loadComponent: () =>
          import('./layouts/staff-layout/staff-appointments/staff-appointments')
            .then(m => m.StaffAppointments)
      },
      {
        path: 'staff-appointment-details/:id',
        title: 'BMS | Staff Appointment Details',
        canActivate: [authGuard],
        data: {
          roles: ['STAFF'],
          renderMode: 'client'
        },
        loadComponent: () =>
          import('./layouts/staff-layout/staff-appointment-details/staff-appointment-details')
            .then(m => m.StaffAppointmentDetails)
      },
       {
        path: 'users',
        loadComponent: () =>
          import('./pages/users/users')
            .then(m => m.Users)
      },
      // =========================
      // PROFILE
      // Login required only
      // =========================

      {
        path: 'profile',
        title: 'BMS | Profile',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./pages/profile/profile')
            .then(m => m.Profile)
      }

    ]
  },

  // =========================
  // INVALID ROUTE
  // =========================

  {
    path: '**',
    redirectTo: 'login'
  }
];