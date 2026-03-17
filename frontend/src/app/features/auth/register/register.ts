import { JsonPipe } from '@angular/common';
import { Component, inject, output, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '@services/auth.service';
import { LocationService } from '@services/location.service';
import { UserFormDTO, UserRegisterDTO } from '@shared/interfaces/user';
import { FormUtils } from '@shared/utils/form-utils';
import { EMPTY,} from 'rxjs';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, JsonPipe],
  templateUrl: './register.html',
})

export class registerComponent {
  private authService = inject(AuthService);
  private locationService = inject(LocationService)
  private submissionData = signal<UserRegisterDTO | null>(null);

  confirmAction = output<any>();
  
  name = signal('');
  mail = signal('');
  password = signal('');
  locationId = signal<number | null>(null);
  fb = inject(FormBuilder);

  locationResource = rxResource({
  stream: () => this.locationService.getLocations(),
  });
  
  userRegisterForm = this.fb.group({
  name: ['', Validators.required],
  mail: ['', [Validators.required, Validators.pattern(FormUtils.emailPattern)]],
  password: ['', [Validators.required, Validators.minLength(8)]],
  location: [0, [Validators.required, Validators.min(1)]],
  });

  registerResource = rxResource({
  params: () => (this.submissionData()),
  stream: ({ params: data}) => {
    if(!data) return EMPTY;
    return this.authService.register(data).pipe()
    ;}
  });
  
  register() {
    if (this.userRegisterForm.valid) {
      const rawuser = this.userRegisterForm.getRawValue();
      const dto: UserRegisterDTO = {
      name: rawuser.name ?? '',
      mail: rawuser.mail ?? '',
      password: rawuser.password ?? '',
      location: rawuser.location!,
    };
      this.submissionData.set(dto);
    }
  }
}
 