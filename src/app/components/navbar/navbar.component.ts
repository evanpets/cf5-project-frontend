import { Component, Input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserService } from 'src/app/shared/services/user.service';
import { MatIconModule } from '@angular/material/icon';
import { User } from 'src/app/shared/interfaces/user';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, MatIconModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  // userService = inject(UserService)
  // user = this.userService.user

  // logout() {
  //   this.userService.logoutUser();
  // }
}


