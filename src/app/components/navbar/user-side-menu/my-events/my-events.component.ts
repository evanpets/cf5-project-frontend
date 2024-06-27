import { CommonModule } from '@angular/common';
import { Component, ElementRef, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { Event, BackendEvent } from 'src/app/shared/interfaces/event';
import { EventService } from 'src/app/shared/services/event.service';
import { EventsDatatableComponent } from '../../event-datatable-page/events-datatable/events-datatable.component';
import { UserService } from 'src/app/shared/services/user.service';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { LoggedInUser, User } from 'src/app/shared/interfaces/user';
import { Dialog, DialogModule, DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-events',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, EventsDatatableComponent, MatFormFieldModule, MatInputModule, MatButtonModule, MatOptionModule, MatIconModule, MatNativeDateModule, MatDatepickerModule, MatCheckboxModule, MatSelectModule, DialogModule],
  templateUrl: './my-events.component.html',
  styleUrl: './my-events.component.css',
  animations: [
    trigger('slideInOut', [
      state('in', style({
        height: '*',
        opacity: 1,
        transform: 'translateY(0)'
      })),
      transition(':enter', [
        style({ height: 0, opacity: 0, transform: 'translateY(-20px)' }),
        animate('500ms ease-in')
      ]),
      transition(':leave', [
        animate('200ms ease-out', style({ height: 0, opacity: 0, transform: 'translateY(-20px)' }))
      ])
    ])
  ]
})

