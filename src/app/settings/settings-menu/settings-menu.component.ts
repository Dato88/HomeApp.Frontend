import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'home-settings-menu',
  imports: [MatCardModule, MatListModule],
  templateUrl: './settings-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './settings-menu.component.scss',
})
export class SettingsMenuComponent {}
