import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GameService } from 'src/app/services/CRUD/game.service';
import { Game, GameType, Tag } from 'src/common/interfaces';

@Component({
  selector: 'app-game-modal',
  templateUrl: './game-modal.component.html',
  styleUrls: ['./game-modal.component.css']
})
export class GameModalComponent {
  constructor(
    private gameService: GameService,
    public dialogRef: MatDialogRef<GameModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  tagList: Tag[] = [];
  gametypeList: GameType[] = [];


  type: string = '';

  gameForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.maxLength(15)]),
    cant_torneos: new FormControl('', [Validators.required]),
    gametype: new FormControl(),
    tags: new FormControl(),
  });

  ngOnInit() {
    this.initializeForms();

    this.gameService
      .getGames()
      .subscribe((response: any) => (this.tagList = response.data));

    if (this.data.game.id === 0) {
      this.type = 'Crear';
    } else {
      this.type = 'Actualizar';
    }
  }

  initializeForms() {
    this.gameForm.setValue({
      name: this.data.game.name,
      cant_torneos: this.data.game.cant_torneos,
      gametype: this.data.game.gametype,
      tags: this.data.game.tags,
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
