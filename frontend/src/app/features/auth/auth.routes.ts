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
      //TODO forgot-password-page -> Requests the email from the user which password going to be changed http.post(`${baseUrl}/user/forgot-password`)
      //TODO setup-password-page -> Request & Validate using ReactiveFormModules currentPassword & confirmCurrentPassword to send http.post(`${baseUrl}/user/setupPassword`) with email_token.
    ],
  },
];

export default authRoutes;
