export interface TableAction<T> {
  /** Iconify icon name (e.g., 'boxicons--edit-filled') */
  icon: string;
  /** Accessible label for screen readers */
  label: string;
  /** Action type */
  action: 'edit' | 'delete';
  /** Optional condition to show/hide button */
  condition?: (row: T) => boolean;
  /** DaisyUI color class */
  color?: 'warning' | 'error' | 'info' | 'success';
}
