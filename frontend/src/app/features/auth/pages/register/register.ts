import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { toast } from 'ngx-sonner';

import { LocationService } from '@features/tournament-hub/services/location.service';
import { RegisterForm } from '@features/auth/interfaces/register-form.interface';
import { AuthService } from '@features/auth/services/auth.service';
import { FormUtils } from '@shared/utils/form-utils';
import { FormErrorLabel } from '@shared/components/formErrorLabel/formErrorLabel';

@Component({
  imports: [ReactiveFormsModule, FormErrorLabel, RouterLink],
  templateUrl: './register.html',
})
export class Register {
  private authService = inject(AuthService);
  private locationService = inject(LocationService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  locationResource = rxResource({
    stream: () => {
      return this.locationService.getLocations();
    },
  });

  registerForm = this.fb.group({
    name: ['', [Validators.required]],
    mail: ['', [Validators.required, Validators.pattern(FormUtils.emailPattern)]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    location: [, [Validators.required]],
  });

  onSubmit(event: Event) {
    event.preventDefault();

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const form = this.registerForm.value;

    const registerForm: RegisterForm = {
      mail: form.mail!,
      password: form.password!,
      name: form.name!,
      location: form.location!,
    };

    this.authService.register(registerForm).subscribe({
      next: (resp) => {
        toast.success('Register successful');
        this.router.navigateByUrl('/');
      },
      error: (err) => {
        toast.error(err);
      },
    });
  }
}
