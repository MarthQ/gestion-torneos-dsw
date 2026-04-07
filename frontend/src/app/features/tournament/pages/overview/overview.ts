import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TournamentService } from '@shared/services/tournament.service';
import { Toaster } from '@shared/utils/toaster';

@Component({
  imports: [],
  templateUrl: './overview.html',
})
export class Overview {
  activatedRoute = inject(ActivatedRoute);

  tournamentId = signal(this.activatedRoute.parent?.snapshot.paramMap.get('id'));

  private tournamentService = inject(TournamentService);

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
}
