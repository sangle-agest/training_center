import { ApplicationConfig, provideBrowserGlobalErrorListeners, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth.interceptor';
import { AuthService } from './services/auth.service';

// Initialize auth state before app starts
export function initializeAuth(authService: AuthService) {
  return () => {
    // This ensures AuthService is instantiated and localStorage is read before routing begins
    console.log('APP_INITIALIZER: Auth state initialized');
    console.log('APP_INITIALIZER: User authenticated:', authService.isAuthenticated());
    console.log('APP_INITIALIZER: Current user:', authService.currentUserValue);
    console.log('APP_INITIALIZER: Token exists:', !!authService.token);
    return Promise.resolve();
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimationsAsync(),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAuth,
      deps: [AuthService],
      multi: true
    }
  ]
};
