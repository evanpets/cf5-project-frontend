import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-admin-menu',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './admin-menu.component.html',
  styleUrl: './admin-menu.component.css'
})
export class AdminMenuComponent {
  constructor (private userService: UserService) {}
  user = this.userService.user
}
