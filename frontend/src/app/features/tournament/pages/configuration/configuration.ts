import { Component, computed, effect, inject, signal } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import {
  FormArray,
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { GameService } from '@shared/services/game.service';
import { LocationService } from '@shared/services/location.service';
import { TagService } from '@shared/services/tag.service';
import { RegionService } from '@shared/services/region.service';
import { FormErrorLabel } from '@shared/components/formErrorLabel/formErrorLabel';
import { TournamentUtils } from '@shared/utils/tournament-utils';
import { TournamentService } from '@shared/services/tournament.service';
import { ActivatedRoute } from '@angular/router';
import { Tournament, TournamentFormDTO } from '@shared/interfaces/tournament';
import { Toaster } from '@shared/utils/toaster';
import { map, firstValueFrom } from 'rxjs';
import { FormUtils } from '@shared/utils/form-utils';
import { GameImagePipe, IGDB_SIZE } from '../../../../shared/pipes/game-image.pipe';
import { JsonPipe } from '@angular/common';
import { EVENT_TAGS } from '@features/admin/interfaces/default-tags.const';
import { debounceTime, EMPTY } from 'rxjs';

@Component({
  imports: [ReactiveFormsModule, FormErrorLabel, GameImagePipe],
  templateUrl: './configuration.html',
})
export class Configuration {
  // Injects
  private locationService = inject(LocationService);
  private tagService = inject(TagService);
  private gameService = inject(GameService);
  private tournamentService = inject(TournamentService);
  private fb = inject(FormBuilder);
  private activatedRoute = inject(ActivatedRoute);
  private regionService = inject(RegionService);
  IGDB_SIZE = IGDB_SIZE;

  // Signals
  private tournamentId = signal(this.activatedRoute.parent?.snapshot.paramMap.get('id'));
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

  selectedGameImage = signal('');

  tournamentStatus = computed(() => this.tournamentResource.value()?.status ?? 'open');

  inscriptionsCount = computed(() => this.tournamentResource.value()?.inscriptions?.length ?? 0);

  isTournamentOpen = computed(() => this.tournamentStatus() === 'open');

  isTournamentClosed = computed(() => this.tournamentStatus() === 'closed');

  isTournamentLocked = computed(() => {
    const status = this.tournamentStatus();
    return status === 'running' || status === 'finished' || status === 'canceled';
  });

  isNameDisabled = computed(() => this.isTournamentClosed() || this.isTournamentLocked());

  isTypeDisabled = computed(() => this.isTournamentClosed() || this.isTournamentLocked());

  isMaxParticipantsDisabled = computed(
    () => this.isTournamentClosed() || this.isTournamentLocked(),
  );

  isAllDisabled = computed(() => this.isTournamentLocked());

  // Resources
  locationResource = rxResource({
    stream: () => this.locationService.getLocations(),
  });
  regionResource = rxResource({
    stream: () => this.regionService.getRegions(),
  });
  tagResource = rxResource({
    stream: () => this.tagService.getTags(),
  });
  gameResource = rxResource({
    stream: () => this.gameService.getGames(),
  });
  tournamentResource = rxResource({
    params: () => ({ id: this.tournamentId() }),
    stream: ({ params }) => {
      const id = Number(params.id);
      return this.tournamentService
        .getTournament(id)
        .pipe(map((response) => response.tournamentData));
    },
  });

  // Effects
  private toggle(controlName: string, disabled: boolean) {
    const control = this.tournamentForm.get(controlName);
    disabled ? control?.disable({ emitEvent: false }) : control?.enable({ emitEvent: false });
  }

  initializeEffect = effect(() => {
    const tournament = this.tournamentResource.value();
    const availableTags = this.tagResource.value();

    if (tournament && availableTags && availableTags.length > 0) {
      this.setFormValue(tournament);
    }

    this.toggle('name', this.isNameDisabled());
    this.toggle('description', this.isAllDisabled());
    this.toggle('datetimeinit', this.isAllDisabled());
    this.toggle('game', this.isAllDisabled());
    this.toggle('maxParticipants', this.isMaxParticipantsDisabled());
    this.toggle('location', this.isAllDisabled());
    this.toggle('type', this.isTypeDisabled());
  });

  setTagValidatorEffect = effect(() => {
    if (this.tagResource.value()?.length) {
      this.tournamentTags.setValidators(
        TournamentUtils.tagsCoherentValidator(() => this.tagResource.value()),
      );
      this.tournamentTags.updateValueAndValidity();
    }
  });

  setMaxParticipantsValidatorEffect = effect(() => {
    const maxParticipantsControl = this.tournamentForm.get('maxParticipants');
    if (maxParticipantsControl) {
      maxParticipantsControl.setValidators([
        Validators.required,
        TournamentUtils.minParticipantsValidator(() => this.inscriptionsCount(), 2),
      ]);
      maxParticipantsControl.updateValueAndValidity();
    }
  });

  // Forms and Methods
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

  dynamicValidatorsEffect = effect(() => {
    const type = this.eventType();

    const locationControl = this.tournamentForm.get('location');
    const regionControl = this.tournamentForm.get('region');

    if (locationControl) {
      if (type === 'virtual' || type === null) {
        locationControl.reset();
      }
      locationControl.setValidators(
        type === 'presencial' || type === 'mixed' ? [Validators.required, Validators.min(1)] : null,
      );
      locationControl.updateValueAndValidity();
    }

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

  get tournamentTags() {
    return this.tournamentForm.get('tags') as FormArray;
  }

  getGameName(gameId: number): string | null {
    const games = this.gameResource.value();
    if (!games) return null;
    return games.find((g) => g.id === gameId)?.imgId ?? null;
  }

  initTags(tags: number[]) {
    this.tournamentTags.clear();

    tags.forEach((tagId) => this.tournamentTags.push(this.fb.control(tagId)));
  }

  setFormValue(tournament: Tournament) {
    this.tournamentForm.patchValue({
      name: tournament.name,
      description: tournament.description,
      datetimeinit: FormUtils.formatDateForInput(tournament.datetimeinit),
      game: tournament.game?.id ?? 0,
      maxParticipants: tournament.maxParticipants,
      location: tournament.location?.id ?? 0,
      region: (tournament as any).region?.id ?? 0,
      type: tournament.type,
    } as any);

    const tagIds = tournament.tags?.map((tag) => tag.id) ?? [];
    this.initTags(tagIds);

    this.selectedGameImage.set(TournamentUtils.GetGameImage(tournament.game, 'cover_big'));
  }

  toggleTag(tagId: number) {
    const currentTags: number[] = this.tournamentTags.value ?? [];
    const availableTags = this.tagResource.value();
    if (!availableTags || availableTags.length === 0) return;
    const newTags = TournamentUtils.toggleExclusiveTag(currentTags, tagId, availableTags);
    // Rebuild FormArray with new tags
    this.tournamentTags.clear();
    newTags.forEach((tagId) => this.tournamentTags.push(this.fb.control(tagId)));
  }

  isTagSelected(tagId: number): boolean {
    return TournamentUtils.isTagSelected(this.tournamentTags.value ?? [], tagId);
  }

  onSubmit(event: Event) {
    event.preventDefault();

    if (this.tournamentForm.invalid) {
      this.tournamentForm.markAllAsTouched();
      Toaster.error('Por favor complete todos los campos obligatorios');
      return;
    }

    if (this.isTournamentLocked()) {
      Toaster.error('No se puede modificar un torneo que está en curso, terminado o cancelado');
      return;
    }

    const formValue = this.tournamentForm.getRawValue();
    const type = this.eventType();

    const tournamentData: TournamentFormDTO = {
      id: +this.tournamentId()!,
      name: formValue.name,
      description: formValue.description,
      datetimeinit: formValue.datetimeinit,
      game: formValue.game,
      maxParticipants: formValue.maxParticipants,
      type: formValue.type,
      tags: formValue.tags,
    };

    if (type === 'virtual' || type === null) {
      // No enviar location
    } else {
      tournamentData.location = formValue.location || undefined;
    }

    if (type === 'presencial' || type === null) {
      // No enviar region
    } else {
      tournamentData.region = formValue.region || undefined;
    }

    this.tournamentService.updateTournament(tournamentData).subscribe();
  }
}