export class MyEventsComponent implements OnInit{
  myEvents: Event[] = [];
  editForm: FormGroup;
  isEditing: boolean = false;
  currentEvent: Event | null = null;
  currentUser: User
  selectedFile: File | null = null
  venues: any[] = [];
  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(private eventService: EventService, private userService: UserService, private fb: FormBuilder, public dialog: Dialog) {
    this.editForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],
      venueName: ['', Validators.required],
      venueStreet: [{ value: '', disabled: true }, Validators.required],
      venueStreetNumber: [{ value: '', disabled: true }, Validators.required],
      venueZipCode: [{ value: '', disabled: true }, Validators.required],
      venueCity: [{ value: '', disabled: true }, Validators.required],
      price: [null, [Validators.required]],
      date: [null, [Validators.required]],
      performers: this.fb.array([]),
      category: [null, [Validators.required]],
      eventImage: [''] 
    });
  }

  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadVenues();
  }

  loadCurrentUser() {
    const username = (this.userService.user() as LoggedInUser).username
    this.userService.getUserByUsername(username).subscribe({
      next: (response) => {
        this.currentUser = response;
        console.log('Current user:', this.currentUser);
        this.loadUserEvents()
      },
      error: (error) => {
        console.error('Error fetching current user', error);
      }
    });
  }

  loadVenues() {
    this.eventService.getRegisteredVenues().subscribe({
      next: (venues) => {
        this.venues = venues;
      },
      error: (error) => {
        console.error('Error fetching venues', error);
      }
    });
  }

  loadUserEvents(): void {
    this.eventService.getUserEvents(this.currentUser.userId).subscribe({
      next: (response: BackendEvent[]) => {
        this.myEvents = response.map(event => ({
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
        console.log("Couldn't load any events");
      }

    });
  }
  
  editEvent(event: Event): void {
    this.eventService.getSingleEventById(event.eventId).subscribe({
      next: (response) => {
        
        this.currentEvent = response
        this.isEditing = true;
    
        this.performers.clear();
        event.performers.forEach(performer => {
          this.performers.push(this.fb.group({
            name: [performer.name, Validators.required]
          }));
        });
        
        const selectedVenue = this.venues.find(venue => venue.name === event.venue.name);

        this.editForm.patchValue({
          title: event.title,
          description: event.description,
          date: event.date,
          venueName: selectedVenue ? selectedVenue.name : '',
          venueStreet: selectedVenue ? selectedVenue.venueAddress.street : '',
          venueStreetNumber: selectedVenue ? selectedVenue.venueAddress.streetNumber : '',
          venueZipCode: selectedVenue ? selectedVenue.venueAddress.zipCode : '',
          venueCity: selectedVenue ? selectedVenue.venueAddress.city : '',
          price: event.price,
          category: event.category,
          eventImage: event.imageUrl
        });
      },
      error: (err) => {
        console.log("Error fetching response", err);
      }
    })
  }

  onVenueChange(venueName: string) {
    const selectedVenue = this.venues.find(venue => venue.name === venueName);
    if (selectedVenue) {
      console.log('Selected Venue:', selectedVenue);
      this.editForm.patchValue({
        venueStreet: selectedVenue.venueAddress.street,
        venueStreetNumber: selectedVenue.venueAddress.streetNumber,
        venueZipCode: selectedVenue.venueAddress.zipCode,
        venueCity: selectedVenue.venueAddress.city
      });
    } else {
      console.error('Venue not found:', venueName);
    }
  }
  

  saveEvent(): void {
    if (this.editForm.valid && this.currentEvent) {      
      const selectedVenue = this.venues.find(venue => venue.name === this.editForm.value.venueName);

      const eventToUpdate: BackendEvent = {
        eventId: this.currentEvent.eventId,
        title: this.editForm.value.title,
        description: this.editForm.value.description,
        venueId: selectedVenue.venueId,
        venueName: selectedVenue.name,
        venueAddressId: selectedVenue.venueAddress.venueAddressId,
        venueStreet: selectedVenue.venueAddress.street,
        venueStreetNumber: selectedVenue.venueAddress.streetNumber,
        venueZipCode: selectedVenue.venueAddress.zipCode,
        venueCity: selectedVenue.venueAddress.city,
        price: this.editForm.value.price,
        date: this.editForm.value.date instanceof Date ? this.editForm.value.date.toISOString().split('T')[0] : this.editForm.value.date,
        category: this.editForm.value.category,
        performers: this.performers.controls.map(c => ({ name: c.value.name })),
        imageUrl: this.editForm.value.eventImage,
        isSaved: this.currentEvent.isSaved,
        userId: this.currentEvent.userId
       };

      const updateFormData = new FormData();
      updateFormData.append('eventToUpdate', JSON.stringify(eventToUpdate))

      if (this.selectedFile) {
        if (this.selectedFile.size > 5 * 1024 * 1024) { 
          alert("File size should be less than 5 MB.");
          return;
        }
        updateFormData.append('eventImage', this.selectedFile, this.selectedFile.name);
      }
       
      this.eventService.updateEvent(this.currentEvent.eventId, updateFormData).subscribe({
        next: (response) => {
          console.log("Response: ", response,  response.msg);
          this.loadUserEvents();
          this.isEditing = false;
          this.currentEvent = null;
        },
        error: (error) => {
          console.error('Error updating event', error.msg);
        }
      });
    }
  }

  openFileInput(event: any): void {
    event.preventDefault();
    event.stopPropagation();
    if (this.fileInput) {
      this.fileInput.nativeElement.click();
    }
  }
  onFileSelect(event: any): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
    }
  }

  openConfirmDeleteDialog(event: Event) {
    this.dialog.open(UserEventConfirmDeleteDialogComponent, {
      data: event
    });
  }

  get performers() {
    return this.editForm.get('performers') as FormArray;
  }
  createPerformer(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required], ]
    });
  }  
  
  addPerformer() {
    this.performers.push(this.createPerformer());
  }

  removePerformer(index: number) {
    this.performers.removeAt(index);
  }
}

@Component({
  selector: 'app-user-event-confirm-delete',
  template: `
    <div>
      <h4>Are you sure you want to delete this event?</h4>
      <p class="text-center">{{ event.title }}</p>
      <div class="d-flex justify-content-around">
        <button class="btn btn-primary" mat-button (click)="confirmDelete(event.eventId)">Confirm</button>
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
export class UserEventConfirmDeleteDialogComponent {

  constructor(private dialogRef: DialogRef, private router: Router, private eventService: EventService, @Inject(DIALOG_DATA) public event: any) {}

  confirmDelete(eventId: number) {
    if (!eventId) {
      console.error('Event is undefined or null');
      return;
    } 
    this.eventService.deleteEvent(eventId).subscribe({
      next: (response) => {
        console.log("Delete complete", response);
        this.reloadCurrentRoute()
      },
      error: (err) => {
        console.log("Error during deletion ", err);
        
      }


    });
        this.dialogRef.close();
  }

  closeDialog() {
    this.dialogRef.close();
  }

  reloadCurrentRoute() {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }
}