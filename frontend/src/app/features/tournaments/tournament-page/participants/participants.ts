import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { InscriptionService } from '@services/inscription.service';

@Component({
  selector: 'app-participants',
  imports: [DatePipe],
  templateUrl: './participants.html',
})
export class TournamentParticipants {
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  inscriptionService = inject(InscriptionService);

  tournamentId = this.activatedRoute.snapshot.queryParamMap.get('id') ?? '';

  inscriptionResource = rxResource({
    params: () => ({ id: this.tournamentId }),
    stream: ({ params }) => {
      const tournamentId = Number(params.id);

      return this.inscriptionService.getInscriptions(tournamentId);
    },
  });
}
