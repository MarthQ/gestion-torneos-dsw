import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { InscriptionService } from 'src/app/services/CRUD/inscription.service';
import { Inscription, Tournament, User } from 'src/common/interfaces';
import { InscriptionModalComponent } from '../inscription-modal/inscription-modal.component';
import { ConfirmComponent } from 'src/app/components/shared/confirm/confirm.component';
import { map } from 'rxjs';

@Component({
  selector: 'app-inscription-table',
  templateUrl: './inscription-table.component.html',
  styleUrls: ['./inscription-table.component.css'],
})
export class InscriptionTableComponent {
  inscriptions: Inscription[] = [];
  canEdit: boolean = false;

  dataSource: any;

  tableHeaders: string[] = [
    'id',
    'user',
    'nickname',
    'tournament',
    'inscriptiondate',
    'victories',
    'loses',
    'actions',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private inscriptionService: InscriptionService,
    private router: Router,
    public dialog: MatDialog
  ) {
    this.getInscriptions();
    if (this.router.url.includes('admin')) {
      this.canEdit = true;
    }
  }

  getInscriptions(): void {
    this.inscriptionService
      .getInscriptions()
      .subscribe((response: Inscription[]) => {
        this.inscriptions = response;
        this.dataSource = new MatTableDataSource<Inscription>(
          this.inscriptions
        );
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }

  formatUser(user: User): string {
    return user.name;
  }

  formatTournament(tournament: Tournament): string {
    return tournament.name;
  }

  filterChanges(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;

    this.dataSource.filter = filterValue;
  }

  add() {
    let inscriptionSelected: Inscription = {
      id: 0,
      user: null,
      nickname: '',
      tournament: null,
      victories: 0,
      loses: 0,
      inscriptionDate: null,
    };

    const dialogRef = this.dialog.open(InscriptionModalComponent, {
      data: { inscription: inscriptionSelected },
      height: '400px',
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result: Inscription) => {
      if (result) {
        inscriptionSelected = result;
        this.saveInscription(inscriptionSelected);
      }
    });
  }

  delete(row: Inscription) {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      data: { element: row, typeConfirm: 'borrar' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.inscriptionService
          .deleteInscription(row.id)
          .subscribe((response: any) => {
            this.getInscriptions();
          });
      }
    });
  }

  edit(row: Inscription) {
    let inscriptionSelected: Inscription = row;

    const dialogRef = this.dialog.open(InscriptionModalComponent, {
      data: { inscription: inscriptionSelected },
      height: '400px',
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        inscriptionSelected = result;
        console.log(inscriptionSelected);
        this.saveInscription(inscriptionSelected);
      }
    });
  }

  saveInscription(inscription: Inscription) {
    if (inscription.id === 0) {
      const dialogRef = this.dialog.open(ConfirmComponent, {
        data: { element: inscription, typeConfirm: 'crear' },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.inscriptionService
            .createInscription(inscription)
            .subscribe((response: any) => {
              this.getInscriptions();
            });
        }
      });
    } else {
      const dialogRef = this.dialog.open(ConfirmComponent, {
        data: { element: inscription, typeConfirm: 'modificar' },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.inscriptionService
            .updateInscription(inscription)
            .subscribe((response: any) => {
              this.getInscriptions();
            });
        }
      });
    }
  }
}
