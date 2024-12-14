import { Component } from '@angular/core';
import { MenuComponent } from "../shared/menu/menu.component";

@Component({
  selector: 'hoa-dashboard',
  standalone: true,
  imports: [MenuComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}
