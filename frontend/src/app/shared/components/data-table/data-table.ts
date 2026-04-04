import { Component, computed, input, output, signal } from '@angular/core';
import { TableColumn } from '@shared/interfaces/table-column';
import { TableAction } from '@shared/interfaces/table-action';
import { TableState } from '@shared/interfaces/table-state';
import { PaginationMeta } from '@shared/interfaces/api-response';

@Component({
  selector: 'app-data-table',
  imports: [],
  templateUrl: './data-table.html',
  styleUrl: './data-table.css',
})
export class DataTable<T extends Record<string, any>> {
  // Inputs
  columns = input.required<TableColumn<T>[]>();
  data = input.required<T[]>();
  meta = input<PaginationMeta>();
  state = input<TableState>('loading');
  actions = input<TableAction<T>[]>([]);
  pageSize = input(10);

  // Outputs
  pageChanged = output<number>();
  rowAction = output<{ action: 'edit' | 'delete'; row: T }>();
  retry = output<void>();

  // Computed empty rows count (fill space with placeholder rows)
  emptyRows = computed(() => {
    if (this.state() !== 'hasData') return 0;
    return Math.max(0, this.pageSize() - this.data().length);
  });

  // Helper: get array for empty rows iteration
  getEmptyRowArray(count: number): number[] {
    return Array(count).fill(0);
  }

  // Helper: get value from row by key (supports nested: 'user.name')
  getValue(row: T, key: string | keyof T): any {
    const keyStr = String(key);
    return keyStr.split('.').reduce((obj, k) => obj?.[k], row as any);
  }

  // Helper: check if action should be visible
  isActionVisible(action: TableAction<T>, row: T): boolean {
    return action.condition ? action.condition(row) : true;
  }

  // Helper: get icon name for Iconify
  getActionIconClass(icon: string): string {
    return `icon-${icon}`;
  }

  // Helper: get button class based on action color
  getActionButtonClass(action: TableAction<T>): string {
    switch (action.color) {
      case 'warning':
        return 'btn-warning btn-outline';
      case 'error':
        return 'btn-error btn-outline';
      case 'success':
        return 'btn-success btn-outline';
      case 'info':
        return 'btn-info btn-outline';
      default:
        return 'btn-ghost';
    }
  }

  // Helper: get badge config for a cell
  getBadgeClass(col: TableColumn<T>, value: any): string {
    if (!col.badge?.values) return '';
    const valueStr = String(value ?? '');
    return col.badge.values[valueStr]?.class ?? '';
  }

  getBadgeIcon(col: TableColumn<T>, value: any): string | undefined {
    if (!col.badge?.values) return undefined;
    const valueStr = String(value ?? '');
    return col.badge.values[valueStr]?.icon;
  }

  // Helper: get alt text for image columns
  getColumnAlt(col: TableColumn<T>, row: T): string {
    if (!col.alt) return 'Imagen';
    if (typeof col.alt === 'function') {
      return col.alt(row);
    }
    return col.alt;
  }

  // Event handlers
  handlePageChange(page: number) {
    this.pageChanged.emit(page);
  }

  handleRowAction(action: 'edit' | 'delete', row: T) {
    this.rowAction.emit({ action, row });
  }

  handleRetry() {
    this.retry.emit();
  }
}
