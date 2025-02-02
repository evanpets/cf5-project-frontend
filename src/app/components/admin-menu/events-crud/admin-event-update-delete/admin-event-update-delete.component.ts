import { Dialog, DialogRef, DIALOG_DATA, DialogModule } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterLink } from '@angular/router';
import { BackendEvent, Event } from 'src/app/shared/interfaces/event';
import { User, LoggedInUser } from 'src/app/shared/interfaces/user';
import { EventService } from 'src/app/shared/services/event.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-admin-event-update-delete',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatOptionModule, MatIconModule, MatNativeDateModule, MatDatepickerModule, MatCheckboxModule, MatSelectModule, RouterLink, DialogModule],
  templateUrl: './admin-event-update-delete.component.html',
  styleUrl: './admin-event-update-delete.component.css'
})

export class AdminEventUpdateDeleteComponent implements OnInit{
  events: Event[] = [];
  editForm: FormGroup;
  currentEvent: Event | null = null;
  currentUser: User
  selectedFile: File | null = null
  venues: any[] = [];
  currentIndex: number = -1;

  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(private eventService: EventService, private userService: UserService, private fb: FormBuilder, public dialog: Dialog) {
    this.editForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],
      name: ['', Validators.required],
      street: [{ value: '', disabled: true }, Validators.required],
      streetNumber: [{ value: '', disabled: true }, Validators.required],
      zipCode: [{ value: '', disabled: true }, Validators.required],
      city: [{ value: '', disabled: true }, Validators.required],
      price: [null, [Validators.required]],
      date: [null, [Validators.required]],
      performers: this.fb.array([]),
      category: [null, [Validators.required]],
      eventImage: [''] 
    });
  }

  ngOnInit(): void {
    this.loadCurrentUser();
  }

  loadCurrentUser() {
    const username = (this.userService.user() as LoggedInUser).username
    this.userService.getUserByUsername(username).subscribe({
      next: (response) => {
        this.currentUser = response;
        this.loadVenues();
        console.log('Current user:', this.currentUser);
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
        this.loadAllEvents();
      },
      error: (error) => {
        console.error('Error fetching venues', error);
      }
    });
  }

  loadAllEvents(): void {
    this.eventService.getAllEvents().subscribe((response: Event[]) => {
      this.events = response

      this.events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      this.setClosestEventIndex();
    });
  }

  setClosestEventIndex(): void {
    const now = new Date().getTime();
    let closestIndex = 0;
    let closestDiff = Math.abs(new Date(this.events[0].date).getTime() - now);

    for (let i = 1; i < this.events.length; i++) {
      const diff = Math.abs(new Date(this.events[i].date).getTime() - now);
      if (diff < closestDiff) {
        closestDiff = diff;
        closestIndex = i;
      }
    }
    this.currentIndex = closestIndex;
    this.editEvent(this.events[this.currentIndex]);
  }
  
  editEvent(event: Event): void {
    this.eventService.getSingleEventById(event.eventId).subscribe({
      next: (response) => {
        this.currentEvent = response
        
        this.editForm.reset();
        this.performers.clear();
        event.performers.forEach(performer => {
          this.performers.push(this.fb.group({
            name: [performer.name, Validators.required]
          }));

        });

        const selectedVenue = this.venues.find(venue => venue.venueId === event.venue?.venueId);

        this.editForm.patchValue({
          title: event.title,
          description: event.description,
          date: event.date,
          name: selectedVenue ? selectedVenue.name : '',
          street: selectedVenue ? selectedVenue.venueAddress.street : '',
          streetNumber: selectedVenue ? selectedVenue.venueAddress.streetNumber : '',
          zipCode: selectedVenue ? selectedVenue.venueAddress.zipCode : '',
          city: selectedVenue ? selectedVenue.venueAddress.city : '',
          price: event.price,
          category: event.category,
          eventImage: event.imageUrl
        });
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  onVenueChange(venueName: string) {
    const selectedVenue = this.venues.find(venue => venue.name === venueName);
    if (selectedVenue) {
      console.log('Selected Venue:', selectedVenue);
      this.editForm.patchValue({
        street: selectedVenue.venueAddress.street,
        streetNumber: selectedVenue.venueAddress.streetNumber,
        zipCode: selectedVenue.venueAddress.zipCode,
        city: selectedVenue.venueAddress.city
      });
    } else {
      console.error('Venue not found:', venueName);
    }
  }
  

  saveEvent(): void {
    if (this.editForm.valid && this.currentEvent) {
      
      const selectedVenue = this.venues.find(venue => venue.name === this.editForm.value.name);

        const eventToUpdate: Event = {
          eventId: this.currentEvent.eventId,
          title: this.editForm.value.title,
          description: this.editForm.value.description,
          venue: {
            venueId: selectedVenue.venueId,
            name: selectedVenue.name,
            venueAddress: {
              venueAddressId: selectedVenue.venueAddress.venueAddressId,
              street: selectedVenue.venueAddress.street,
              streetNumber: selectedVenue.venueAddress.streetNumber,
              zipCode: selectedVenue.venueAddress.zipCode,
              city: selectedVenue.venueAddress.city,
            }
          },
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
          console.log(response);
          
          this.loadAllEvents();
        },
        error: (error) => {
          console.error(error);
        }
      });
    } else {
      console.log("Couldn't save");
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
    this.dialog.open(EventConfirmDeleteDialogComponent, {
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

  navigateToPreviousEvent() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.editEvent(this.events[this.currentIndex]);
    }
  }

  navigateToNextEvent() {
    if (this.currentIndex < this.events.length - 1) {
      this.currentIndex++;
      this.editEvent(this.events[this.currentIndex]);
    }
  }
}

@Component({
  selector: 'app-event-confirm-delete',
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
export class EventConfirmDeleteDialogComponent {

  constructor(private dialogRef: DialogRef, private router: Router, private eventService: EventService, @Inject(DIALOG_DATA) public event: any) {}

  confirmDelete(eventId: number) {
    this.eventService.deleteEvent(eventId).subscribe({
      next: (response) => {
        console.log(response);
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

