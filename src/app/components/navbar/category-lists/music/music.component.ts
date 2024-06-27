import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { EventCardComponent } from 'src/app/components/homepage/event-card/event-card.component';
import { Event } from 'src/app/shared/interfaces/event';
import { User } from 'src/app/shared/interfaces/user';
import { EventService } from 'src/app/shared/services/event.service';

@Component({
  selector: 'app-music',
  standalone: true,
  imports: [CommonModule, EventCardComponent],
  templateUrl: './music.component.html',
  styleUrl: './music.component.css'
})
export class MusicComponent implements OnInit{
  events: Event[] = []
  filteredEvents: Event[] = [];
  visibleEvents: Event[] = [];
  loadCount = 10;
  eventCategory: string = 'Music';

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.eventService.getAllEventsInCategory(this.eventCategory).subscribe({
      next: (response) => {
        console.log(response)
        this.events = response.eventsList
        console.log(this.events);
        for (var event in this.events) {
          console.log(event);
          
        }
        
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
