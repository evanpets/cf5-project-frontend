import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { EventCardComponent } from 'src/app/components/homepage/event-card/event-card.component';
import { BackendEvent, Event } from 'src/app/shared/interfaces/event';
import { LoggedInUser, User } from 'src/app/shared/interfaces/user';
import { EventService } from 'src/app/shared/services/event.service';
import { UserService } from 'src/app/shared/services/user.service';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-saved-events',
  standalone: true,
  imports: [EventCardComponent, CommonModule],
  templateUrl: './saved-events.component.html',
  styleUrl: './saved-events.component.css'
})
export class SavedEventsComponent implements OnInit{
  savedEvents: Event[] = []
  currentUser: User;

  constructor(private eventService: EventService, private userService: UserService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadCurrentUser()
  }

  loadCurrentUser() {
    const username = (this.userService.user() as LoggedInUser).username;
    console.log(username);
    this.userService.getUserByUsername(username).subscribe({
      next: (response) => {
        this.currentUser = response;
        this.currentUser.userId = response.userId;
        this.loadSavedEvents();
      },
      error: (error) => {
        console.error('Error fetching current user', error);
      }
    });
  }

  loadSavedEvents() {
    this.eventService.getSavedEvents(this.currentUser.userId).subscribe({
      next: (response) => {
        console.log(response.msg);
        console.log('Saved events:', response.savedEventsList);
        this.savedEvents = response.savedEventsList.map(event => ({
          eventId: event.eventId,
          title: event.title,
          description: event.description,
          date: event.date,
          category: event.category,
          userId: event.userId,
          venue: {
            venueId: event.venueId,
            name: event.venueName,
            venueAddress: {
              venueAddressId: event.venueAddressId,
              street: event.venueStreet,
              streetNumber: event.venueStreetNumber,
              zipCode: event.venueZipCode,
              city: event.venueCity
            }
          },
          performers: event.performers,
          price: event.price,
          imageUrl: event.imageUrl,
          isSaved: event.isSaved
        }));
        
      },
      error: (err) => {
        console.error("Error in loading events", err);
      }
    });
  }

    onToggleSave(event: Event) {
      this.openConfirmUnsaveDialog(event, this.currentUser);

  }

  openConfirmUnsaveDialog(event: Event, user: User) {
    const dialogRef = this.dialog.open(ConfirmUnsaveDialogComponent, {
      data: { event, user }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirmed') {
        this.eventService.unsaveEvent(event.eventId, this.currentUser.userId).subscribe({
          next: (response) => {
            console.log("Unsaved", response);
            this.savedEvents = this.savedEvents.filter(e => e.eventId !== event.eventId);
          },
          error: (err) => {
            console.log("Couldn't unsave ", err);
          }
        });
      }
    });
  }
}

@Component({
  selector: 'app-confirm-unsave',
  template: `
    <div>
      <h5 class="text-center">Are you sure you want to unsave this venue?<br>(It will be removed from this page)</h5>
      <p class="text-center">{{ data.event.title }}</p>
      <div class="d-flex justify-content-around">
        <button class="btn btn-primary" mat-button (click)="confirm()">Confirm</button>
        <button class="btn btn-danger" mat-button (click)="closeDialog()">Cancel</button>
      </div>

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
  ]
})
export class ConfirmUnsaveDialogComponent {

  constructor(private dialogRef: MatDialogRef<ConfirmUnsaveDialogComponent>, private eventService: EventService, @Inject(MAT_DIALOG_DATA) public data: any) {}

  confirm() {
    this.dialogRef.close('confirmed');
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
