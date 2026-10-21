declare module 'sql.js' {
  export interface QueryExecResult {
    columns: string[];
    values: any[][];
  }

  export interface Statement {
    bind(values?: any[]): boolean;
    step(): boolean;
    get(): any[];
    getColumnNames(): string[];
    getAsObject(params?: any): { [key: string]: any };
    free(): boolean;
    reset(): void;
  }

  export interface Database {
    run(sql: string, params?: any[]): Database;
    exec(sql: string, params?: any[]): QueryExecResult[];
    prepare(sql: string, params?: any[]): Statement;
    export(): Uint8Array;
    close(): void;
  }

  export interface SqlJsStatic {
    Database: new (data?: ArrayBuffer | Uint8Array) => Database;
  }

  export default function initSqlJs(config?: any): Promise<SqlJsStatic>;
}
