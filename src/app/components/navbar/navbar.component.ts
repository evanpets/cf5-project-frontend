import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { UserService } from 'src/app/shared/services/user.service';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, MatIconModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  // user : User = dummyUser
  // userService = inject(UserService)
  // User = this.userService.user
  // constructor() {}

  // get user() {
  //   return this.userService.user();
  // }
  
  // logout() {
  //   this.userService.logoutUser();
  // }
}


