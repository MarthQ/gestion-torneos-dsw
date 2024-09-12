import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LocationService } from 'src/app/services/CRUD/location.service';
import { User, Location } from 'src/common/interfaces';

@Component({
  selector: 'app-user-crud-modal',
  templateUrl: './user-crud-modal.component.html',
})
export class UserCrudModalComponent {
  constructor(
    private locationService: LocationService,
    public dialogRef: MatDialogRef<UserCrudModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  locationList: Location[] = [];

  type: string = '';

  userForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.maxLength(40)]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
    mail: new FormControl('', [Validators.required, Validators.email]),
    location: new FormControl(0, [Validators.required]),
  });

  ngOnInit() {
    this.locationService
      .getLocations()
      .subscribe((response: Location[]) => (this.locationList = response));

    this.initializeForms();

    if (this.data.user.id === 0) {
      this.type = 'Crear';
    } else {
      this.type = 'Actualizar';
    }
  }

  initializeForms() {
    this.userForm.setValue({
      name: this.data.user.name,
      password: this.data.user.password,
      mail: this.data.user.mail,
      location: this.data.user.location?.id || 0,
    });
  }

  saveChanges() {
    let userResponse = {
      id: this.data.user.id,
      ...this.userForm.value,
    };

    this.dialogRef.close(userResponse);
  }
}
