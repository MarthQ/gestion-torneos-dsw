import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { CRUDService } from 'src/app/services/CRUD/crud.service';
import { GameType } from 'src/common/interfaces.js';

@Component({
  selector: 'app-game-type-table',
  templateUrl: './game-type-table.component.html',
  styleUrls: ['./game-type-table.component.css'],
})
export class GameTypeTableComponent {
  constructor(private crudService: CRUDService, private router: Router) {}

  gameTypes: GameType[] = [];
  canEdit: boolean = false;

  gameTypeKeys: (keyof GameType)[] = [
    'id' as keyof GameType,
    'name' as keyof GameType,
    'description' as keyof GameType,
    'tags' as keyof GameType,
  ];

  showModal: boolean = false;
  modalType: string = '';
  gameTypeSelected: GameType = {
    id: -1,
    name: '',
    description: '',
    tags: [],
  };

  ngOnInit() {
    this.getGameTypes();
    if (this.router.url.includes('admin')) {
      this.canEdit = true;
    }
  }

  getGameTypes(): void {
    // TODO: Add error handling using subscribe's second parameter
    this.crudService.getGameTypes().subscribe(
      (response: any) => (this.gameTypes = response.data),
      (err: any) => alert(err.message)
    );
  }

  add() {
    this.gameTypeSelected = {
      id: 0,
      name: '',
      description: '',
      tags: [],
    };
    this.modalType = 'Crear';
    this.showModal = true;
  }

  delete(row: GameType) {
    if (
      window.confirm(
        'Estas a punto de borrar el siguiente tipo de juego: \n' +
          'Id: ' +
          row.id +
          '\n' +
          'Nombre: ' +
          row.name
      )
    ) {
      this.crudService.deleteGameType(row.id).subscribe((response: any) => {
        this.getGameTypes();
      });
    }
  }

  edit(row: GameType) {
    this.gameTypeSelected = row;
    this.showModal = true;
    this.modalType = 'Modificar';
  }

  SaveGameType(event: GameType) {
    if (this.modalType === 'Crear') {
      if (
        window.confirm(
          'Estas a punto de crear el siguiente tipo de juego: \n' +
            'Nombre: ' +
            event.name
        )
      ) {
        this.crudService.createGameType(event).subscribe((response: any) => {
          this.getGameTypes();
          this.showModal = false;
        });
      }
    } else {
      if (
        window.confirm(
          'Estas a punto de modificar el siguiente tipo de juego: \n' +
            'Id: ' +
            event.id +
            '\n' +
            'Nombre: ' +
            event.name
        )
      )
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
