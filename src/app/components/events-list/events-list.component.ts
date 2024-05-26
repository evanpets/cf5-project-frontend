import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Event, EventsList } from 'src/app/shared/interfaces/event';
import { EventCardHomepageComponent } from '../event-card-homepage/event-card-homepage.component';

@Component({
  selector: 'app-events-list',
  standalone: true,
  imports: [EventCardHomepageComponent, CommonModule],
  templateUrl: './events-list.component.html',
  styleUrl: './events-list.component.css'
})
export class EventsListComponent implements OnInit {
  events: Event[] = EventsList

  visibleEvents: Event[] = [];
  loadCount = 10;

  ngOnInit(): void {
    this.sortEventsByDate();
    this.loadTenMore();
  }

  sortEventsByDate(): void {
    this.events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  loadTenMore() : void {
    const nextEvents = this.events.slice(this.visibleEvents.length, this.visibleEvents.length + this.loadCount);
    this.visibleEvents = [...this.visibleEvents, ...nextEvents];
  }
}
