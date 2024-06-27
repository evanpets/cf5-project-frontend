import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Event } from 'src/app/shared/interfaces/event';
import { User } from 'src/app/shared/interfaces/user';
import { EventService } from 'src/app/shared/services/event.service';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.css']
})
export class EventCardComponent implements OnInit, OnChanges {
  @Input() event: Event;
  @Input() currentUser: User;
  @Output() toggleSave = new EventEmitter<Event>();

  constructor(private eventService: EventService) {}

  ngOnInit() {
    if (this.currentUser) {
      this.retrieveSavedStatus();
    }
  }

  ngOnChanges() {
    if (this.currentUser) {
      this.retrieveSavedStatus();
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('el-GR');
  }

  getFullImageUrl(imageUrl: string): string | null {
    if (imageUrl) {
      return `https://localhost:5001/${imageUrl}`;
    }
    return null;
  }

  retrieveSavedStatus() {
    if (!this.currentUser) {
      console.error('Current user is not defined.');
      return;
    }
    this.eventService.isEventSaved(this.event.eventId, this.currentUser.userId).subscribe({
      next: (response) => {
        this.event.isSaved = response.isSaved;
      },
      error: (error) => {
        console.error('Error checking if event is saved:', error);
      }
    });
  }

  onToggleSave(eventClick: MouseEvent): void {
    eventClick.stopPropagation();
    this.toggleSave.emit(this.event)

  }
}
