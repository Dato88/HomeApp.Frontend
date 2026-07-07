import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { PageHeaderComponent } from '../shared/ui/page-header/page-header.component';

interface DashboardNavItem {
  readonly title: string;
  readonly description: string;
  readonly icon: string;
  readonly route: string;
}

@Component({
  selector: 'home-dashboard',
  imports: [RouterLink, RouterLinkActive, PageHeaderComponent],
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  readonly navItems: DashboardNavItem[] = [
    {
      title: 'Todos',
      description: 'Aufgabenliste verwalten',
      icon: 'bi-check2-square',
      route: '/todo',
    },
    {
      title: 'Finanzen',
      description: 'Konten & Buchungen',
      icon: 'bi-cash-stack',
      route: '/finance',
    },
    {
      title: 'Budget',
      description: 'Budgetplanung',
      icon: 'bi-pie-chart',
      route: '/budget',
    },
    {
      title: 'Haushalte',
      description: 'Haushaltsverwaltung',
      icon: 'bi-house-heart',
      route: '/household',
    },
  ];
}
