export interface Query {
  path: string;
  query?: any;
  options?: {
    sort?: {
      property: string;
      direction: 1 | -1;
    },
    paginate: {
      limit?: number;
      offset?: number;
    }
  }
}