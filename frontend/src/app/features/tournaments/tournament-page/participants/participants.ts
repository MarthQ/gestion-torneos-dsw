import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { InscriptionService } from '@services/inscription.service';
import { Pagination } from '@shared/components/pagination/pagination';

@Component({
  selector: 'app-participants',
  imports: [DatePipe, Pagination],
  templateUrl: './participants.html',
})
export class TournamentParticipants {
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  inscriptionService = inject(InscriptionService);

  private getTournamentIdFromRoute(): string {
    let route: ActivatedRoute | null = this.activatedRoute;
    while (route) {
      const id = route.snapshot.paramMap.get('id');
      if (id) return id;
      route = route.parent;
    }
    return '';
  }

  tournamentId = this.getTournamentIdFromRoute();

  inscriptionResource = rxResource({
    params: () => ({ id: this.tournamentId }),
    stream: ({ params }) => {
      console.log(params.id);
      const tournamentId = Number(params.id);

      return this.inscriptionService.getInscriptions(tournamentId);
    },
  });
}
