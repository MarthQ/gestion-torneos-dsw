import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { Tournament, Inscription, User } from 'src/common/interfaces';
import { TournamentService } from 'src/app/services/CRUD/tournament.service';
import { InscriptionService } from 'src/app/services/CRUD/inscription.service';
import { UserInscriptionModalComponent } from 'src/app/components/user-inscription-modal/user-inscription-modal.component';
import { ConfirmComponent } from '../shared/confirm/confirm.component';
import { UserService } from 'src/app/services/User/user.service';

@Component({
  selector: 'app-search-tournament',
  templateUrl: './search-tournament.component.html',
  styleUrls: ['./search-tournament.component.css'],
})
export class SearchTournamentComponent {
  user: User | null = null;
  tournaments: Tournament[] = [];
  dataSource: any;
  tableHeaders: string[] = ['name', 'description', 'date', 'game', 'actions'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private tournamentService: TournamentService,
    private inscriptionService: InscriptionService,
    private userService: UserService,
    public dialog: MatDialog
  ) {
    this.getTournaments();
    this.userService.getUser().subscribe((response: User) => {
      this.user = response;
    });
    console.log(this.user);
  }

  getTournaments(): void {
    this.tournamentService
      .getTournaments()
      .subscribe((response: Tournament[]) => {
        this.tournaments = response;
        this.dataSource = new MatTableDataSource<Tournament>(this.tournaments);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }

  filterChanges(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;

    this.dataSource.filter = filterValue;
  }

  inscribe(tournamentSelected: Tournament) {
    console.log(this.user);
    if (!this.user) {
      console.log("There isn't a user logged");
    } else {
      const dialogRef = this.dialog.open(UserInscriptionModalComponent, {
        data: { tournament: tournamentSelected, user: this.user },
        height: '400px',
        width: '400px',
      });

      dialogRef.afterClosed().subscribe((result: Inscription) => {
        if (result) {
          const newInscription = result;

          this.dialog.open(ConfirmComponent, {
            height: '400px',
            width: '400px',
          });

          dialogRef.afterClosed().subscribe((confirmation: boolean) => {
            if (confirmation) {
              this.inscriptionService
                .createInscription(newInscription)
                .subscribe((response: any) => {
                  // this.getInscriptions();
                });
            }
          });
        }
      });
    }
  }
}
