import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { Tag } from 'src/common/interfaces.js';

@Injectable({
  providedIn: 'root',
})
export class TagService {
  constructor(private http: HttpClient) {}

  readonly tagsUrl = 'http://localhost:3000/api/tags/';

  getTags(): Observable<Tag[]> {
    return this.http
      .get<{ data: Tag[] }>(this.tagsUrl)
      .pipe(map((response) => response.data));
  }

  createTag(tag: Tag) {
    const { id, ...tagData } = tag;
    return this.http.post(this.tagsUrl, tagData);
  }

  updateTag(tag: Tag) {
    let updateUrl = this.tagsUrl + tag.id.toString();
    return this.http.put(updateUrl, tag);
  }

  deleteTag(id: number) {
    let deletionUrl = this.tagsUrl + id.toString();
    return this.http.delete(deletionUrl);
  }
}
