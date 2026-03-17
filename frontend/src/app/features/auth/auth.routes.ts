import { Routes } from '@angular/router';
import { registerComponent } from './register/register';
import { LoginComponent } from './login/login.component';

export const authRoutes: Routes = [
    {
        path:'register',
        component: registerComponent
    },
    {
        path:'login',
        component:LoginComponent
    }
];
