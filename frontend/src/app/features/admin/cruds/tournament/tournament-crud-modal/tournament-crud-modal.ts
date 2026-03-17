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
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';

import { Game } from '@shared/interfaces/game';
import { Tag } from '@shared/interfaces/tag';
import { Tournament, TournamentFormDTO } from '@shared/interfaces/tournament';
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
  confirmAction = output<TournamentFormDTO>();

  locationResource = input.required<ResourceRef<Location[] | undefined>>();
  gameResource = input.required<ResourceRef<Game[] | undefined>>();
  tagResource = input.required<ResourceRef<Tag[] | undefined>>();
  userResource = input.required<ResourceRef<User[] | undefined>>();

  tournamentModal = viewChild.required<ElementRef<HTMLDialogElement>>('tournamentModal');

  fb = inject(FormBuilder);

  // Mapper for the modal's title using i18nSelectPipe
  titleMap: any = {
    add: 'Agrega un torneo',
    edit: 'Modifica un torneo.',
    delete: 'Borrar un torneo',
  };

  tournamentForm = this.fb.nonNullable.group({
    id: [0, Validators.required],
    name: ['', Validators.required],
    description: ['', Validators.required],
    datetimeinit: [new Date(), Validators.required],
    status: ['', Validators.required],
    maxParticipants: [0, [Validators.required, Validators.min(2)]],
    creator: [0, [Validators.required, Validators.min(1)]],
    location: [0, [Validators.required, Validators.min(1)]],
    game: [0, [Validators.required, Validators.min(1)]],
    tags: this.fb.array([], this.areTagsCoherent()),
  });

  areTagsCoherent(): ValidatorFn {
    return (control: AbstractControl) => {
      const tagIds: number[] = control.value ?? [];

      if (
        (tagIds.includes(1) && tagIds.includes(2)) ||
        (tagIds.includes(3) && tagIds.includes(4))
      ) {
        return { tagsNotCoherent: true };
      }

      return null;
    };
  }

  get tournamentTags() {
    return this.tournamentForm.get('tags') as FormArray;
  }

  toggleTag(tagId: number) {
    const currentTags: number[] = this.tournamentTags.value ?? [];
    const index = currentTags.indexOf(tagId);

    if (index === -1) {
      this.tournamentTags.push(this.fb.control(tagId));
    } else {
      this.tournamentTags.removeAt(index);
    }
    console.log(this.tournamentForm.get('tags')?.value);
  }

  initTags(tags: Tag[]) {
    this.tournamentTags.clear();
    tags.forEach((tag) => this.tournamentTags.push(this.fb.control(tag.id)));
  }

  openEffect = effect(() => {
    if (this.open()) {
      this.tournamentModal().nativeElement.showModal();

      this.initTags(this.tournament().tags ?? []);

      this.tournamentForm.patchValue({
        id: this.tournament().id ?? 0,
        name: this.tournament().name ?? '',
        description: this.tournament().description ?? '',
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
  }
  emitTournament() {
    if (this.tournamentForm.valid) {
      const tournament = this.tournamentForm.getRawValue();
      this.confirmAction.emit(tournament as TournamentFormDTO);
    }
  }
}
