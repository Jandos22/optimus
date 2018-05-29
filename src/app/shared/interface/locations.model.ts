export interface Location {
  Id: number;
  Title: string;
}

export interface LocationsEntity {
  ids: string[];
  entities: {
    [id: string]: Location;
  };
}
