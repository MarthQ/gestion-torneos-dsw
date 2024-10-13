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
    return this.http
      .get<{ data: User[] }>(this.usersUrl)
      .pipe(map((response) => response.data));
  }

  getUser(id: number): Observable<User> {
    const getUrl = this.usersUrl + id.toString();
    return this.http
      .get<{ data: User }>(getUrl)
      .pipe(map((response) => response.data));
  }

  createUser(user: User) {
    const { id, ...userData } = user;

    return this.http.post<User>(this.usersUrl, userData);
  }

  updateUser(user: User) {
    const updateUrl = this.usersUrl + user.id.toString();

    return this.http.put(updateUrl, user);
  }

  deleteUser(id: number) {
    const deletionUrl = this.usersUrl + id.toString();

    return this.http.delete(deletionUrl);
  }
}
