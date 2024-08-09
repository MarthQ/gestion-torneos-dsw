import { Component, Input, OnChanges } from '@angular/core';
import { GameType } from '../../../common/interfaces.js';
@Component({
  selector: 'app-crud-table',
  templateUrl: './crud-table.component.html',
  styleUrls: ['./crud-table.component.css'],
})
export class CRUDTableComponent {
  @Input() contentArray: any[] = [];
  @Input() canEdit: boolean = false;

  contentKeys: string[] = [];

  ngOnChanges() {
    if (this.contentArray.length > 0) {
      this.contentKeys = Object.keys(this.contentArray[0]);
      console.log('Executed this');
    }
  }

  add() {}

  delete(row: any) {}

  edit(row: any) {}
}
