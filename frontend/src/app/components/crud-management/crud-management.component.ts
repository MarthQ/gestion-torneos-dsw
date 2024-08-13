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
  showModal: boolean = false;
  gameTypeSelected: GameType = {
    id: 0,
    name: '',
    description: '',
    tags: '',
  };
  modalType: string = '';

  ngOnInit() {
    this.getGameTypes();
  }

  getGameTypes(): void {
    // TODO: Add error handling using subscribe's second parameter
    this.crudService.getGameTypes().subscribe((response: any) => {
      this.gameTypes = response.data;
    });
  }

  AddElement() {
    this.gameTypeSelected = {
      id: 0,
      name: '',
      description: '',
      tags: '',
    };
    this.modalType = 'Crear';
    this.showModal = true;
  }

  EditElement(idSelected: number) {
    this.gameTypeSelected = this.gameTypes[idSelected - 1];
    this.modalType = 'Editar';
    this.showModal = true;
  }

  DeleteElement(event: number) {
    this.crudService.deleteGameType(event).subscribe((response: any) => {
      this.getGameTypes();
    });
  }

  SaveElement(event: GameType) {
    if (this.modalType === 'Crear') {
      this.crudService.createGameType(event).subscribe((response: any) => {
        this.getGameTypes();
        this.showModal = false;
        console.log('Llegamos hasta aca');
      });
    } else {
      this.crudService.updateGameType(event).subscribe((response: any) => {
        this.getGameTypes();
        this.showModal = false;
      });
    }
  }

  closeModal() {
    this.showModal = false;
  }
}
