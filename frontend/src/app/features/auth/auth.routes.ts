import { Routes } from '@angular/router';
import { Register } from './pages/register/register';
import { Login } from './pages/login/login';
import { AuthLayout } from './layout/auth-layout/auth-layout';
import { NotAuthenticatedGuard } from './guards/not-authenticated.guard';

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
    ],
  },
];

export default authRoutes;
