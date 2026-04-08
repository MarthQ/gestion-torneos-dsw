import { DatePipe, I18nSelectPipe, JsonPipe, TitleCasePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '@features/auth/services/auth.service';
import { TournamentStatus } from '@shared/interfaces/tournamentStatus';
import { TournamentService } from '@shared/services/tournament.service';
import { Toaster } from '@shared/utils/toaster';
import { TournamentUtils } from '@shared/utils/tournament-utils';
import { map, tap } from 'rxjs';

@Component({
  imports: [I18nSelectPipe, DatePipe, TitleCasePipe],
  templateUrl: './overview.html',
})
export class Overview {
  user = inject(AuthService).user();
  activatedRoute = inject(ActivatedRoute);
  tournamentId = signal(this.activatedRoute.parent?.snapshot.paramMap.get('id'));
  getBackgroundStyle = TournamentUtils.GetGameImage;
  tournamentStatusMap = TournamentUtils.tournamentStatusMap;
  tournamentStatusBadgeMap = TournamentUtils.tournamentStatusBadgeMap;

  private tournamentService = inject(TournamentService);

  tournamentSteps = [
    { name: 'Inscripciones' },
    { name: 'Generación de llave' },
    { name: 'En Curso' },
    { name: 'Finalizado' },
  ];

  private statusToStepIndex: Record<TournamentStatus, number> = {
    open: 0,
    closed: 1,
    running: 2,
    finished: 3,
    canceled: 0,
  };

  tournamentResource = rxResource({
    params: () => ({ id: this.tournamentId() }),
    stream: ({ params }) => {
      const tournamentId = Number(params.id);

      return this.tournamentService
        .getTournament(tournamentId)
        .pipe(map((response) => response.tournamentData));
    },
  });

  closeInscription() {
    if (!this.tournamentId()) return;
    this.tournamentService.closeInscriptions(this.tournamentId()!).subscribe({
      next: (bracketManagerTournament) => {
        Toaster.success(`Bracket generated succesfully`);
        console.log({ bracketManagerTournament });
      },
      error: (message) => {
        Toaster.error(message);
      },
    });
  }

  userIsCreator(): boolean {
    if (this.tournamentResource.hasValue() && this.user) {
      return this.user.id === this.tournamentResource.value().creator.id;
    }
    return false;
  }

  userIsInscribed() {
    if (this.tournamentResource.hasValue() && this.user) {
      return this.tournamentResource
        .value()!
        .inscriptions?.find((inscription) => inscription.user?.id === this.user!.id);
    }
    return false;
  }

  // Participants left to reach the maximum
  participantsLeft(): number {
    return (
      (this.tournamentResource.value()?.maxParticipants || 0) -
      (this.tournamentResource.value()?.inscriptions?.length || 0)
    );
  }

  // This helps to visualize the steps based on tournament's status
  get activeStepIndex(): number {
    const status = this.tournamentResource.value()?.status as TournamentStatus | undefined;
    return status ? this.statusToStepIndex[status] : 0;
  }
}
