import { NavbarListSubitem } from './navbar-list-subitem';

export interface NavbarListItem {
  name: string;
  link?: string;
  icon: string;
  sublist?: NavbarListSubitem[];
}
