import { DatePipe, I18nSelectPipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { Tournament } from '@shared/interfaces/tournament';
import { RouterLink } from '@angular/router';
import { TournamentUtils } from '@shared/utils/tournament-utils';

@Component({
  selector: 'tournament-card',
  imports: [DatePipe, I18nSelectPipe],
  templateUrl: './tournament-card.html',
})
export class TournamentCard {
  tournamentActionMap = TournamentUtils.tournamentActionMap;
  tournamentStatusMap = TournamentUtils.tournamentStatusMap;
  tournamentStatusBadgeMap = TournamentUtils.tournamentStatusBadgeMap;
  getBackgroundStyle = TournamentUtils.GetGameImage;

  tournament = input.required<Tournament>();
  hasClicked = output<Tournament>();
}
