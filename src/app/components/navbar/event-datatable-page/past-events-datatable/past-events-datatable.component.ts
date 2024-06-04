import { Component, Inject } from '@angular/core';
import {
  Dialog,
  DialogRef,
  DIALOG_DATA,
  DialogModule,
} from '@angular/cdk/dialog';
import { EventsDatatableComponent } from '../events-datatable/events-datatable.component';
import { Event } from 'src/app/shared/interfaces/event';
import { EventTableComponent } from '../event-table/event-table.component';
import { EventService } from 'src/app/shared/services/event.service';

@Component({
  selector: 'app-past-events-datatable',
  standalone: true,
  imports: [DialogModule, EventsDatatableComponent],
  templateUrl: './past-events-datatable.component.html',
  styleUrl: './past-events-datatable.component.css'
})
export class PastEventsDatatableComponent {
  pastEvents: Event[] =[];

  constructor(public dialog: Dialog, private eventService: EventService){}

  onEventClicked(event: Event) {
    this.dialog.open(EventDialogComponent, {
      data: event
    })
  }

  ngOnInit(): void {
    this.eventService.getEvents().subscribe(events => {
      const currentDate = new Date();
      this.pastEvents = events
        .filter(event => new Date(event.date) < currentDate)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    });
  }
  
  personTemplate(event: Event) {
    return `
    Event Details:
  
    Title: ${event.title}
    Date: ${event.date}
    Venue: ${event.venue.name}
    Address: ${event.venue.venueAddress.streetNumber, " ", event.venue.venueAddress.street}
    Performers: ${event.performers[0].name}
    Price: ${event.price}
    Category: ${event.category}
    Description: ${event.description}

    `;
  }
}

@Component({
imports: [EventTableComponent],
standalone: true,
template: `
  <app-event-table [event]="event"></app-event-table>
  <button class="btn btn-primary btn-sm" (click)="dialogRef.close()">
    Close
  </button>
`,
styles: [
  `
    :host {
      display: block;
      background: #fff;
      border-radius: 8px;
      padding: 16px;
      max-width: 500px;
    }
  `,
],
})

class EventDialogComponent {
constructor(
  public dialogRef: DialogRef,
  @Inject(DIALOG_DATA) public event: Event,
) {}
}
