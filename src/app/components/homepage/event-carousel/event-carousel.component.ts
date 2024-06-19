import { Component } from '@angular/core';
import { EventSlideComponent } from '../event-slide/event-slide.component';
import { Event } from 'src/app/shared/interfaces/event'
import { CommonModule } from '@angular/common';
import { EventService } from 'src/app/shared/services/event.service';

@Component({
  selector: 'app-event-carousel',
  standalone: true,
  imports: [EventSlideComponent, CommonModule],
  templateUrl: './event-carousel.component.html',
  styleUrl: './event-carousel.component.css'
})

export class EventCarouselComponent {
  constructor(private eventService: EventService) {}

  events: Event[] = []

  ngOnInit(): void {
    this.eventService.getUpcomingEvents().subscribe({
      next: (response) => {
        console.log(response)
        this.events = response
      },
      error: (err) => {
        console.error("Error in loading events", err)
      }
    })
  }
}
