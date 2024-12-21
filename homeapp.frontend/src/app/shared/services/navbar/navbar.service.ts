import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { User } from '../../_interfaces/authentication/auth/user';
import { NavbarItem } from '../../_interfaces/navbar/navbar-item';
import { NavbarListItem } from '../../_interfaces/navbar/navbar-list-item';
import { PersonDto } from '../../_interfaces/person/person-dto';
import { HttpClient } from '@angular/common/http';
import { API_PERSON_ENDPOINTS } from '../../../../api-endpoints/api-person-endpoints';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NavbarService {
  private navbarListItems: NavbarListItem[] = [
    {
      name: 'Dashboard',
      link: '/dashboard',
      icon: 'dashboard',
    },
    {
      name: 'Todo',
      link: '/todo',
      icon: 'task',
    },
    {
      name: 'Budget',
      link: '/budget',
      icon: 'analytics',
    },
    // {
    //   name: 'Posts',
    //   link: '/webdesign',
    //   icon: 'library_books',
    //   sublist: [
    //     { name: 'HTML & CSS', link: '/bla' },
    //     { name: 'JavaScript', link: '/bla' },
    //     { name: 'PHP & MySQL', link: '/bla' },
    //   ],
    // },

    // {
    //   name: 'Chart',
    //   link: '/webdesign',
    //   icon: 'bar_chart',
    // },
    // {
    //   name: 'Category',
    //   link: '/webdesign',
    //   icon: 'library_books',
    //   sublist: [
    //     { name: 'Card Design', link: '/bla' },
    //     { name: 'Login Form', link: '/bla' },
    //     { name: 'Card Design', link: '/bla' },
    //   ],
    // },
    // {
    //   name: 'Plug',
    //   link: '/webdesign',
    //   icon: 'power',
    //   sublist: [
    //     { name: 'UI Face', link: '/bla' },
    //     { name: 'Pigments', link: '/bla' },
    //     { name: 'Box Icons', link: '/bla' },
    //   ],
    // },
    // {
    //   name: 'Explore',
    //   link: '/webdesign',
    //   icon: 'explore',
    // },
    // {
    //   name: 'History',
    //   link: '/webdesign',
    //   icon: 'history',
    // },
    {
      name: 'Settings',
      link: '/settings',
      icon: 'settings',
    },
  ];

  private readonly personSignal: WritableSignal<PersonDto> = signal({
    id: 0,
    firstName: '',
    lastName: '',
    email: '',
  });

  getAll(): NavbarItem {
    const navbarItem: NavbarItem = {
      navbarListItems: this.navbarListItems,
      person: this.personSignal,
    };

    return navbarItem;
  }

  readonly #http = inject(HttpClient);

  public createCompleteRoute = (route: string, envAdress: string) => {
    return `${envAdress}/${route}`;
  };

  public getPerson = () => {
    return this.#http
      .get<PersonDto>(this.createCompleteRoute(API_PERSON_ENDPOINTS.person, environment.backendUrl))
      .subscribe((person) => {
        this.personSignal.set(person);
      });
  };
}
