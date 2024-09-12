import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Inscription } from 'src/common/interfaces';

@Injectable({
  providedIn: 'root',
})
export class InscriptionService {
  constructor(private http: HttpClient) {}

  readonly inscriptionsUrl = 'http://localhost:3000/api/inscription/';

  getInscriptions(): Observable<Inscription[]> {
    console.log('Data Requested');
    return this.http
      .get<{ data: Inscription[] }>(this.inscriptionsUrl)
      .pipe(map((response) => response.data));
  }

  createInscription(inscription: Inscription) {
    const { id, ...inscriptionData } = inscription;
    return this.http.post<Inscription>(this.inscriptionsUrl, inscriptionData);
  }

  updateInscription(inscription: Inscription) {
    let updateUrl = this.inscriptionsUrl + inscription.id.toString();
    console.log(updateUrl);
    return this.http.put(updateUrl, inscription);
  }

  deleteInscription(id: number) {
    let deletionUrl = this.inscriptionsUrl + id.toString();
    console.log('Data about to be deleted');
    console.log(id.toString());
    console.log(deletionUrl);
    return this.http.delete(deletionUrl);
  }
}
