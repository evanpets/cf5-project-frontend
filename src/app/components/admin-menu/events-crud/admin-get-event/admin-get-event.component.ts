import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { Event, BackendEvent } from 'src/app/shared/interfaces/event';
import { EventService } from 'src/app/shared/services/event.service';

@Component({
  selector: 'app-admin-get-event',
  standalone: true,
  imports: [CommonModule, MatInputModule, FormsModule, RouterLink],
  templateUrl: './admin-get-event.component.html',
  styleUrl: './admin-get-event.component.css'
})
export class AdminGetEventComponent {
  events: Event[] = [];
  hasResult: boolean = false;
  idSearchQuery: number = null;
  titleSearchQuery: string = "";
  currentIndex: number = -1;


  constructor(private eventService: EventService) {}

  searchById(): void {
    if (this.idSearchQuery) {
      this.getEventById(this.idSearchQuery);
    }
  }

  searchByTitle(): void {
    if (this.titleSearchQuery) {
      this.getEventsWithTitle(this.titleSearchQuery);
    }
  }

  getEventById(eventId: number): void {
    this.eventService.getSingleEventById(eventId).subscribe({
      next: (response: BackendEvent) => {
        console.log("Response: " + JSON.stringify(response));
        this.events = [this.mapEvent(response)];
        this.currentIndex = 0;
        this.hasResult = true;
      }, 
      error: (error) => { 
        console.error("Error fetching event by ID:", error);
        this.events = [];
        this.hasResult = true;
      }
    });
  }

  getEventsWithTitle(title: string): void {
    this.eventService.getEventsWithTitle(title).subscribe({
      next: (responses: BackendEvent[]) => {
        console.log(responses);
        this.events = responses.map(response => this.mapEvent(response));
        this.currentIndex = 0;
        this.hasResult = true;
      },
      error: (error) => {
        console.error("Error fetching event by title:", error);
        this.events = [];
        this.hasResult = true;
      }

    });
  }

  mapEvent(response: BackendEvent): Event {
    return {
      eventId: response.eventId,
      title: response.title,
      description: response.description,
      date: response.date,
      category: response.category,
      userId: response.userId,
      venue: {
        venueId: response.venueId,
        name: response.venueName,
        venueAddress: {
          venueAddressId: response.venueAddressId,
          street: response.venueStreet,
          streetNumber: response.venueStreetNumber,
          zipCode: response.venueZipCode,
          city: response.venueCity
        }
      },
      performers: response.performers,
      price: response.price,
      imageUrl: response.imageUrl,
      isSaved: response.isSaved
    };
  }

  navigateToEvent(index: number): void {
    this.currentIndex = index;
  }

  getFullImageUrl(imageUrl: string): string | null {
    if (imageUrl) {
      return `https://localhost:5001/${imageUrl}`;
    }
    return null;
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('el-GR');
  }
}
