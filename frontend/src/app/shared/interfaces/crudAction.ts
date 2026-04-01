export type CrudAction<T extends { id: number }> =
  | { actionType: 'create'; data: Omit<T, 'id'> }
  | { actionType: 'update'; data: T }
  | { actionType: 'delete'; data: Pick<T, 'id'> };
