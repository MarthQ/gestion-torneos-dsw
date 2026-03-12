import { I18nSelectPipe } from '@angular/common';
import {
  Component,
  effect,
  ElementRef,
  inject,
  input,
  output,
  ResourceRef,
  viewChild,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Game } from '@shared/interfaces/game';
import { Tag } from '@shared/interfaces/tag';
import { Tournament } from '@shared/interfaces/tournament';
import { User } from '@shared/interfaces/user';
import { Location } from '@shared/interfaces/location';

@Component({
  selector: 'tournament-crud-modal',
  imports: [I18nSelectPipe, ReactiveFormsModule],
  templateUrl: './tournament-crud-modal.html',
})
export class TournamentCrudModal {
  tournament = input.required<Partial<Tournament>>();
  type = input.required<'add' | 'edit' | 'delete'>();
  open = input.required<boolean>();
  closed = output<void>();
  confirmAction = output<any>();

  locationResource = input.required<ResourceRef<Location[] | undefined>>();
  gameResource = input.required<ResourceRef<Game[] | undefined>>();
  tagResource = input.required<ResourceRef<Tag[] | undefined>>();
  userResource = input.required<ResourceRef<User[] | undefined>>();

  tournamentModal = viewChild.required<ElementRef<HTMLDialogElement>>('tournamentModal');

  fb = inject(FormBuilder);

  // Mapper for the modal's title using i18nSelectPipe
  titleMap: any = {
    add: 'Agrega una localidad',
    edit: 'Modifica una localidad.',
    delete: 'Borrar una localidad',
  };

  tournamentForm = this.fb.group({
    id: [0, Validators.required],
    name: ['', Validators.required],
    description: ['', Validators.required],
    datetimeinit: [new Date(), Validators.required],
    status: ['', Validators.required],
    maxParticipants: [0, [Validators.required, Validators.min(0)]],
    creator: [0, Validators.required],
    location: [0, Validators.required],
    game: [0, Validators.required],
  });

  openEffect = effect(() => {
    if (this.open()) {
      this.tournamentModal().nativeElement.showModal();
      this.tournamentForm.patchValue({
        id: this.tournament().id ?? 0,
        name: this.tournament().name ?? '',
        datetimeinit: this.tournament().datetimeinit ?? new Date(),
        status: this.tournament().status ?? 'Abierto',
        maxParticipants: this.tournament().maxParticipants ?? 10,
        creator: this.tournament().creator?.id ?? 0,
        location: this.tournament().location?.id ?? 0,
        game: this.tournament().game?.id ?? 0,
      });
    } else {
      this.tournamentModal().nativeElement.close();
    }
  });

  onDialogClose() {
    this.closed.emit();
    console.log(this.tournamentForm.getRawValue());
    console.log(this.tournamentForm.errors);
  }
  emitTournament() {
    if (this.tournamentForm.valid) {
      const tournament = this.tournamentForm.getRawValue();
      this.confirmAction.emit(tournament);
    }
  }
}
