import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { User } from '../../_interfaces/authentication/auth/user';
import { NavbarItem } from '../../_interfaces/navbar/navbar-item';
import { NavbarListItem } from '../../_interfaces/navbar/navbar-list-item';
import { PersonDto } from '../../_interfaces/person/person-dto';
import { HttpClient } from '@angular/common/http';
import { API_PERSON_ENDPOINTS } from '../../../../api-endpoints/api-person-endpoints';
import { environment } from '../../../../environments/environment';
import { API_NAVBAR_ENDPOINTS } from '../../../../api-endpoints/api-navbar-endpoints';
import { BaseResponse } from '../../_interfaces/base-response';

@Injectable({
  providedIn: 'root',
})
export class NavbarService {
  readonly #http = inject(HttpClient);

  private readonly navbarListItemsSignal: WritableSignal<NavbarListItem[]> = signal([]);
  private readonly personSignal: WritableSignal<PersonDto> = signal({
    id: 0,
    firstName: '',
    lastName: '',
    email: '',
  });

  getAll(): NavbarItem {
    const navbarItem: NavbarItem = {
      navbarListItems: this.navbarListItemsSignal,
      person: this.personSignal,
    };

    return navbarItem;
  }

  public getPerson(): void {
    this.#http
      .get<BaseResponse<PersonDto>>(`${environment.backendUrl}/${API_PERSON_ENDPOINTS.person}`)
      .subscribe((response) => {
        this.personSignal.set(response.data);
      });
  }

  public getNavbarItems(): void {
    this.#http
      .get<NavbarListItem[]>(`${environment.backendUrl}/${API_NAVBAR_ENDPOINTS.navbar}`)
      .subscribe((navbarItems) => {
        this.navbarListItemsSignal.set(navbarItems);
      });
  }
}
