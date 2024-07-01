import { Component } from '@angular/core';
import { Content } from 'src/common/interfaces.js';

@Component({
  selector: 'app-crud-management',
  templateUrl: './crud-management.component.html',
  styleUrls: ['./crud-management.component.css'],
})
export class CRUDManagementComponent {
  headerArray = [
    {
      header: 'ID',
      fieldName: 'id',
    },
    {
      header: 'Name',
      fieldName: 'name',
    },
    {
      header: 'Surname',
      fieldName: 'surname',
    },
    {
      header: 'Email',
      fieldName: 'email',
    },
  ];

  content: Content[] = [
    {
      id: '1',
      name: 'John',
      surname: 'Doe',
      email: 'johndoe@gmail.com',
    },
    {
      id: '2',
      name: 'Jane',
      surname: 'Doe',
      email: 'janedoe@gmail.com',
    },
    {
      id: '3',
      name: 'John',
      surname: 'Smith',
      email: 'johnsmith@gmail.com',
    },
  ];
}