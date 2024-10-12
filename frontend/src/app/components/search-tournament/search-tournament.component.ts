import { Component, ViewChild } from '@angular/core';
import { Tournament } from 'src/common/interfaces';
import { MatDialog } from '@angular/material/dialog';

import { TournamentService } from 'src/app/services/CRUD/tournament.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-search-tournament',
  templateUrl: './search-tournament.component.html',
  styleUrls: ['./search-tournament.component.css'],
})
export class SearchTournamentComponent {
  tournaments: Tournament[] = [];
  dataSource: any;
  tableHeaders: string[] = ['name', 'description', 'date', 'game', 'actions'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private tournamentService: TournamentService,
    public dialog: MatDialog
  ) {
    this.getTournaments();
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

  inscribe(tournament: Tournament) {}
}
