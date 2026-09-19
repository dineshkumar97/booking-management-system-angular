import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login')
        .then(m => m.Login)
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./auth/forgot-password/forgot-password')
        .then(m => m.ForgotPassword)
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import('./auth/reset-page/reset-page')
        .then(m => m.ResetPage)
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./auth/singup/singup')
        .then(m => m.Singup)
  },
  {
    path: '',
    loadComponent: () =>
      import('./layout/main-layout/main-layout')
        .then(m => m.MainLayout),

    children: [
      {
        path: 'customer-dashboard',
        loadComponent: () =>
          import('./layouts/customer-layout/customer-dashboard/customer-dashboard')
            .then(m => m.CustomerDashboard)
      },
      {
        path: 'customer-service-list',
        loadComponent: () =>
          import('./layouts/customer-layout/customer-service-list/customer-service-list')
            .then(m => m.CustomerServiceList)
      },
      {
        path: 'customer-booking-list',
        loadComponent: () =>
          import('./layouts/customer-layout/customer-booking/customer-booking')
            .then(m => m.CustomerBooking)
      },
      {
        path: 'customer-appointment-list',
        loadComponent: () =>
          import('./layouts/customer-layout/customer-appointments-list/customer-appointments-list')
            .then(m => m.CustomerAppointmentsList)
      },
      {
        path: 'customer-appointment-details/:id',
        loadComponent: () =>
          import('./layouts/customer-layout/customer-appointment-details/customer-appointment-details')
            .then(m => m.CustomerAppointmentDetails)
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/dashboard')
            .then(m => m.Dashboard)
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./pages/users/users')
            .then(m => m.Users)
      },
      {
        path: 'employee',
        loadComponent: () =>
          import('./pages/employee/employee')
            .then(m => m.Employee)
      },
      {
        path: 'departments',
        loadComponent: () =>
          import('./pages/department/department')
            .then(m => m.Department)
      },

      {
        path: 'profile',
        loadComponent: () =>
          import('./pages/profile/profile')
            .then(m => m.Profile)
      },

    ]
  },


  {
    path: '**',
    redirectTo: 'login'
  }
];