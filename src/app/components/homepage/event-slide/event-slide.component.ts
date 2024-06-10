import { Component, Input } from '@angular/core';
import { Event } from 'src/app/shared/interfaces/event';

@Component({
  selector: 'app-event-slide',
  standalone: true,
  imports: [],
  templateUrl: './event-slide.component.html',
  styleUrl: './event-slide.component.css'
})
export class EventSlideComponent {
  @Input() event: Event

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('el-GR');
  }

  // formatDate(dateString: Date): string {
  //   const date = new Date(dateString);
  //   return date.toLocaleDateString('el-GR', {
  //     year: 'numeric',
  //     month: 'numeric',
  //     day: 'numeric',
  //   });
  // }
}
