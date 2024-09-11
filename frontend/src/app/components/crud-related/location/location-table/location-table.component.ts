import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { LocationService } from 'src/app/services/CRUD/location.service';
import { Location } from 'src/common/interfaces';
import { LocationModalComponent } from '../location-modal/location-modal.component';
import { ConfirmComponent } from 'src/app/components/shared/confirm/confirm.component';

@Component({
  selector: 'app-location-table',
  templateUrl: './location-table.component.html',
  styleUrls: ['./location-table.component.css'],
})
export class LocationTableComponent {
  locations: Location[] = [];
  canEdit: boolean = false;

  dataSource: any;

  tableHeaders: string[] = ['id', 'name', 'actions'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private locationService: LocationService,
    private router: Router,
    public dialog: MatDialog
  ) {
    this.getLocations();
    if (this.router.url.includes('admin')) {
      this.canEdit = true;
    }
  }

  getLocations(): void {
    this.locationService.getLocations().subscribe((response: Location[]) => {
      this.locations = response;
      this.dataSource = new MatTableDataSource<Location>(this.locations);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  filterChanges(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;

    this.dataSource.filter = filterValue;
  }

  add() {
    let locationSelected: Location = {
      id: 0,
      name: '',
    };

    const dialogRef = this.dialog.open(LocationModalComponent, {
      data: { location: locationSelected },
      height: '400px',
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result: Location) => {
      if (result) {
        locationSelected = result;
        this.saveLocation(locationSelected);
      }
    });
  }

  delete(row: Location) {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      data: { element: row, typeConfirm: 'borrar' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.locationService
          .deleteLocation(row.id)
          .subscribe((response: any) => {
            this.getLocations();
          });
      }
    });
  }

  edit(row: Location) {
    let locationSelected: Location = row;

    const dialogRef = this.dialog.open(LocationModalComponent, {
      data: { location: locationSelected },
      height: '400px',
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        locationSelected = result;
        console.log(locationSelected);
        this.saveLocation(locationSelected);
      }
    });
  }

  saveLocation(location: Location) {
    if (location.id === 0) {
      const dialogRef = this.dialog.open(ConfirmComponent, {
        data: { element: location, typeConfirm: 'crear' },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.locationService
            .createLocation(location)
            .subscribe((response: any) => {
              this.getLocations();
            });
        }
      });
    } else {
      const dialogRef = this.dialog.open(ConfirmComponent, {
        data: { element: location, typeConfirm: 'modificar' },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.locationService
            .updateLocation(location)
            .subscribe((response: any) => {
              this.getLocations();
            });
        }
      });
    }
  }
}
