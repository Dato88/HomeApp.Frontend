import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { PageHeaderComponent } from '../shared/ui/page-header/page-header.component';

interface DashboardNavItem {
  readonly title: string;
  readonly description: string;
  readonly icon: string;
  readonly route: string;
  readonly queryParams?: Record<string, string>;
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
      title: 'Auswertung',
      description: 'Einnahmen & Ausgaben im Jahresüberblick',
      icon: 'bi-pie-chart',
      route: '/finance',
      queryParams: { tab: 'report' },
    },
    {
      title: 'Haushalte',
      description: 'Haushaltsverwaltung',
      icon: 'bi-house-heart',
      route: '/household',
    },
  ];
}
