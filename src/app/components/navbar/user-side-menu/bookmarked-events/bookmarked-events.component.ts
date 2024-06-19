import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { EventCardComponent } from 'src/app/components/homepage/event-card/event-card.component';
import { BackendEvent, Event } from 'src/app/shared/interfaces/event';
import { LoggedInUser, User } from 'src/app/shared/interfaces/user';
import { EventService } from 'src/app/shared/services/event.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-liked-events',
  standalone: true,
  imports: [EventCardComponent, CommonModule],
  templateUrl: './bookmarked-events.component.html',
  styleUrl: './bookmarked-events.component.css'
})
export class LikedEventsComponent implements OnInit{
  bookmarkedEvents: Event[] = []
  currentUser: User;

  constructor(private eventService: EventService, private userService: UserService) {}

  ngOnInit(): void {
    this.loadCurrentUser()
  }

  loadCurrentUser() {
    const username = (this.userService.user() as LoggedInUser).username;
    console.log(username);
    this.userService.getUser(username).subscribe({
      next: (response) => {
        this.currentUser = response;
        this.currentUser.userId = response.userId;
        this.loadBookmarkedEvents();
      },
      error: (error) => {
        console.error('Error fetching current user', error);
      }
    });
  }

  loadBookmarkedEvents() {
    this.eventService.getBookmarkedEvents(this.currentUser.userId).subscribe({
      next: (response) => {
        console.log(response.msg);
        console.log('Bookmarked events:', response.bookmarkedEventsList);
        this.bookmarkedEvents = response.bookmarkedEventsList.map(event => ({
          eventId: event.eventId,
          title: event.title,
          description: event.description,
          date: event.date,
          category: event.category,
          userId: event.userId,
          venue: {
            venueId: event.venueId,
            name: event.venueName,
            venueAddress: {
              venueAddressId: event.venueAddressId,
              street: event.venueStreet,
              streetNumber: event.venueStreetNumber,
              zipCode: event.venueZipCode,
              city: event.venueCity
            }
          },
          performers: event.performers,
          price: event.price,
          imageUrl: event.imageUrl,
          isLiked: event.isLiked
        }));
        
      },
      error: (err) => {
        console.error("Error in loading events", err);
      }
    });
  }

    onToggleLike(event: Event) {
    if (!event.isLiked) {
      // If the event is unliked, remove it from the list of bookmarked events
      this.bookmarkedEvents = this.bookmarkedEvents.filter(e => e.eventId !== event.eventId);
    }
  }
}
