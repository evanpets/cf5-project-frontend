import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Event } from 'src/app/shared/interfaces/event';

@Component({
  selector: 'app-event-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-table.component.html',
  styleUrl: './event-table.component.css'
})
export class EventTableComponent {
  @Input() event: Event
}
