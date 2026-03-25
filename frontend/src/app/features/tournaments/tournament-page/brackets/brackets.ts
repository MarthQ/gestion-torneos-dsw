import { AfterViewInit, Component, ElementRef, inject, viewChild } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { InscriptionService } from '@services/inscription.service';

import { Gracket } from 'gracket';
import 'gracket/style.css';

@Component({
  selector: 'app-brackets',
  imports: [],
  templateUrl: './brackets.html',
  styleUrl: './brackets.css',
})
export class Brackets implements AfterViewInit {
  activatedRoute = inject(ActivatedRoute);
  bracketContainer = viewChild.required<ElementRef>('bracketContainer');

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

  tournamentData = [
    // Round 1 - Quarterfinals
    [
      [
        { name: 'Team A', id: 'team-a', seed: 1, score: 100 },
        { name: 'Team B', id: 'team-b', seed: 8, score: 85 },
      ],
      [
        { name: 'Team C', id: 'team-c', seed: 4, score: 90 },
        { name: 'Team D', id: 'team-d', seed: 5, score: 88 },
      ],
      [
        { name: 'Team E', id: 'team-e', seed: 2, score: 105 },
        { name: 'Team F', id: 'team-f', seed: 7, score: 95 },
      ],
      [
        { name: 'Team G', id: 'team-g', seed: 3, score: 92 },
        { name: 'Team H', id: 'team-h', seed: 6, score: 88 },
      ],
    ],
    // Round 2 - Semifinals
    [
      [
        { name: 'Team A', id: 'team-a', seed: 1, score: 95 },
        { name: 'Team C', id: 'team-c', seed: 4, score: 92 },
      ],
      [
        { name: 'Team E', id: 'team-e', seed: 2, score: 98 },
        { name: 'Team G', id: 'team-g', seed: 3, score: 96 },
      ],
    ],
    // Round 3 - Finals
    [
      [
        { name: 'Team A', id: 'team-a', seed: 1, score: 102 },
        { name: 'Team E', id: 'team-e', seed: 2, score: 99 },
      ],
    ],
    // Champion
    [[{ name: 'Team A', id: 'team-a', seed: 1 }]],
  ];

  ngAfterViewInit() {
    new Gracket(this.bracketContainer().nativeElement, {
      src: this.tournamentData,
      roundLabels: ['Semifinal', 'Final', 'Campeón'],
    });
  }
}
