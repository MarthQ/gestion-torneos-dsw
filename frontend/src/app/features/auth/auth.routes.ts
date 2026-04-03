import { Routes } from '@angular/router';
import { Register } from './pages/register/register';
import { Login } from './pages/login/login';
import { AuthLayout } from './layout/auth-layout/auth-layout';
import { NotAuthenticatedGuard } from './guards/not-authenticated.guard';
import { ForgotPassword } from './pages/forgot-password/forgot-password';
import { SetupPassword } from './pages/setup-password/setup-password';

export const authRoutes: Routes = [
  {
    path: '',
    component: AuthLayout,
    canMatch: [NotAuthenticatedGuard],
    children: [
      {
        path: '',
        redirectTo: 'explore',
        pathMatch: 'full',
      },
      {
        path: 'login',
        component: Login,
      },
      {
        path: 'register',
        component: Register,
      },
      {
        path: 'forgot-password',
        component: ForgotPassword,
      },
      {
        path: 'setup-password',
        component: SetupPassword,
      },
    ],
  },
];

export default authRoutes;
