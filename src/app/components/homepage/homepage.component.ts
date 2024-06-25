import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { EventCarouselComponent } from './event-carousel/event-carousel.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { EventsListComponent } from './events-list/events-list.component';
import { User, LoggedInUser } from 'src/app/shared/interfaces/user';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [EventCarouselComponent, SearchBarComponent, EventsListComponent],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent implements OnInit{
  currentUser: User | null
  constructor (private userService: UserService) {}

  ngOnInit() {
    this.loadCurrentUser()
  }

  loadCurrentUser() {
    const user = this.userService.user();
    if (user) {
      const username = (user as LoggedInUser).username;
      this.userService.getUserByUsername(username).subscribe({
        next: (response) => {
          console.log('Current user ID: ', response.userId)
          console.log('Current user:', response);
            this.currentUser = response
        },
        error: (error) => {
          console.error('Error fetching current user', error);
        }
      });
    }
  }
}
