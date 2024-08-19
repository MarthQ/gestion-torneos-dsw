import { Component, Input, Output, EventEmitter } from '@angular/core';
import { GameType } from 'src/common/interfaces.js';

@Component({
  selector: 'app-crud-modal',
  templateUrl: './crud-modal.component.html',
  styleUrls: ['./crud-modal.component.css'],
})
export class CrudModalComponent {
  @Output() EarlyLeaveModal = new EventEmitter();
  @Output() SavedElement = new EventEmitter<GameType>();

  @Input() type: string = '';

  @Input() gameType: GameType = {
    id: 0,
    name: '',
    description: '',
    tags: '',
  };

  gameTypeKeys: (keyof GameType)[] = [
    'id' as keyof GameType,
    'name' as keyof GameType,
    'description' as keyof GameType,
    'tags' as keyof GameType,
  ];

  ngOnInit() {
    if (this.gameType.id === 0) {
      this.type = 'Crear';
    } else {
      this.type = 'Actualizar';
    }
  }

  closeModal() {
    this.EarlyLeaveModal.emit();
  }

  SaveElement() {
    this.SavedElement.emit(this.gameType);
  }
}
