import { Component, Input } from '@angular/core';
import { GameType } from '../../../common/interfaces.js';
@Component({
  selector: 'app-crud-table',
  templateUrl: './crud-table.component.html',
  styleUrls: ['./crud-table.component.css'],
})
export class CRUDTableComponent {
  @Input() contentArray: GameType[] = [];
  @Input() canEdit: boolean = false;

  contentKeys: string[] = [];

  ngOnInit() {
    if (this.contentArray.length > 0) {
      this.contentKeys = Object.keys(this.contentArray[0]);
    }
  }

  add() {}

  delete(row: any) {}

  edit(row: any) {}
}
