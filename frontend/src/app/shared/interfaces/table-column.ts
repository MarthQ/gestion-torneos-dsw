export interface TableColumn<T> {
  /** Key to access value from row object (supports nested: 'user.name') */
  key: keyof T | string;
  /** Display label for column header */
  label: string;
  /** Optional fixed width (e.g., '120px', '10%') */
  width?: string;
  /** Text alignment */
  align?: 'left' | 'center' | 'right';
  /** Type of column content */
  type?: 'text' | 'image';
  /** Truncate text with ellipsis */
  truncate?: boolean;
  /** Alt text for images (can be a function or static string) */
  alt?: string | ((row: T) => string);
  /** Render as badge with value-based styling */
  badge?: {
    values: Record<string, { class: string; icon?: string }>;
  };
}
