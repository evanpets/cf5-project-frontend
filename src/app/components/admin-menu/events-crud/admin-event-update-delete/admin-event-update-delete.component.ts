import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from '@angular/router';
import { BackendEvent, Event } from 'src/app/shared/interfaces/event';
import { User, LoggedInUser } from 'src/app/shared/interfaces/user';
import { EventService } from 'src/app/shared/services/event.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-admin-event-update-delete',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatOptionModule, MatIconModule, MatNativeDateModule, MatDatepickerModule, MatCheckboxModule, MatSelectModule, RouterLink],
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

  constructor(private eventService: EventService, private userService: UserService, private fb: FormBuilder) {
    this.editForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', [Validators.maxLength(250)]],
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
  }

  loadCurrentUser() {
    const username = (this.userService.user() as LoggedInUser).username
    console.log(username)
    this.userService.getUserByUsername(username).subscribe({
      next: (response) => {
        this.currentUser = response;
        this.loadVenues();
        console.log('Current user ID: ', this.currentUser.userId)
        console.log('Current user:', this.currentUser);
      },
      error: (error) => {
        console.error('Error fetching current user', error);
      }
    });
  }

  loadVenues() {
    this.eventService.getVenues().subscribe({
      next: (venues) => {
        this.venues = venues;
        console.log('Venues loaded:', this.venues);
        this.loadAllEvents();
      },
      error: (error) => {
        console.error('Error fetching venues', error);
      }
    });
  }

  loadAllEvents(): void {
    this.eventService.getEvents().subscribe((response: Event[]) => {
      console.log("Response: ", response);
      this.events = response
      console.log("Events list", this.events);

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
    this.eventService.getSingleEvent(event.eventId).subscribe({
      next: (response) => {
        this.currentEvent = response
        
        this.performers.clear();
        event.performers.forEach(performer => {
          this.performers.push(this.fb.group({
            name: [performer.name, Validators.required]
          }));

        });
        
        this.editForm.patchValue({
          title: event.title,
          description: event.description,
          date: event.date,
          venueName: event.venue.name,
          venueStreet: event.venue.venueAddress.street,
          venueStreetNumber: event.venue.venueAddress.streetNumber,
          venueZipCode: event.venue.venueAddress.zipCode,
          venueCity: event.venue.venueAddress.city,
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
    console.log('Form Submitted');

    if (this.editForm.valid && this.currentEvent) {
      console.log("save beginning",this.currentEvent);
      
      const eventToUpdate: any = {
        eventId: this.currentEvent.eventId,
        title: this.editForm.value.title,
        description: this.editForm.value.description,
        venueName: this.editForm.value.venueName,
        venueStreet: this.editForm.value.venueStreet,
        venueStreetNumber: this.editForm.value.venueStreetNumber,
        venueZipCode: this.editForm.value.venueZipCode,
        venueCity: this.editForm.value.venueCity,
        price: this.editForm.value.price,
        date: this.editForm.value.date instanceof Date ? this.editForm.value.date.toISOString().split('T')[0] : this.editForm.value.date,
        category: this.editForm.value.category,
        performers: this.performers.controls.map(c => ({ name: c.value.name })),
       };

      const updateFormData = new FormData();
      updateFormData.append('eventToUpdate', JSON.stringify(eventToUpdate))

      if (this.selectedFile) {
        if (this.selectedFile.size > 5 * 1024 * 1024) { // 5 MB size limit
          alert("File size should be less than 5 MB.");
          return;
        }
        updateFormData.append('eventImage', this.selectedFile, this.selectedFile.name);
        console.log("File appended to FormData");
      }

      console.log("Update info: ", eventToUpdate);
      console.log(this.currentEvent.eventId);
       
      this.eventService.updateEvent(this.currentEvent.eventId, updateFormData).subscribe({
        next: (response) => {
          console.log("Response: ", response,  response.msg);
          this.loadAllEvents();
        },
        error: (error) => {
          console.error('Error updating event', error.msg);
        }
      });
    } else {
      console.log("Couldn't save");
      
    }
  }

  openFileInput(event: any): void {
    event.preventDefault();
    event.stopPropagation();
    // Trigger the hidden file input element
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

  deleteEvent(eventId: number): void {
    if (!eventId) {
      console.error('Event is undefined or null');
      return;
    } 
    this.eventService.deleteEvent(eventId).subscribe(response => {
      this.loadAllEvents();
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

