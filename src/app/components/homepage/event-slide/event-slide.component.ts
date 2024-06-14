import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Event } from 'src/app/shared/interfaces/event';

@Component({
  selector: 'app-event-slide',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-slide.component.html',
  styleUrl: './event-slide.component.css'
})
export class EventSlideComponent {
  @Input() event: Event

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('el-GR');
  }

  getFullImageUrl(imageUrl: string): string | null {
    if (imageUrl) {
      return `https://localhost:5001/${imageUrl}`;
    }
    return null
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
