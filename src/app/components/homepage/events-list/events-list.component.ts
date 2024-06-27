import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Event } from 'src/app/shared/interfaces/event';
import { EventCardComponent } from '../event-card/event-card.component';
import { EventService } from 'src/app/shared/services/event.service';
import { User } from 'src/app/shared/interfaces/user';
import { SearchBarComponent } from '../search-bar/search-bar.component';

@Component({
  selector: 'app-events-list',
  standalone: true,
  imports: [EventCardComponent, CommonModule, SearchBarComponent],
  templateUrl: './events-list.component.html',
  styleUrl: './events-list.component.css'
})
export class EventsListComponent {
  @Input() currentUser: User;
  events: Event[] = []
  filteredEvents: Event[] = [];
  visibleEvents: Event[] = [];
  loadCount = 10;
  searchCategory: string = 'event';
  searchQuery: string = '';

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.eventService.getAllUpcomingEvents().subscribe({
      next: (response) => {
        console.log(response)
        this.events = response
        this.sortEventsByDate();
        this.loadTenMore();
      },
      error: (err) => {
        console.error("Error in loading events", err)
      }
    })
  }

  sortEventsByDate(): void {
    this.events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }


  filterEvents(): void {
    switch (this.searchCategory) {
      case 'venue':
        this.filteredEvents = this.events.filter(event => event.venue.name.toLowerCase().includes(this.searchQuery.toLowerCase()));
        break;
      case 'performer':
        this.filteredEvents = this.events.filter(event => event.performers.some(performer => performer.name.toLowerCase().includes(this.searchQuery.toLowerCase())));
        break;
      case 'date':
        this.filteredEvents = this.events.filter(event => new Date(event.date).toLocaleDateString().includes(this.searchQuery));
        break;
      default:
        this.filteredEvents = this.events.filter(event => event.title.toLowerCase().includes(this.searchQuery.toLowerCase()));
    }
    this.loadVisibleEvents();
  }

  loadVisibleEvents(): void {
    this.visibleEvents = this.filteredEvents.slice(0, this.loadCount);
  }

  onSearchCategoryChange(category: string): void {
    this.searchCategory = category;
    console.log("category change");
    
    this.filterEvents();
  }

  onSearchQueryChange(query: string): void {
    this.searchQuery = query;
    this.filterEvents();
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
