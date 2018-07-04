export interface PaginationIndexes {
  previous: number;
  current: number;
  next: number;
}

export interface PaginationCounter {
  from: number;
  to: number;
  total: number | string;
}
