import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Tabs } from '@features/tournament/components/tabs/tabs';

@Component({
  imports: [RouterOutlet, Tabs],
  templateUrl: './tournamentLayout.html',
})
export class TournamentLayout {}
