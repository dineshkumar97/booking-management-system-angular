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
      import('./pages/login/login')
        .then(m => m.Login)
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./pages/forgot-password/forgot-password')
        .then(m => m.ForgotPassword)
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import('./pages/reset-page/reset-page')
        .then(m => m.ResetPage)
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./pages/singup/singup')
        .then(m => m.Singup)
  },
  {
    path: '',
    loadComponent: () =>
      import('./layout/main-layout/main-layout')
        .then(m => m.MainLayout),

    children: [
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