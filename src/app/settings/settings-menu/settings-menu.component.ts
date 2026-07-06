import { ChangeDetectionStrategy, Component } from '@angular/core';
import { EmptyStateComponent } from '../../shared/ui/empty-state/empty-state.component';
import { PageHeaderComponent } from '../../shared/ui/page-header/page-header.component';

@Component({
  selector: 'home-settings-menu',
  imports: [PageHeaderComponent, EmptyStateComponent],
  templateUrl: './settings-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './settings-menu.component.scss',
})
export class SettingsMenuComponent {}
