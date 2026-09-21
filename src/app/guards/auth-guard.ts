import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const authGuard: CanActivateFn = (route) => {

  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // Server → allow route during SSR
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  // Get token
  const token = sessionStorage.getItem('authToken');

  console.log('AUTH TOKEN:', token);

  // No token
  if (!token) {
    return router.createUrlTree(['/login']);
  }

  // Get logged-in user
  const userDetails = sessionStorage.getItem('user_details');

  if (!userDetails) {
    sessionStorage.removeItem('authToken');

    return router.createUrlTree(['/login']);
  }

  try {

    const user = JSON.parse(userDetails);

    const userRole = user?.role;

    // Roles allowed for this route
    const allowedRoles = route.data?.['roles'] as string[] | undefined;

    console.log('USER ROLE:', userRole);
    console.log('ALLOWED ROLES:', allowedRoles);

    // If route has role restrictions
    if (
      allowedRoles &&
      !allowedRoles.includes(userRole)
    ) {

      console.log('Access denied for role:', userRole);

      // Send user to their own dashboard
      if (userRole === 'CUSTOMER') {
        return router.createUrlTree(['/customer-dashboard']);
      }

      if (userRole === 'STAFF') {
        return router.createUrlTree(['/staff-dashboard']);
      }

      if (userRole === 'ADMIN') {
        return router.createUrlTree(['/admin-dashboard']);
      }

      return router.createUrlTree(['/login']);
    }

    return true;

  } catch (error) {

    console.error('Invalid user details:', error);

    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('user_details');

    return router.createUrlTree(['/login']);
  }
};