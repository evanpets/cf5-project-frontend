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
  @Output() toggleLike = new EventEmitter<Event>();

  constructor(private eventService: EventService) {}

  ngOnInit() {
    if (this.currentUser) {
      console.log("Init user: " + this.currentUser.username);
      this.retrieveBookmarkStatus();
    }
  }

  ngOnChanges() {
    if (this.currentUser) {
      this.retrieveBookmarkStatus();
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

  retrieveBookmarkStatus() {
    if (!this.currentUser) {
      console.error('Current user is not defined.');
      return;
    }
    this.eventService.isEventBookmarked(this.event.eventId, this.currentUser.userId).subscribe({
      next: (response) => {
        this.event.isLiked = response.isLiked;
        console.log("Bookmark status retrieved");
      },
      error: (error) => {
        console.error('Error checking if event is liked:', error);
      }
    });
  }

  onToggleLike(eventClick: MouseEvent): void {
    eventClick.stopPropagation();

    if (this.event.isLiked) {
      this.eventService.unlikeEvent(this.event.eventId, this.currentUser.userId).subscribe({
        next: (response) => {
          this.event.isLiked = false;
          this.toggleLike.emit(this.event);
          console.log(response);
        },
        error: (error) => {
          console.error('Error unliking the event:', error);
        }
      });
    } else {
      this.eventService.likeEvent(this.event.eventId, this.currentUser.userId).subscribe({
        next: (response) => {
          this.event.isLiked = true;
          this.toggleLike.emit(this.event);
          console.log(response);
        },
        error: (error) => {
          console.error('Error liking the event:', error);
        }
      });
    }
  }
}
