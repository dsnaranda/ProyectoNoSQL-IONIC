import { Routes } from '@angular/router';
import { noAuthGuard } from './servicios/guards/auth.guard';

export const routes: Routes = [
    {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./auth/register/register.page').then( m => m.RegisterPage)
  },
  {
    path: 'login/identify',
    loadComponent: () => import('./auth/losspassword/losspassword.page').then( m => m.LosspasswordPage)
  },
  // {
  //   path: '**',
  //   loadComponent: () => import('./pages/errorpage/errorpage.page').then( m => m.ErrorpagePage)
  // },
  {
    path: 'change',
    loadComponent: () => import('./auth/change-password/change-password.page').then( m => m.ChangePasswordPage)
  },
];
