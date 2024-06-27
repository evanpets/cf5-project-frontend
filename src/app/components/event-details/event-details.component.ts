import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BackendEvent, Event } from 'src/app/shared/interfaces/event';
import { EventService } from 'src/app/shared/services/event.service';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './event-details.component.html',
  styleUrl: './event-details.component.css'
})
export class EventDetailsComponent implements OnInit {
  @Input() event: Event;
  events: Event[];
  previousEvent: Event;
  nextEvent: Event;

  constructor(private router: Router, private route: ActivatedRoute, private eventService: EventService) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const eventId = +params['eventId'];
      this.getEventDetails(eventId);
    });
    this.loadAllEvents();
  }

  loadAllEvents(): void {
    this.eventService.getAllEvents().subscribe((events: Event[]) => {
      this.events = events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      this.updatePreviousNextEvents();
    });
  }

  updatePreviousNextEvents(): void {
    if (this.event && this.events?.length > 0) {
      const currentIndex = this.events.findIndex(e => e.eventId === this.event.eventId);
      this.previousEvent = this.events[currentIndex - 1];
      this.nextEvent = this.events[currentIndex + 1];
    }
  }

  getEventDetails(eventId: number): void {
    this.eventService.getSingleEventById(eventId).subscribe((response: BackendEvent) => {
      console.log(response);
      
      this.event = {
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
      this.updatePreviousNextEvents();
    });
  }

  navigateToEvent(eventId: number): void {
    this.router.navigate(['api/events', eventId]);
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