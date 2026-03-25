import { DatePipe, I18nSelectPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import {
  ActivatedRoute,
  Router,
  RouterOutlet,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { TournamentService } from '@services/tournament.service';
import { UserService } from '@services/user.service';
import { InscriptionDTO } from '@shared/interfaces/inscription';
import { Toaster } from '@shared/utils/toaster';
import { GetGameImage, TournamentStatusMap } from '@shared/utils/tournament-styles';
import { tap } from 'rxjs';
import { InscriptionModal } from './inscription-modal/inscription-modal';
import { InscriptionService } from '@services/inscription.service';

@Component({
  selector: 'tournament-page',
  imports: [I18nSelectPipe, DatePipe, RouterOutlet, RouterLink, RouterLinkActive, InscriptionModal],
  templateUrl: './tournament-page.html',
})
export class TournamentPage {
  //TODO: Changed this when auth gets implemented
  userService = inject(UserService);
  userLoggedId = signal<number>(3);

  userLoggedResource = rxResource({
    params: () => ({ id: this.userLoggedId() }),
    stream: ({ params }) => {
      return this.userService.getUserById(params.id);
    },
  });

  openModal = signal(false);

  tournamentStatusMap = TournamentStatusMap;
  getBackgroundStyle = GetGameImage;

  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);

  tournamentService = inject(TournamentService);
  inscriptionService = inject(InscriptionService);

  tournamentId = this.activatedRoute.parent?.snapshot.paramMap.get('id') ?? '';
  tournamentCover = signal('');

  tournamentResource = rxResource({
    params: () => ({ id: this.tournamentId }),
    stream: ({ params }) => {
      if (!params.id) {
        this.router.navigate(['/tournaments/explore']);
      }

      const tournamentId = Number(params.id);

      return this.tournamentService
        .getTournament(tournamentId)
        .pipe(tap((data) => this.tournamentCover.set(this.getBackgroundStyle(data.game, 'big'))));
    },
  });

  // Participants left to reach the maximum
  participantsLeft(): number {
    return (
      (this.tournamentResource.value()?.maxParticipants || 0) -
      (this.tournamentResource.value()?.inscriptions?.length || 0)
    );
  }

  userIsCreator() {
    return this.userLoggedId() === this.tournamentResource.value()?.creator.id;
  }
  userIsInscribed() {
    return this.tournamentResource
      .value()!
      .inscriptions?.find((inscription) => inscription.user?.id === this.userLoggedId());
  }

  startTournament() {
    // Validation check again
    if (this.userIsCreator() && this.tournamentResource.hasValue()) {
      this.tournamentService.startTournament(this.tournamentResource.value()).subscribe({
        next: () => {
          Toaster.success('El torneo comenzó!');
          this.tournamentResource.reload();
        },
        error: (err) => {
          Toaster.error(err);
          console.error(err);
        },
      });
    }
  }

  completeInscription(partialInscription: { nickname: string }) {
    const newInscription: InscriptionDTO = {
      id: 0,
      nickname: partialInscription.nickname,
      inscriptionDate: new Date(),
      points: 0,
      tournament: this.tournamentResource.value()!.id,
      user: this.userLoggedResource.value()!.id,
    };

    this.inscriptionService.InscribeToTournament(newInscription).subscribe({
      next: () => {
        Toaster.success('Te inscribiste correctamente al torneo!');
        this.tournamentResource.reload();
        this.inscriptionService.notifyInscriptionsChanged();
      },
      error: (err) => {
        Toaster.error(err);
        console.error(err);
      },
    });
  }

  removeInscription() {
    const userInscription = this.tournamentResource
      .value()
      ?.inscriptions?.find((inscription) => inscription.user!.id === this.userLoggedId());

    this.inscriptionService.removeInscription(userInscription!.id).subscribe({
      next: () => {
        Toaster.success('Borraste tu inscripción al torneo');
        this.tournamentResource.reload();
        this.inscriptionService.notifyInscriptionsChanged();
      },
      error: (err) => {
        Toaster.error(err);
        console.error(err);
      },
    });
  }
}
