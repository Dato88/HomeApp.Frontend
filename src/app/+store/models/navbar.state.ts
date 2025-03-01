import { NavbarListItem } from './navbar/navbar-list-item';

export interface NavbarState {
  isLoading: boolean;
  navbarListItems: NavbarListItem[];
}

export const initialNavbarState: NavbarState = {
  isLoading: false,
  navbarListItems: [],
};
