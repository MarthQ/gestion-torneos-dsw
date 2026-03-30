import { Component, inject, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '@features/auth/services/auth.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { toast } from 'ngx-sonner';
import { FormUtils } from '@shared/utils/form-utils';
import { FormErrorLabel } from '@shared/components/formErrorLabel/formErrorLabel';

@Component({
  imports: [CommonModule, ReactiveFormsModule, RouterLink, FormErrorLabel],
  templateUrl: './login.html',
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.pattern(FormUtils.emailPattern)]],
    password: ['', [Validators.required]],
  });

  onSubmit(event: Event) {
    event.preventDefault();

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      console.log('Formulario invalido');
      return;
    }

    const { email, password } = this.loginForm.value;

    this.authService.login(email!, password!).subscribe({
      next: (resp) => {
        toast.success('Login successful');
        this.router.navigateByUrl('/explore');
      },
      error: (message) => {
        toast.error(message);
      },
    });
  }
}
