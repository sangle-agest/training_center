import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';
import { of } from 'rxjs';

export const rootGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.currentUser.pipe(
    take(1),
    map(user => {
      console.log('===== rootGuard Check =====');
      console.log('Is authenticated:', authService.isAuthenticated());

      if (authService.isAuthenticated()) {
        if (user?.role === 'admin') {
          console.log('Redirecting to /admin/courses');
          router.navigate(['/admin/courses']);
        } else {
          console.log('Redirecting to /learn');
          router.navigate(['/learn']);
        }
        return false;
      }

      console.log('Not authenticated, redirecting to /login');
      router.navigate(['/login']);
      return false;
    })
  );
};

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Give a tiny delay to ensure localStorage is read
  return authService.currentUser.pipe(
    take(1),
    map(user => {
      console.log('===== authGuard Check =====');
      console.log('URL:', state.url);
      console.log('Token:', authService.token ? 'EXISTS' : 'MISSING');
      console.log('User:', user);
      console.log('Is authenticated:', authService.isAuthenticated());
      console.log('===========================');

      if (authService.isAuthenticated()) {
        console.log('authGuard: PASS - User is authenticated');
        return true;
      }

      console.log('authGuard: FAIL - Redirecting to login');
      router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
    })
  );
};

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.currentUser.pipe(
    take(1),
    map(user => {
      console.log('===== adminGuard Check =====');
      console.log('URL:', state.url);
      console.log('User role:', user?.role);
      console.log('Is admin:', authService.isAdmin);
      console.log('============================');

      if (authService.isAuthenticated() && authService.isAdmin) {
        console.log('adminGuard: PASS - User is admin');
        return true;
      }

      console.log('adminGuard: FAIL - Not admin or not authenticated');
      // Redirect to login if not authenticated, or to learn if learner
      if (!authService.isAuthenticated()) {
        console.log('Redirecting to /login');
        router.navigate(['/login']);
      } else {
        console.log('Redirecting to /learn (user is learner)');
        router.navigate(['/learn']);
      }
export const learnerGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.currentUser.pipe(
    take(1),
    map(user => {
      if (authService.isAuthenticated() && authService.isLearner) {
        return true;
      }

      router.navigate(['/']);
      return false;
    })
  );
};  return true;
  }
export const loginGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.currentUser.pipe(
    take(1),
    map(user => {
      console.log('===== loginGuard Check =====');
      console.log('Is authenticated:', authService.isAuthenticated());
      
      // If already authenticated, redirect to appropriate dashboard
      if (authService.isAuthenticated()) {
        console.log('Already authenticated, redirecting...');
        if (user?.role === 'admin') {
          router.navigate(['/admin/courses']);
        } else {
          router.navigate(['/learn']);
        }
        return false;
      }

      console.log('Not authenticated, allowing login page');
      console.log('============================');
      return true;
    })
  );
};}

  console.log('Not authenticated, allowing login page');
  console.log('============================');
  return true;
};
