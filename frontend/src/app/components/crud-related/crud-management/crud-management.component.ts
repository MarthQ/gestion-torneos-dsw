import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crud-management',
  templateUrl: './crud-management.component.html',
  styleUrls: ['./crud-management.component.css'],
})
export class CRUDManagementComponent {
  constructor(private router: Router) {}

  crudType: string = 'GameTypes';

  onChange(event: Event) {
    this.crudType = (event.target as HTMLInputElement).value;
  }

  loadCrud() {
    //  Find a way to dynamically add /admin/ to the path without writing it explicitly
    this.router.navigate(['/admin/', this.crudType]);
  }
}
