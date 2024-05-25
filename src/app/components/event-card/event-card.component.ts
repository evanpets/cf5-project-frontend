import { Component, Input } from '@angular/core';
import { Event } from 'src/app/shared/interfaces/event';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [],
  templateUrl: './event-card.component.html',
  styleUrl: './event-card.component.css'
})
export class EventCardComponent {
  @Input() event: Event

}
