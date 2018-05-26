export interface PpeCategory {
  Id: number;
  Title: string;
}

export interface PpeItem {
  Id: number;
  Title: string;
  CategoryId: number;
  Price: number;
  Supplier: any;
  Attachments: boolean;
  AttachmentFiles?: any[];
}

export interface PpeItemsByCategory {
  category: string;
  items: PpeItem[];
}
