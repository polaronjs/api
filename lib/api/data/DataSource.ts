export interface DataSource<T> {
  create(document: T): Promise<T>;
  read({ query, options }: { query?: any; options?: any }): Promise<T[]>;
  update({ query, document }: { query: any; document: Partial<T> }): Promise<T[]>;
  delete(query: any): Promise<T>;
}

export type DataSourceToken<T> = { new (): DataSource<T>, use(path: string): void };