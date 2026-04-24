import { Component, computed, effect, inject, signal } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { EVENT_TAGS } from '@features/admin/interfaces/default-tags.const';
import { GameService } from '@shared/services/game.service';
import { LocationService } from '@shared/services/location.service';
import { TagService } from '@shared/services/tag.service';
import { FormErrorLabel } from '@shared/components/formErrorLabel/formErrorLabel';
import { DatePipe } from '@angular/common';
import { TournamentService } from '@shared/services/tournament.service';
import { Toaster } from '@shared/utils/toaster';
import { TournamentFormDTO } from '@shared/interfaces/tournament';
import { Router } from '@angular/router';
import { TournamentUtils } from '@shared/utils/tournament-utils';
import { RegionService } from '@shared/services/region.service';
import { debounceTime, EMPTY } from 'rxjs';

@Component({
  imports: [ReactiveFormsModule, FormErrorLabel, DatePipe],
  templateUrl: './wizard.html',
})
export class Wizard {
  private locationService = inject(LocationService);
  private tagService = inject(TagService);
  private gameService = inject(GameService);
  private regionService = inject(RegionService);
  private tournamentService = inject(TournamentService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  getGameImage = TournamentUtils.GetGameImage;

  locationResource = rxResource({
    stream: () => this.locationService.getLocations(),
  });
  tagResource = rxResource({
    stream: () => this.tagService.getTags(),
  });
  gameResource = rxResource({
    stream: () => this.gameService.getGames(),
  });
  regionResource = rxResource({
    stream: () => this.regionService.getRegions(),
  });

  tournamentTypes = signal([
    {
      value: 'single_elimination',
      name: 'Single Elimination',
    },
    {
      value: 'double_elimination',
      name: 'Double Elimination',
    },
  ]);

  steps = [
    { name: 'Descripción', isActive: signal<boolean>(true) },
    { name: 'Configuración', isActive: signal<boolean>(false) },
    { name: 'Confirmación', isActive: signal<boolean>(false) },
  ];

  stepActive = signal<number>(1);

  private readonly EXCLUSIVE_GROUPS: readonly string[][] = [
    [EVENT_TAGS.VIRTUAL.name, EVENT_TAGS.IN_PERSON.name],
    [EVENT_TAGS.HAS_PRIZE.name, EVENT_TAGS.NO_PRIZE.name],
  ];

  tournamentForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    datetimeinit: [new Date(), Validators.required],
    game: [0, [Validators.required, Validators.min(1)]],
    maxParticipants: [2, [Validators.required, Validators.min(2)]],
    location: [0],
    region: [0],
    type: ['single_elimination', [Validators.required]],
    tags: this.fb.array<FormControl<number>>([]),
  });

  tagsValue = toSignal(
    this.tournamentForm.get('tags')?.valueChanges.pipe(debounceTime(300)) ?? EMPTY,
  );

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
    const allTags = this.tagResource.value();
    if (!tagIds || !allTags) return null;
    const hasVirtual = allTags.some(
      (t) => t.name === EVENT_TAGS.VIRTUAL.name && tagIds.includes(t.id),
    );
    const hasPresencial = allTags.some(
      (t) => t.name === EVENT_TAGS.IN_PERSON.name && tagIds.includes(t.id),
    );
    if (hasVirtual && hasPresencial) return 'mixed';
    if (hasVirtual) return 'virtual';
    if (hasPresencial) return 'presencial';
    return null;
  });

  get tournamentTags() {
    return this.tournamentForm.get('tags') as FormArray;
  }

  setTagValidatorEffect = effect(() => {
    if (this.tagResource.value()?.length) {
      this.tournamentTags.setValidators(this.areTagsCoherent());
      this.tournamentTags.updateValueAndValidity();
    }
  });

  areTagsCoherent(): ValidatorFn {
    return (control: AbstractControl) => {
      const availableTags = this.tagResource.value();

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

  toggleTag(tagId: number) {
    const currentTags: number[] = this.tournamentTags.value ?? [];
    const index = currentTags.indexOf(tagId);
    const availableTags = this.tagResource.value();

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

  nextStep() {
    this.steps.at(this.stepActive())?.isActive.set(true);
    this.stepActive.set(this.stepActive() + 1);
  }

  backStep() {
    this.stepActive.set(this.stepActive() - 1);
    this.steps.at(this.stepActive())?.isActive.set(false);
  }

  onSubmit(event: Event) {
    event.preventDefault();

    if (this.tournamentForm.invalid) {
      this.tournamentForm.markAllAsTouched();
      return;
    }

    const type = this.eventType();

    const tournament = this.tournamentForm.value as TournamentFormDTO;

    if (type === 'virtual' || type === null) {
      delete tournament.location;
    }

    if (type === 'presencial' || type === null) {
      delete tournament.region;
    }

    this.tournamentService.createTournament(tournament).subscribe({
      next: (createdTournament) => {
        Toaster.success('Torneo creado correctamente');
        this.router.navigate(['/tournament', createdTournament.id, 'overview']);
      },
      error: (message) => {
        Toaster.error(message);
      },
    });
  }
}
