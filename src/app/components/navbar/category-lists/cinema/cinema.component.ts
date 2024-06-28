import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { EventCardComponent } from 'src/app/components/homepage/event-card/event-card.component';
import { Event } from 'src/app/shared/interfaces/event';
import { LoggedInUser, User } from 'src/app/shared/interfaces/user';
import { EventService } from 'src/app/shared/services/event.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-cinema',
  standalone: true,
  imports: [CommonModule, EventCardComponent],
  templateUrl: './cinema.component.html',
  styleUrl: './cinema.component.css'
})
export class CinemaComponent  implements OnInit{
  currentUser: User
  events: Event[] = []
  filteredEvents: Event[] = [];
  visibleEvents: Event[] = [];
  loadCount = 10;
  eventCategory: string = 'Cinema';

  constructor(private eventService: EventService, private userService: UserService) {}

  ngOnInit(): void {
    this.loadCurrentUser();
    this.eventService.getAllUpcomingEventsInCategory(this.eventCategory).subscribe({
      next: (response) => {
        this.events = response.eventsList
      
        this.sortEventsByDate();
        this.loadTenMore();
      },
      error: (err) => {
        console.error("Error in loading events", err)
      }
    })
  }

  loadCurrentUser() {
    const username = (this.userService.user() as LoggedInUser)?.username
    this.userService.getUserByUsername(username).subscribe({
      next: (response) => {
        this.currentUser = response;
        console.log('Current user:', this.currentUser);
      },
      error: (error) => {
        console.error('Error fetching current user', error);
      }
    });
  }
  
  sortEventsByDate(): void {
    this.events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  loadTenMore() : void {
    const nextEvents = this.events.slice(this.visibleEvents.length, this.visibleEvents.length + this.loadCount);
    this.visibleEvents = [...this.visibleEvents, ...nextEvents];
  }

  onToggleSave(event: Event): void {
    if (event.isSaved) {
      this.eventService.unsaveEvent(event.eventId).subscribe({
        next: (response) => {
          event.isSaved = false;
          console.log(response);
        },
        error: (error) => {
          console.error('Error unliking the event:', error);
        }
      });
    } else {
      this.eventService.saveEvent(event.eventId).subscribe({
        next: (response) => {
          event.isSaved = true;
          console.log(response);
        },
        error: (error) => {
          console.error('Error liking the event:', error);
        }
      });
    }
  }
}
