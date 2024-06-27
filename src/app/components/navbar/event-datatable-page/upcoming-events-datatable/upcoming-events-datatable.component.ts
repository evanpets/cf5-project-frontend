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
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-upcoming-events-datatable',
  standalone: true,
  imports: [DialogModule, EventsDatatableComponent],
  templateUrl: './upcoming-events-datatable.component.html',
  styleUrl: './upcoming-events-datatable.component.css'
})

export class UpcomingEventsDatatableComponent {
  upcomingEvents: Event[] =[];

  constructor(public dialog: Dialog, private eventService: EventService){}

  ngOnInit(): void {
    this.eventService.getAllUpcomingEvents().subscribe(events => {
      
      const currentDate = new Date();
      this.upcomingEvents = events
        .filter(event => new Date(event.date) >= currentDate)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    });
  }
  
  onEventClicked(event: Event) {
    this.dialog.open(UpcomingEventDialogComponent, {
      data: event
    })
  }
}

@Component({
imports: [EventTableComponent, RouterLink],
standalone: true,
selector: 'app-upcoming-events-dialog',
template: `
  <app-event-table [event]="event"></app-event-table>
  <div class="d-flex justify-content-between">
    <button class="btn btn-primary btn-sm" (click)="dialogRef.close()">
      Close
    </button>
    <button class="btn btn-primary btn-sm" (click)="redirectToDetails()">
    Details
    </button>
  </div>

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

class UpcomingEventDialogComponent {
  constructor(
    public dialogRef: DialogRef,
    @Inject(DIALOG_DATA) public event: Event, private router: Router
  ) {}

  redirectToDetails() {
    this.router.navigate(['/api/events', this.event.eventId]).then(() => {
      this.dialogRef.close();
    });
  }
}