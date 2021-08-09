export interface PagedResult<T> {
  count: number;
  offset: number;
  pageSize: number;
  result: T;
  additionalData: any;
}
