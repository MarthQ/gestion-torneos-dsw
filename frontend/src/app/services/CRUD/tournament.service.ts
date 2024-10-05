import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Tournament } from 'src/common/interfaces';

@Injectable({
  providedIn: 'root',
})
export class TournamentService {
  constructor(private http: HttpClient) {}

  readonly tournamentsUrl = 'http://localhost:3000/api/tournaments/';

  getTournaments(): Observable<Tournament[]> {
    return this.http
      .get<{ data: Tournament[] }>(this.tournamentsUrl)
      .pipe(map((response) => response.data));
  }

  createTournament(tournament: Tournament) {
    const { id, ...tournamentData } = tournament;
    return this.http.post<Tournament>(this.tournamentsUrl, tournamentData);
  }

  updateTournament(tournament: Tournament) {
    let updateUrl = this.tournamentsUrl + tournament.id.toString();
    return this.http.put(updateUrl, tournament);
  }

  deleteTournament(id: number) {
    let deletionUrl = this.tournamentsUrl + id.toString();
    return this.http.delete(deletionUrl);
  }
}
