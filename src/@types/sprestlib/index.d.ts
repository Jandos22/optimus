declare namespace sprestlib {
  export interface SpRestLib {
    list(listName: string): ListUpdate;
    user(): UserInfo;
  }

  export interface UserInfo {
    info(): Promise<any>;
  }

  export interface ListUpdate {
    update(itemObject: { ID: number; [key: string]: any }): Promise<Object>;
  }
}
