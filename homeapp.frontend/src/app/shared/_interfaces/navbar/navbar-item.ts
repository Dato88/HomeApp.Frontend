import { User } from '../authentication/auth/user';
import { NavbarListItem } from './navbar-list-item';

export interface NavbarItem {
  navbarListItems: NavbarListItem[];
  user: User;
}
