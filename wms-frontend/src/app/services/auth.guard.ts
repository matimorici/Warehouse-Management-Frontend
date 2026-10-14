import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService, UserRole } from './auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/login']);
};

export function roleGuard(allowedRoles: UserRole[]): CanActivateFn {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const role = authService.getUserRole();

    if (!role) {
      return router.createUrlTree(['/login']);
    }

    if (allowedRoles.includes(role)) {
      return true;
    }

    return router.createUrlTree(['/sin-acceso']);
  };
}
