import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import { User } from 'src/common/interfaces';

@Injectable({
  providedIn: 'root',
})
export class UserCrudService {
  constructor(private http: HttpClient) {}

  readonly usersUrl = 'http://localhost:3000/api/users/';

  getUsers(): Observable<User[]> {
    console.log('Data Requested');
    return this.http
      .get<{ data: User[] }>(this.usersUrl)
      .pipe(map((response) => response.data));
  }

  createUser(user: User) {
    const { id, ...userData } = user;
    return this.http.post<User>(this.usersUrl, userData);
  }

  updateUser(user: User) {
    let updateUrl = this.usersUrl + user.id.toString();
    console.log(updateUrl);
    return this.http.put(updateUrl, user);
  }

  deleteUser(id: number) {
    let deletionUrl = this.usersUrl + id.toString();
    console.log('Data about to be deleted');
    console.log(id.toString());
    console.log(deletionUrl);
    return this.http.delete(deletionUrl);
  }
}
