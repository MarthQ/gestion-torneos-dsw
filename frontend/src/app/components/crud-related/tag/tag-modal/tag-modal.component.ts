import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Tag } from 'src/common/interfaces.js';

@Component({
  selector: 'app-tag-modal',
  templateUrl: './tag-modal.component.html',
})
export class TagModalComponent {
  constructor(
    public dialogRef: MatDialogRef<TagModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  type: string = '';

  tagForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.maxLength(40)]),
    description: new FormControl('', [Validators.required]),
  });

  ngOnInit() {
    this.initializeForms();

    if (this.data.tag.id === 0) {
      this.type = 'Crear';
    } else {
      this.type = 'Actualizar';
    }
  }

  initializeForms() {
    this.tagForm.setValue({
      name: this.data.tag.name,
      description: this.data.tag.description,
    });
  }

  saveChanges() {
    let tagResponse = {
      id: this.data.tag.id,
      ...this.tagForm.value,
    };

    this.dialogRef.close(tagResponse);
  }
}
