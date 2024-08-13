import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
} from '@angular/core';
import { GameType } from 'src/common/interfaces.js';

@Component({
  selector: 'app-crud-modal',
  templateUrl: './crud-modal.component.html',
  styleUrls: ['./crud-modal.component.css'],
})
export class CrudModalComponent {
  @Output() EarlyLeaveModal = new EventEmitter<any>();
  @Output() SavedElement = new EventEmitter<GameType>();

  @Input() type: string = '';

  @Input() content: GameType = {
    id: 0,
    name: '',
    description: '',
    tags: '',
  };

  contentKeys: string[] = [];

  ngOnChanges() {
    this.contentKeys = Object.keys(this.content);
  }

  closeModal() {
    this.EarlyLeaveModal.emit();
  }

  SaveElement() {
    this.SavedElement.emit(this.content);
  }
}
