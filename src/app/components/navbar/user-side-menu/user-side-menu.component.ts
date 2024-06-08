import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MenuItem } from 'src/app/shared/interfaces/menu-item';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-side-menu',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, CommonModule],
  templateUrl: './user-side-menu.component.html',
  styleUrl: './user-side-menu.component.css'
})
export class UserSideMenuComponent {
  menu: MenuItem[] = [
    {
      text: "Edit Profile",
      routerLink: "user-details"
    },
    {
      text: "My Events",
      routerLink: "events/submitted"
    },
    {
      text: "Liked Events",
      routerLink: "events/liked"
    }
  ]
  
  entryTrackFn(index: number, entry: any):any {
    return entry.routerLink;
  }
}
