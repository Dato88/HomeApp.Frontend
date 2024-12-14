import { Injectable } from '@angular/core';
import { User } from '../../_interfaces/authentication/auth/user';
import { NavbarItem } from '../../_interfaces/navbar/navbar-item';
import { NavbarListItem } from '../../_interfaces/navbar/navbar-list-item';

@Injectable({
  providedIn: 'root',
})
export class NavbarService {
  private navbarListItems: NavbarListItem[] = [
    {
      name: 'Dashboard',
      link: '/home',
      icon: 'dashboard',
    },
    {
      name: 'Web Design',
      link: '/webdesign',
      icon: 'library_books',
      sublist: [
        { name: 'Card Design', link: '/bla' },
        { name: 'Login Form', link: '/bla' },
        { name: 'Card Design', link: '/bla' },
      ],
    },
    {
      name: 'Posts',
      link: '/webdesign',
      icon: 'library_books',
      sublist: [
        { name: 'HTML & CSS', link: '/bla' },
        { name: 'JavaScript', link: '/bla' },
        { name: 'PHP & MySQL', link: '/bla' },
      ],
    },
    {
      name: 'Analytics',
      link: '/webdesign',
      icon: 'analytics',
    },
    {
      name: 'Chart',
      link: '/webdesign',
      icon: 'bar_chart',
    },
    {
      name: 'Category',
      link: '/webdesign',
      icon: 'library_books',
      sublist: [
        { name: 'Card Design', link: '/bla' },
        { name: 'Login Form', link: '/bla' },
        { name: 'Card Design', link: '/bla' },
      ],
    },
    {
      name: 'Plug',
      link: '/webdesign',
      icon: 'power',
      sublist: [
        { name: 'UI Face', link: '/bla' },
        { name: 'Pigments', link: '/bla' },
        { name: 'Box Icons', link: '/bla' },
      ],
    },
    {
      name: 'Explore',
      link: '/webdesign',
      icon: 'explore',
    },
    {
      name: 'History',
      link: '/webdesign',
      icon: 'history',
    },
    {
      name: 'Setting',
      link: '/webdesign',
      icon: 'settings',
    },
  ];

  user: User = {
    username: 'Andrej Miller',
    email: 'andrej_miller@outlook.de',
  };
  constructor() {}

  getAll(): NavbarItem {
    const navbarItem: NavbarItem = {
      navbarListItems: this.navbarListItems,
      user: this.user,
    };

    return navbarItem;
  }
}
