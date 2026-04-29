import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { AuthService } from '@features/auth/services/auth.service';
import { Toaster } from '@shared/utils/toaster';
import { FormErrorLabel } from '@shared/components/formErrorLabel/formErrorLabel';

@Component({
  imports: [ReactiveFormsModule, FormErrorLabel, RouterLink],
  templateUrl: './forgot-password.html',
})
export class ForgotPassword {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  public mailSent = signal<boolean>(false);

  forgotForm = this.fb.group({
    mail: ['', Validators.required],
  });

  onSubmit(event: Event) {
    event.preventDefault();

    if (this.forgotForm.invalid) {
      this.forgotForm.markAllAsTouched();
      return;
    }

    const { mail } = this.forgotForm.value;

    this.authService.requestForgotPassword(mail!).subscribe({
      error: (message) => {
        Toaster.error(message);
      },
    });
    this.mailSent.set(true);
  }
}
