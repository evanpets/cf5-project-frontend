import { Component } from '@angular/core';
import { EventCardComponent } from '../event-card/event-card.component';
import { Event, EventsList } from 'src/app/shared/interfaces/event'
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-event-carousel',
  standalone: true,
  imports: [EventCardComponent, CommonModule],
  templateUrl: './event-carousel.component.html',
  styleUrl: './event-carousel.component.css'
})

export class EventCarouselComponent {
  events: Event[] = EventsList

}
