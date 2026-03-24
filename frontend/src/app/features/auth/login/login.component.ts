import { Component, inject, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '@services/auth.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '@shared/utils/form-utils';
import { Router } from '@angular/router';
import { UserFormLogin } from '@shared/interfaces/user';

@Component({
  selector: 'app-login',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  confirmAction = output<any>();
  email = signal('');
  password = signal('');
  fb = inject(FormBuilder);

  loginForm = this.fb.group({
  mail: ['', {validators: [Validators.required,Validators.pattern(FormUtils.emailPattern)],nonNullable:true}],
  password: ['', {validators:[Validators.required, Validators.minLength(8)], nonNullable:true}],
  });
  
  login() {
    if (this.loginForm.valid) {
      const userCredentials = this.loginForm.getRawValue() as UserFormLogin;
      this.authService.login(userCredentials).subscribe({
      next: (val) => {
        console.log('Login exitoso');
        this.router.navigate(['/tournaments']);
      },
      error: (err) => {console.log('Fallo de inicio de sesión', err)
      }
    });
    }
  }
}
