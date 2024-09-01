import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { GameType, Tag } from 'src/common/interfaces.js';
import { TagService } from 'src/app/services/CRUD/tag.service';

@Component({
  selector: 'app-game-type-modal',
  templateUrl: './game-type-modal.component.html',
})
export class GameTypeModalComponent {
  constructor(
    private tagService: TagService,
    public dialogRef: MatDialogRef<GameTypeModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  tagList: Tag[] = [];

  type: string = '';

  gameTypeForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.maxLength(15)]),
    description: new FormControl('', [Validators.required]),
    tags: new FormControl(),
  });

  ngOnInit() {
    this.initializeForms();

    this.tagService
      .getTags()
      .subscribe((response: any) => (this.tagList = response.data));

    if (this.data.gameType.id === 0) {
      this.type = 'Crear';
    } else {
      this.type = 'Actualizar';
    }
  }

  initializeForms() {
    this.gameTypeForm.setValue({
      name: this.data.gameType.name,
      description: this.data.gameType.description,
      tags: this.data.gameType.tags,
    });
  }

  saveChanges() {
    let gameTypeResponse = {
      id: this.data.gameType.id,
      ...this.gameTypeForm.value,
    };

    this.dialogRef.close(gameTypeResponse);
  }
}
