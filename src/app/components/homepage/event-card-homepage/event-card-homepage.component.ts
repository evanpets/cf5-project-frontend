import { Component, Input } from '@angular/core';
import { Event } from 'src/app/shared/interfaces/event';
@Component({
  selector: 'app-event-card-homepage',
  standalone: true,
  imports: [],
  templateUrl: './event-card-homepage.component.html',
  styleUrl: './event-card-homepage.component.css'
})
export class EventCardHomepageComponent {
  @Input() event: Event

  // formatDate(date: Date): string {
  //   return new Date(date).toLocaleDateString('el-GR');
  // }
}
