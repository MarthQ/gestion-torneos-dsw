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
      fieldName: 'id' as keyof Content,
    },
    {
      header: 'Name',
      fieldName: 'name' as keyof Content,
    },
    {
      header: 'Surname',
      fieldName: 'surname' as keyof Content,
    },
    {
      header: 'Email',
      fieldName: 'email' as keyof Content,
    },
  ];

  contentArray: Content[] = [
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
