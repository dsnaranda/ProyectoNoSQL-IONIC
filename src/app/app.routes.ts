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
    loadComponent: () => import('./auth/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./auth/register/register.page').then(m => m.RegisterPage)
  },
  {
    path: 'login/identify',
    loadComponent: () => import('./auth/losspassword/losspassword.page').then(m => m.LosspasswordPage)
  },
  {
    path: 'change',
    loadComponent: () => import('./auth/change-password/change-password.page').then(m => m.ChangePasswordPage)
  },
  {
    path: 'aside',
    loadComponent: () => import('./shared/aside/aside.page').then(m => m.AsidePage),
    children: [
      {
        path: 'perfil',
        loadComponent: () => import('./pages/perfil/perfil.page').then(m => m.PerfilPage)
      },
      {
        path: 'surveys',
        loadComponent: () => import('./pages/surveys/surveys.page').then(m => m.SurveysPage)
      },
      {
        path: 'home',
        loadComponent: () => import('./pages/home/home.page').then(m => m.HomePage)
      },
      {
        path: '',
        redirectTo: 'perfil',
        pathMatch: 'full',
      },
    ]
  },
  {
    path: 'survey-id/:id',
    loadComponent: () => import('./pages/misEncuestas/survey-id/survey-id.page').then(m => m.SurveyIDPage)
  },
  {
    path: 'aside/surveys/:id/dashboard',
    loadComponent: () => import('./pages/misEncuestas/dashboard/dashboard.page').then(m => m.DashboardPage)
  },
  {
    path: 'largeanswer',
    loadComponent: () => import('./pages/forms/largeanswer/largeanswer.page').then(m => m.LargeanswerPage)
  },
  {
    path: 'likerscale',
    loadComponent: () => import('./pages/forms/likerscale/likerscale.page').then(m => m.LikerscalePage)
  },
  {
    path: 'multiopcion',
    loadComponent: () => import('./pages/forms/multiopcion/multiopcion.page').then(m => m.MultiopcionPage)
  },
  {
    path: 'subsurvey',
    loadComponent: () => import('./pages/forms/subsurvey/subsurvey.page').then(m => m.SubsurveyPage)
  },
  {
    path: 'respuesta/:id',
    loadComponent: () => import('./shared/formulario-respuestas/formulario-respuestas.page').then(m => m.FormularioRespuestasPage)
  },
  {
    path: 'formulario-respuestas',
    loadComponent: () => import('./shared/formulario-respuestas/formulario-respuestas.page').then(m => m.FormularioRespuestasPage)
  },
];