import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TagService } from 'src/app/services/CRUD/tag.service';
import { GameTypeService } from 'src/app/services/CRUD/game-type.service';
import { GameType, Tag } from 'src/common/interfaces';

@Component({
  selector: 'app-game-modal',
  templateUrl: './game-modal.component.html',
  styleUrls: ['./game-modal.component.css'],
})
export class GameModalComponent {
  constructor(
    private tagService: TagService,
    private gameTypeService: GameTypeService,
    public dialogRef: MatDialogRef<GameModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  tagList: Tag[] = [];
  gametypeList: GameType[] = [];

  type: string = '';

  gameForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.maxLength(15)]),
    gametype: new FormControl('', [Validators.required]),
    tags: new FormControl(),
  });

  ngOnInit() {
    this.initializeForms();

    this.tagService.getTags().subscribe((response: Tag[]) => {
      this.tagList = response;
    });

    this.gameTypeService.getGameTypes().subscribe((response: GameType[]) => {
      this.gametypeList = response;
    });

    if (this.data.game.id === 0) {
      this.type = 'Crear';
    } else {
      this.type = 'Actualizar';
    }
  }

  initializeForms() {
    this.gameForm.setValue({
      name: this.data.game.name,
      gametype: this.data.game.gametype.id,
      tags: this.data.game.tags.map((tag: Tag) => tag.id),
    });
  }

  saveChanges() {
    let gameResponse = {
      id: this.data.game.id,
      ...this.gameForm.value,
    };

    this.dialogRef.close(gameResponse);
  }
}
