import { ChangeDetectionStrategy, Component, inject, linkedSignal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@features/auth/services/auth.service';
import { Toaster } from '@shared/utils/toaster';
import { FormErrorLabel } from '@shared/components/formErrorLabel/formErrorLabel';
import { FormUtils } from '@shared/utils/form-utils';

@Component({
  imports: [ReactiveFormsModule, FormErrorLabel],
  templateUrl: './setup-password.html',
})
export class SetupPassword {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private mailToken = this.activatedRoute.snapshot.paramMap.get('token') ?? '';

  setPasswordForm = this.fb.group(
    {
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
    },
    {
      validators: [FormUtils.isFieldOneEqualToFieldTwo('passowrd', 'confirmPassword')],
    },
  );

  onSubmit(event: Event) {
    event.preventDefault();

    if (this.setPasswordForm.invalid) {
      this.setPasswordForm.markAllAsTouched();
      return;
    }

    const { password } = this.setPasswordForm.value;

    this.authService.requestSetupPassword(password!, this.mailToken).subscribe({
      next: (response) => {
        Toaster.success('Contraseña establecida correctamente');
        this.router.navigateByUrl('/explore');
      },
      error: (message) => {
        Toaster.error(message);
      },
    });
  }
}
