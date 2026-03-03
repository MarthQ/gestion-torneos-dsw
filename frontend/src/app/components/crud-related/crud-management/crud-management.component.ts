import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-crud-management',
  templateUrl: './crud-management.component.html',
  styleUrls: ['./crud-management.component.css'],
})
export class CRUDManagementComponent {
  constructor(private router: Router) {}

  crudForm = new FormGroup({
    crudType: new FormControl('GameTypes'),
  });

  loadCrud() {
    //  Find a way to dynamically add /admin/ to the path without writing it explicitly
    const selectedCrud = this.crudForm.get('crudType')?.value;
    console.log('Selected CRUD:', selectedCrud);
    this.router.navigate(['/admin/', selectedCrud]);
  }
}
