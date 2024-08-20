import { Component, Output, Input, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { GameType } from 'src/common/interfaces.js';

@Component({
  selector: 'app-game-type-modal',
  templateUrl: './game-type-modal.component.html',
  styleUrls: ['./game-type-modal.component.css'],
})
export class GameTypeModalComponent {
  @Input() gameType: GameType = {
    id: 0,
    name: '',
    description: '',
    tags: [],
  };

  @Output() EarlyLeaveModal = new EventEmitter();
  @Output() SavedGameType = new EventEmitter<GameType>();

  type: string = '';

  gameTypeForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.maxLength(15)]),
    description: new FormControl('', [Validators.required]),
  });

  constructor() {
    this.gameTypeForm.valueChanges.subscribe((value) => {});
  }

  ngOnInit() {
    if (this.gameType.id === 0) {
      this.type = 'Crear';
    } else {
      this.type = 'Actualizar';
    }
    this.gameTypeForm.patchValue({
      name: this.gameType.name,
      description: this.gameType.description,
    });
  }

  onSubmit() {
    // Find a way to avoid using !. The gameTypeForm.value.name shouldn't be undefined or null here
    this.gameType.name = this.gameTypeForm.value.name!;
    this.gameType.description = this.gameTypeForm.value.description!;
    this.SavedGameType.emit(this.gameType);
  }

  closeModal() {
    this.EarlyLeaveModal.emit();
  }
}
