import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Location } from 'src/common/interfaces';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  constructor(private http: HttpClient) {}

  readonly locationsUrl = 'http://localhost:3000/api/locations';

  getLocations(): Observable<Location[]> {
    return this.http
      .get<{ data: Location[] }>(this.locationsUrl)
      .pipe(map((response) => response.data));
  }

  createLocation(location: Location) {
    const { id, ...locationData } = location;
    return this.http.post(this.locationsUrl, locationData);
  }

  updateLocation(location: Location) {
    let updateUrl = this.locationsUrl + location.id.toString();
    console.log(updateUrl);
    return this.http.put(updateUrl, location);
  }

  deleteLocation(id: number) {
    let deletionUrl = this.locationsUrl + id.toString();
    console.log('Data about to be deleted');
    console.log(id.toString());
    console.log(deletionUrl);
    return this.http.delete(deletionUrl);
  }
}
