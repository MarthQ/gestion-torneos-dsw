import { Component, effect, inject, signal } from '@angular/core';
import { Tournament } from '@shared/interfaces/tournament';
import { TournamentService } from 'src/app/services/tournament.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-tournament-crud',
  imports: [DatePipe],
  templateUrl: './tournament-crud.html',
})
export class TournamentCrud {
  tournamentService = inject(TournamentService);
  query = signal('');

  tournamentResource = rxResource({
    params: () => ({ query: this.query() }),
    stream: ({ params }) => {
      return this.tournamentService.getAllTournaments();
    },
  });
}
