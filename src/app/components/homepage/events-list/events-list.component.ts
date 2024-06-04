import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Event, EventsList } from 'src/app/shared/interfaces/event';
import { EventCardHomepageComponent } from '../event-card-homepage/event-card-homepage.component';
import { EventService } from 'src/app/shared/services/event.service';

@Component({
  selector: 'app-events-list',
  standalone: true,
  imports: [EventCardHomepageComponent, CommonModule],
  templateUrl: './events-list.component.html',
  styleUrl: './events-list.component.css'
})
export class EventsListComponent implements OnInit {
  constructor(private eventService: EventService) {}
  events: Event[] = []

  // events: Event[] = EventsList

  visibleEvents: Event[] = [];
  loadCount = 10;

  ngOnInit(): void {
    this.eventService.getEvents().subscribe({
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
    // this.sortEventsByDate();
    // this.loadTenMore();
  }

  sortEventsByDate(): void {
    this.events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  loadTenMore() : void {
    const nextEvents = this.events.slice(this.visibleEvents.length, this.visibleEvents.length + this.loadCount);
    this.visibleEvents = [...this.visibleEvents, ...nextEvents];
  }
}
