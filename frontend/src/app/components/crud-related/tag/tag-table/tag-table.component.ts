import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { TagService } from 'src/app/services/CRUD/tag.service';
import { Tag } from 'src/common/interfaces';
import { TagModalComponent } from '../tag-modal/tag-modal.component';
import { ConfirmComponent } from 'src/app/components/shared/confirm/confirm.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-tag-table',
  templateUrl: './tag-table.component.html',
  styleUrls: ['./tag-table.component.css'],
})
export class TagTableComponent {
  tags: Tag[] = [];
  canEdit: boolean = false;

  dataSource: any;

  tableHeaders: string[] = ['id', 'name', 'description', 'actions'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private tagService: TagService,
    private router: Router,
    public dialog: MatDialog
  ) {
    this.getTags();
    if (this.router.url.includes('admin')) {
      this.canEdit = true;
    }
  }

  getTags(): void {
    this.tagService.getTags().subscribe((response: Tag[]) => {
      this.tags = response;
      this.dataSource = new MatTableDataSource<Tag>(this.tags);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  filterChanges(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;

    this.dataSource.filter = filterValue;
  }

  add() {
    let tagSelected: Tag = {
      id: 0,
      name: '',
      description: '',
    };

    const dialogRef = this.dialog.open(TagModalComponent, {
      data: { tag: tagSelected },
      height: '400px',
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result: Tag) => {
      if (result) {
        tagSelected = result;
        this.saveTag(tagSelected);
      }
    });
  }

  delete(row: Tag) {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      data: { element: row, typeConfirm: 'borrar' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.tagService.deleteTag(row.id).subscribe((response: any) => {
          this.getTags();
        });
      }
    });
  }

  edit(row: Tag) {
    let tagSelected: Tag = row;

    const dialogRef = this.dialog.open(TagModalComponent, {
      data: { tag: tagSelected },
      height: '400px',
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        tagSelected = result;
        console.log(tagSelected);
        this.saveTag(tagSelected);
      }
    });
  }

  saveTag(tag: Tag) {
    if (tag.id === 0) {
      const dialogRef = this.dialog.open(ConfirmComponent, {
        data: { element: tag, typeConfirm: 'crear' },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.tagService.createTag(tag).subscribe((response: any) => {
            this.getTags();
          });
        }
      });
    } else {
      const dialogRef = this.dialog.open(ConfirmComponent, {
        data: { element: tag, typeConfirm: 'modificar' },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.tagService.updateTag(tag).subscribe((response: any) => {
            this.getTags();
          });
        }
      });
    }
  }
}
