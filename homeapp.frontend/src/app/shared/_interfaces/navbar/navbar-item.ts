import { WritableSignal } from '@angular/core';
import { PersonDto } from '../person/person-dto';
import { NavbarListItem } from './navbar-list-item';

export interface NavbarItem {
  navbarListItems: NavbarListItem[];
  person: WritableSignal<PersonDto>;
}
