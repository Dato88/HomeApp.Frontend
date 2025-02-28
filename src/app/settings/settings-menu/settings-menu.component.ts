import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';

@Component({
    selector: 'hoa-settings-menu',
    imports: [MatCardModule, MatListModule],
    templateUrl: './settings-menu.component.html',
    styleUrl: './settings-menu.component.scss'
})
export class SettingsMenuComponent {}
