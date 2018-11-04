import { SpListItem } from './sp-list-item.model';

export interface AppItem extends SpListItem {
  Title: string;
  RouterLink: string;
  AppPositionNumber: number;
  Visible?: boolean;
  Tooltip?: string;
}
