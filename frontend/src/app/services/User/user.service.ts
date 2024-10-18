import { Injectable } from '@angular/core';

import { User, Inscription } from 'src/common/interfaces.js';
//! Delete UserCrudService when implementing register/login
import { UserCrudService } from '../CRUD/user-crud.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private userCrudService: UserCrudService) {}

  getUser() {
    return this.userCrudService.getUser(1);
  }
}
