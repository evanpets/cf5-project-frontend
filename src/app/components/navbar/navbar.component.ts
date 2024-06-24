import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { UserService } from 'src/app/shared/services/user.service';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { User } from 'src/app/shared/interfaces/user';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, MatIconModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})

export class NavbarComponent {
  userService = inject(UserService)
  user = this.userService.user

  logout() {
    this.userService.logoutUser();
  }
}


