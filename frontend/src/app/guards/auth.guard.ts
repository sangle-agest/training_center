import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const rootGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('===== rootGuard Check =====');
  console.log('Is authenticated:', authService.isAuthenticated());

  if (authService.isAuthenticated()) {
    const user = authService.currentUserValue;
    if (user?.role === 'admin') {
      console.log('Redirecting to /admin');
      router.navigate(['/admin']);
    } else {
      console.log('Redirecting to /learn');
      router.navigate(['/learn']);
    }
    return false;
  }

  console.log('Not authenticated, redirecting to /login');
  router.navigate(['/login']);
  return false;
};

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('===== authGuard Check =====');
  console.log('URL:', state.url);
  console.log('Is authenticated:', authService.isAuthenticated());
  console.log('Current user:', authService.currentUserValue);
  console.log('===========================');

  if (authService.isAuthenticated()) {
    return true;
  }

  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('===== adminGuard Check =====');
  console.log('URL:', state.url);
  console.log('Is authenticated:', authService.isAuthenticated());
  console.log('Is admin:', authService.isAdmin);
  console.log('Current user:', authService.currentUserValue);
  console.log('============================');

  if (authService.isAuthenticated() && authService.isAdmin) {
    return true;
  }

  router.navigate(['/']);
  return false;
};

export const learnerGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated() && authService.isLearner) {
    return true;
  }

  router.navigate(['/']);
  return false;
};

export const loginGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('===== loginGuard Check =====');
  console.log('Is authenticated:', authService.isAuthenticated());
  
  // If already authenticated, redirect to appropriate dashboard
  if (authService.isAuthenticated()) {
    const user = authService.currentUserValue;
    console.log('Already authenticated, redirecting...');
    if (user?.role === 'admin') {
      router.navigate(['/admin']);
    } else {
      router.navigate(['/learn']);
    }
    return false;
  }

  console.log('Not authenticated, allowing login page');
  console.log('============================');
  return true;
};
