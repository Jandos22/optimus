export interface ToSaveOneImage {
  ID?: number;
  ArrayBuffer?: ArrayBuffer;
}

export interface ToSaveOneImageWithFiliname {
  ID?: number;
  Filename?: string;
  ArrayBuffer?: ArrayBuffer;
}

export interface ArrayOfIds {
  results: number[];
}

export interface SpImage {
  ArrayBuffer: ArrayBuffer;
  Filename: string;
}
