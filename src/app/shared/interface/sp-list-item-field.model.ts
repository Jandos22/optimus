export interface SpListItemField {
  Id?: number;
  ID?: number;
  Attachments?: boolean;
  AttachmentFiles?: {
    results?: SpListItemAttachmentFiles[];
  };
  ['odata.type']?: string;
  ['odata.id']?: string;
  ['odata.etag']?: string;
  ['odata.editLink']?: string;
}

export interface SpListItemAttachmentFiles {
  FileName: string;
  FileNameAsPath: {
    DecodedUrl: string;
  };
  ServerRelativePath: {
    DecodedUrl: string;
  };
  ServerRelativeUrl: string;
}

export interface SpGetListItemResult {
  d: SpListItemField;
}
