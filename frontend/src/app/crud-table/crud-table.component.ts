import { Component, Input } from '@angular/core';
import { Content } from '../../common/interfaces.js';
@Component({
  selector: 'app-crud-table',
  templateUrl: './crud-table.component.html',
  styleUrls: ['./crud-table.component.css'],
})
export class CRUDTableComponent {
  @Input() headerArray: any[] = [];
  @Input() contentArray: any[] = [];
  @Input() canEdit: boolean = false;

  add() {}

  delete(row: any) {}

  edit(row: any) {}
}