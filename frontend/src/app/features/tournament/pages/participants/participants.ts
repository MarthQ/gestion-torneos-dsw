import { DatePipe } from '@angular/common';
import { Component, inject, linkedSignal, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { InscriptionService } from '@features/tournament/services/inscription.service';
import { PaginationMeta } from '@shared/interfaces/api-response';
import { map, tap } from 'rxjs';
import { Pagination } from '@shared/components/pagination/pagination';

@Component({
  imports: [DatePipe, Pagination],
  templateUrl: './participants.html',
})
export class Participants {
  activatedRoute = inject(ActivatedRoute);

  inscriptionService = inject(InscriptionService);

  tournamentId = signal(this.activatedRoute.parent?.snapshot.paramMap.get('id'));

  page = linkedSignal({
    source: this.tournamentId,
    computation: () => 1,
  });

  inscriptionsMeta = signal<PaginationMeta | undefined>(undefined);

  inscriptionResource = rxResource({
    params: () => ({ id: this.tournamentId() }),
    stream: ({ params }) => {
      const tournamentId = Number(params.id);
      console.log(tournamentId);

      return this.inscriptionService.getInscriptionsPaginated(tournamentId).pipe(
        tap((response) => this.inscriptionsMeta.set(response.meta)),
        tap((response) => console.log(response)),
        map((response) => response.data),
      );
    },
  });

  // Visual actions (pagination)
  pageChangedTo(newPage: number) {
    this.page.set(newPage);
  }
}
