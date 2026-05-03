import { CommonModule, DatePipe, JsonPipe, SlicePipe } from '@angular/common';
import { Component, computed, inject, linkedSignal, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { InscriptionService } from '@features/tournament/services/inscription.service';
import { PaginationMeta } from '@shared/interfaces/api-response';
import { map, of, tap } from 'rxjs';
import { Pagination } from '@shared/components/pagination/pagination';
import { getAvatarPath } from '@shared/constants/avatar.constant';
import { TournamentService } from '@shared/services/tournament.service';
import { Inscription } from '@shared/interfaces/inscription';

@Component({
  imports: [DatePipe, Pagination, SlicePipe, CommonModule],
  templateUrl: './participants.html',
  styles: `
    .podium-1 {
      background: linear-gradient(135deg, #fde047 0%, #ca8a04 100%);
    }
    .podium-2 {
      background: linear-gradient(135deg, #e5e7eb 0%, #9ca3af 100%);
    }
    .podium-3 {
      background: linear-gradient(135deg, #fb923c 0%, #9a3412 100%);
    }
    .glow-gold {
      box-shadow: 0 0 20px rgba(234, 179, 8, 0.3);
    }
  `,
})
export class Participants {
  activatedRoute = inject(ActivatedRoute);

  inscriptionService = inject(InscriptionService);
  tournamentService = inject(TournamentService);

  tournamentId = signal(this.activatedRoute.parent?.snapshot.paramMap.get('id'));

  getAvatarPath = getAvatarPath;

  page = linkedSignal({
    source: this.tournamentId,
    computation: () => 1,
  });

  inscriptionsMeta = signal<PaginationMeta | undefined>(undefined);

  tournamentResource = rxResource({
    params: () => ({ id: this.tournamentId() }),
    stream: ({ params }) => {
      const tournamentId = Number(params.id);

      return this.tournamentService
        .getTournament(tournamentId)
        .pipe(map((response) => response.tournamentData));
    },
  });

  inscriptionResource = rxResource({
    params: () => ({ id: this.tournamentId() }),
    stream: ({ params }) => {
      const tournamentId = Number(params.id);

      return this.inscriptionService.getInscriptionsPaginated(tournamentId).pipe(
        tap((response) => this.inscriptionsMeta.set(response.meta)),
        tap((response) => console.log(response)),
        map((response) => response.data),
      );
    },
  });

  standingResource = rxResource({
    params: () => ({ id: this.tournamentId() }),
    stream: ({ params }) => {
      const tournamentId = Number(params.id);

      return this.tournamentService
        .getStandings(tournamentId)
        .pipe(tap((response) => console.log(response)));
    },
  });

  participantsToShow = computed(() => {
    const status = this.tournamentResource.value()?.status;
    const standingsResponse = this.standingResource.value();
    const inscriptions = this.inscriptionResource.value();

    if (status === 'finished') {
      // We return the array with ranks
      return standingsResponse?.standings ?? [];
    }
    // If it didn't finish, we return normal inscriptions
    return inscriptions ?? [];
  });

  podiumParticipants = computed(() => {
    const status = this.tournamentResource.value()?.status;

    // There are only podium participants if the tournament is finished
    if (status !== 'finished') {
      return [];
    }
    const standingsResponse = this.standingResource.value();
    const allStandings = standingsResponse?.standings ?? [];

    // There may be tournaments where there are two people that get the 3rd place
    return allStandings
      .filter((player: any) => player.rank >= 1 && player.rank <= 3)
      .sort((a: any, b: any) => a.rank - b.rank) // Order by rank
      .splice(0, 3);
  });

  // Visual actions (pagination)
  pageChangedTo(newPage: number) {
    this.page.set(newPage);
  }
}
