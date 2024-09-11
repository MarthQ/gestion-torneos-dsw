import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-location-modal',
  templateUrl: './location-modal.component.html',
})
export class LocationModalComponent {
  constructor(
    public dialogRef: MatDialogRef<LocationModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  type: string = '';

  locationForm = new FormGroup({
    name: new FormControl('', [Validators.maxLength(40)]),
  });

  ngOnInit() {
    this.initializeForms();

    if (this.data.location.id === 0) {
      this.type = 'Crear';
    } else {
      this.type = 'Actualizar';
    }
  }

  initializeForms() {
    this.locationForm.setValue({
      name: this.data.location.name,
    });
  }

  saveChanges() {
    let locationResponse = {
      id: this.data.location.id,
      ...this.locationForm.value,
    };

    this.dialogRef.close(locationResponse);
  }
}
