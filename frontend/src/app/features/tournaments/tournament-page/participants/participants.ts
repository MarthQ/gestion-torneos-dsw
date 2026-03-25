import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { InscriptionService } from '@services/inscription.service';
import { Pagination } from '@shared/components/pagination/pagination';
import { PaginationMeta } from '@shared/interfaces/api-response';

@Component({
  selector: 'app-participants',
  imports: [DatePipe, Pagination],
  templateUrl: './participants.html',
})
export class TournamentParticipants {
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  inscriptionService = inject(InscriptionService);

  page = signal(1);
  inscriptionsMeta = signal<PaginationMeta | undefined>(undefined);

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
    params: () => ({
      id: this.tournamentId,
      // refresh lets this component know if there was an inscription in tournament's inscriptions
      refresh: this.inscriptionService.inscriptionsVersionReadonly(),
    }),
    stream: ({ params }) => {
      const tournamentId = Number(params.id);

      return this.inscriptionService.getInscriptions(tournamentId);
    },
  });

  // Visual actions (pagination)
  pageChangedTo(newPage: number) {
    this.page.set(newPage);
  }
}
