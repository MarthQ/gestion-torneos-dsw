import { Component } from '@angular/core';

import { CRUDService } from 'src/app/services/CRUD/crud.service';
import { GameType } from 'src/common/interfaces.js';

@Component({
  selector: 'app-crud-management',
  templateUrl: './crud-management.component.html',
  styleUrls: ['./crud-management.component.css'],
})
export class CRUDManagementComponent {
  constructor(private crudService: CRUDService) {}

  gameTypes: GameType[] = [];

  ngOnInit() {
    this.getGameTypes();
  }

  getGameTypes(): void {
    // TODO: Add error handling using subscribe's second parameter
    this.crudService.getGameTypes().subscribe((response: any) => {
      this.gameTypes = response.data;
    });
  }

  DeleteElement(event: number) {
    this.crudService.deleteGameType(event).subscribe((response: any) => {
      this.getGameTypes();
    });
  }
}
