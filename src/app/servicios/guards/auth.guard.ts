import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { LoginService } from '../server/login.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const cookieService = inject(CookieService);

  const user = cookieService.get('USER');
  if (user) {
    return true; 
  } else {
    router.navigate(['/login']); 
    return false;
  }
};

export const noAuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const loginService = inject(LoginService);
  const user = loginService.getUser(); 
  if (user) {
    router.navigate(['/login']); 
    return false;
  } else {
    return true;
  }
};

export const changePass: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const cookieService = inject(CookieService);

  const user = cookieService.get('CHANGE');
  if (user) {
    return true; 
  } else {
    router.navigate(['/newPassword']); 
    return false;
  }
};