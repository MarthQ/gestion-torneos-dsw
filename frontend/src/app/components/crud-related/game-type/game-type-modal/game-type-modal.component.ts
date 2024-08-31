import { Component, Output, Input, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { GameType, Tag } from 'src/common/interfaces.js';
import { TagService } from 'src/app/services/CRUD/tag.service';

@Component({
  selector: 'app-game-type-modal',
  templateUrl: './game-type-modal.component.html',
  styleUrls: ['./game-type-modal.component.css'],
})
export class GameTypeModalComponent {
  constructor(private tagService: TagService) {}

  @Input() gameType: GameType = {
    id: 0,
    name: '',
    description: '',
    tags: [],
  };
  tagList: Tag[] = [];

  @Output() EarlyLeaveModal = new EventEmitter();
  @Output() SavedGameType = new EventEmitter<GameType>();

  type: string = '';

  gameTypeForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.maxLength(15)]),
    description: new FormControl(this.gameType.description, [
      Validators.required,
    ]),
    tags: new FormControl(),
  });

  ngOnInit() {
    this.initializeForms();

    this.tagService
      .getTags()
      .subscribe((response: any) => (this.tagList = response.data));

    if (this.gameType.id === 0) {
      this.type = 'Crear';
    } else {
      this.type = 'Actualizar';
    }
  }

  initializeForms() {
    this.gameTypeForm.setValue({
      name: this.gameType.name,
      description: this.gameType.description,
      tags: this.gameType.tags,
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
