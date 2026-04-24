import { I18nSelectPipe } from '@angular/common';
import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  output,
  viewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';

import { Game } from '@shared/interfaces/game';
import { Tag } from '@shared/interfaces/tag';
import { Tournament, TournamentFormDTO } from '@shared/interfaces/tournament';
import { User } from '@shared/interfaces/user';
import { Location } from '@shared/interfaces/location';
import { FormErrorLabel } from '@shared/components/formErrorLabel/formErrorLabel';
import { EVENT_TAGS } from '@features/admin/interfaces/default-tags.const';
import { CrudAction } from '@shared/interfaces/crudAction';
import { toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, EMPTY } from 'rxjs';
import { Region } from '@shared/interfaces/region';

@Component({
  selector: 'tournament-crud-modal',
  imports: [I18nSelectPipe, ReactiveFormsModule, FormErrorLabel],
  templateUrl: './tournament-crud-modal.html',
})
export class TournamentCrudModal {
  tournament = input.required<Partial<Tournament>>();
  type = input.required<'add' | 'edit' | 'delete'>();
  open = input.required<boolean>();
  closed = output<void>();
  confirmAction = output<CrudAction<TournamentFormDTO>>();

  locationResource = input.required<Location[]>();
  gameResource = input.required<Game[]>();
  tagResource = input.required<Tag[]>();
  userResource = input.required<User[]>();
  regionResource = input.required<Region[]>();

  tournamentModal = viewChild.required<ElementRef<HTMLDialogElement>>('tournamentModal');

  fb = inject(FormBuilder);

  private readonly EXCLUSIVE_GROUPS: readonly string[][] = [
    [EVENT_TAGS.VIRTUAL.name, EVENT_TAGS.PRESENTIAL.name],
    [EVENT_TAGS.HAS_PRIZE.name, EVENT_TAGS.NO_PRIZE.name],
  ];

  // Mapper for the modal's title using i18nSelectPipe
  titleMap: any = {
    add: 'Agrega un torneo',
    edit: 'Modifica un torneo.',
    delete: 'Borrar un torneo',
  };

  tournamentForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    datetimeinit: [new Date(), Validators.required],
    status: ['', Validators.required],
    maxParticipants: [0, [Validators.required, Validators.min(2)]],
    creator: [0, [Validators.required, Validators.min(1)]],
    location: [0],
    region: [0],
    game: [0, [Validators.required, Validators.min(1)]],
    tags: this.fb.array<FormControl<number>>([]),
  });

  tagsValue = toSignal(
    this.tournamentForm.get('tags')?.valueChanges.pipe(debounceTime(300)) ?? EMPTY,
  );

  setTagValidatorEffect = effect(() => {
    if (this.tagResource()?.length) {
      this.tournamentTags.setValidators(this.areTagsCoherent());
      this.tournamentTags.updateValueAndValidity();
    }
  });

  areTagsCoherent(): ValidatorFn {
    return (control: AbstractControl) => {
      const availableTags = this.tagResource();

      if (!availableTags?.length) return null;

      const tagIds: number[] = control.value ?? [];

      const selectedTagNames = availableTags
        .filter((t) => tagIds.includes(t.id))
        .map((t) => t.name);

      const hasConflict = this.EXCLUSIVE_GROUPS.some(
        (group) => group.filter((tag) => selectedTagNames.includes(tag)).length > 1,
      );

      return hasConflict ? { tagsNotCoherent: true } : null;
    };
  }

  dynamicValidatorsEffect = effect(() => {
    const type = this.eventType();

    const locationControl = this.tournamentForm.get('location');
    const regionControl = this.tournamentForm.get('region');
    // Location: si es virtual, limpiar el valor
    if (locationControl) {
      if (type === 'virtual' || type === null) {
        locationControl.reset(); // Reset a null/initial
      }
      locationControl.setValidators(
        type === 'presencial' || type === 'mixed' ? [Validators.required, Validators.min(1)] : null,
      );
      locationControl.updateValueAndValidity();
    }
    // Region: si es presencial, limpiar el valor
    if (regionControl) {
      if (type === 'presencial' || type === null) {
        regionControl.reset();
      }
      regionControl.setValidators(
        type === 'virtual' || type === 'mixed' ? [Validators.required, Validators.min(1)] : null,
      );
      regionControl.updateValueAndValidity();
    }
  });

  eventType = computed(() => {
    const tagIds = this.tagsValue();
    const allTags = this.tagResource();
    if (!tagIds || !allTags) return null;
    const hasVirtual = allTags.some(
      (t) => t.name === EVENT_TAGS.VIRTUAL.name && tagIds.includes(t.id),
    );
    const hasPresencial = allTags.some(
      (t) => t.name === EVENT_TAGS.PRESENTIAL.name && tagIds.includes(t.id),
    );
    if (hasVirtual && hasPresencial) return 'mixed';
    if (hasVirtual) return 'virtual';
    if (hasPresencial) return 'presencial';
    return null;
  });

  get tournamentTags() {
    return this.tournamentForm.get('tags') as FormArray;
  }

  toggleTag(tagId: number) {
    const currentTags: number[] = this.tournamentTags.value ?? [];
    const index = currentTags.indexOf(tagId);
    const availableTags = this.tagResource();

    if (!availableTags || availableTags.length === 0) return;

    const selectedTag = availableTags.find((t) => t.id === tagId);
    if (!selectedTag) return;

    if (index !== -1) {
      this.tournamentTags.removeAt(index);
      return;
    }

    const groupOfSelectedTag = this.EXCLUSIVE_GROUPS.find((group) =>
      group.includes(selectedTag.name),
    );

    if (groupOfSelectedTag) {
      const tagsToRemove = availableTags.filter(
        (t) => groupOfSelectedTag.includes(t.name) && currentTags.includes(t.id),
      );

      tagsToRemove.forEach((tag) => {
        const idx = currentTags.indexOf(tag.id);
        if (idx !== -1) {
          this.tournamentTags.removeAt(idx);
          currentTags.splice(idx, 1);
        }
      });
    }

    this.tournamentTags.push(this.fb.control(tagId));
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
        name: this.tournament().name ?? '',
        description: this.tournament().description ?? '',
        datetimeinit: this.tournament().datetimeinit ?? new Date(),
        status: this.tournament().status ?? 'Abierto',
        maxParticipants: this.tournament().maxParticipants ?? 10,
        creator: this.tournament().creator?.id ?? 0,
        location: this.tournament().location?.id ?? 0,
        region: this.tournament().region?.id ?? 0,
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
      const type = this.eventType();

      const tournament = this.tournamentForm.value as Omit<TournamentFormDTO, 'id'>;

      if (type === 'virtual' || type === null) {
        tournament.region = this.tournamentForm.value.region;
        tournament.location = undefined;
      }
      if (type === 'presencial' || type === null) {
        tournament.location = this.tournamentForm.value.location;
        tournament.region = undefined;
      }
      const id = this.tournament()?.id;

      switch (this.type()) {
        case 'add':
          this.confirmAction.emit({
            actionType: 'create',
            data: tournament,
          });
          break;
        case 'edit':
          this.confirmAction.emit({
            actionType: 'update',
            data: {
              id: id!,
              ...tournament,
            },
          });
          break;
        case 'delete':
          this.confirmAction.emit({ actionType: 'delete', data: { id: id! } });
          break;
      }
    }
  }
}
