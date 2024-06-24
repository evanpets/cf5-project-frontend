import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { User } from 'src/app/shared/interfaces/user';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-admin-get-user',
  standalone: true,
  imports: [CommonModule, MatInputModule, FormsModule, RouterLink],
  templateUrl: './admin-get-user.component.html',
  styleUrl: './admin-get-user.component.css'
})
export class AdminGetUserComponent {
  user: User;
  hasResult: boolean = false;
  idSearchQuery: number = null;
  usernameSearchQuery: string = "";

  constructor(private userService: UserService) {}

  searchById(): void {
    if (this.idSearchQuery) {
      this.getUserById(this.idSearchQuery);
    }
  }

  searchByUsername(): void {
    if (this.usernameSearchQuery) {
      this.getUserByUsername(this.usernameSearchQuery);
    }
  }

  getUserById(userId: number): void {
    this.userService.getUserById(userId).subscribe({
      next: (response: User) => {
        console.log("Response: " + JSON.stringify(response));
        this.user = response
        this.hasResult = true;
      }, 
      error: (error) => { 
        console.error("Error fetching event by ID:", error);
        this.user = null
        this.hasResult = true;
      }
    });
  }

  getUserByUsername(username: string): void {
    this.userService.getUserByUsername(username).subscribe({
      next: (response: User) => {
        console.log("Response: " + JSON.stringify(response));
        this.user = response
        this.hasResult = true;
      }, 
      error: (error) => { 
        console.error("Error fetching event by ID:", error);
        this.user = null
        this.hasResult = true;
      }
    });
  }
}
