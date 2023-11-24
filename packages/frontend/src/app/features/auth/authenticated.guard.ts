import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authenticatedGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authService = inject(AuthService);
  if (authService.isLoggedIn) {
    return true;
  }
  return router.parseUrl('/login');
};
