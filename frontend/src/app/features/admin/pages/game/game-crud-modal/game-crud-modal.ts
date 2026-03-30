import { I18nSelectPipe } from '@angular/common';
import {
  Component,
  effect,
  ElementRef,
  inject,
  input,
  linkedSignal,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { GameService } from '@shared/services/game.service';
import { Game } from '@shared/interfaces/game';
import { debounceTime, switchMap, tap } from 'rxjs';

@Component({
  selector: 'game-crud-modal',
  imports: [I18nSelectPipe, ReactiveFormsModule, FormsModule],
  templateUrl: './game-crud-modal.html',
})
export class GameCrudModal {
  game = input.required<Partial<Game>>();
  type = input.required<'add' | 'edit' | 'delete'>();
  open = input.required<boolean>();
  closed = output<void>();
  confirmAction = output<Game>();

  gameModal = viewChild.required<ElementRef<HTMLDialogElement>>('gameModal');

  fb = inject(FormBuilder);

  // Mapper for the modal's title using i18nSelectPipe
  titleMap: any = {
    edit: 'Modifica un juego.',
    delete: 'Borrar un juego',
  };

  gameForm = this.fb.nonNullable.group({
    id: [0, Validators.required],
    name: ['', Validators.required],
    description: ['', Validators.required],
    igdbId: [0, [Validators.required, Validators.min(1)]],
    imgUrl: ['', Validators.required],
  });
  openEffect = effect(() => {
    if (this.open()) {
      this.gameModal().nativeElement.showModal();
      this.gameForm.patchValue({
        id: this.game().id ?? 0,
        name: this.game().name ?? '',
        description: this.game().description ?? '',
        igdbId: this.game().igdbId ?? 0,
        imgUrl: this.game().imgUrl ?? '',
      });
    } else {
      this.gameModal().nativeElement.close();
    }
  });

  onDialogClose() {
    this.closed.emit();
  }

  emitGame() {
    if (this.gameForm.valid) {
      const game = this.gameForm.getRawValue();
      this.confirmAction.emit(game);
    }
  }
}
