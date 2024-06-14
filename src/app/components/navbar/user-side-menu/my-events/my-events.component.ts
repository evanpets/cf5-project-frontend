import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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

@Component({
  selector: 'app-my-events',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, EventsDatatableComponent, MatFormFieldModule, MatInputModule, MatButtonModule, MatOptionModule, MatIconModule, MatNativeDateModule, MatDatepickerModule, MatCheckboxModule, MatSelectModule],
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
  initialVenueName: string;
  selectedFile: File | null = null
  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(private eventService: EventService, private userService: UserService, private fb: FormBuilder) {
    this.editForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', [Validators.maxLength(250)]],
      venueName: ['', Validators.required],
      venueStreet: ['', Validators.required],
      venueStreetNumber: ['', Validators.required],
      venueZipCode: ['', Validators.required],
      venueCity: ['', Validators.required],
      price: [null, [Validators.required]],
      date: [null, [Validators.required]],
      performers: this.fb.array([]),
      category: [null, [Validators.required]],
      eventImage: [''] // FormControl for event image
    });
  }

  ngOnInit(): void {
    this.loadCurrentUser();
  }

  loadCurrentUser() {
    const username = (this.userService.user() as LoggedInUser).username
    console.log(username)
    this.userService.getUser(username).subscribe({
      next: (response) => {
        this.currentUser = response;
        console.log('Current user ID: ', this.currentUser.userId)
        console.log('Current user:', this.currentUser);
        this.loadUserEvents()
      },
      error: (error) => {
        console.error('Error fetching current user', error);
      }
    });
  }
  
  loadUserEvents(): void {
    this.eventService.getUserEvents(this.currentUser.userId).subscribe((response: BackendEvent[]) => {
      console.log("Response: ",response);
      
      this.myEvents = response.map(event => ({
        eventId: event.eventId,
        title: event.title,
        description: event.description,
        date: event.date,
        category: event.category,
        userId: event.userId,
        venue: {
          name: event.venueName,
          venueAddress: {
            street: event.venueStreet, 
            streetNumber: event.venueStreetNumber,
            zipCode: event.venueZipCode,
            city: event.venueCity
          }
        },
        performers: event.performers,
        price: event.price,
        imageUrl: event.imageUrl
      }));
      console.log("MyEvents list",this.myEvents);
      for (let event of this.myEvents) {
        console.log("Event: ",JSON.stringify(event));
      }
    });
  }
  
  editEvent(event: Event): void {
    this.eventService.getSingleEvent(event.eventId).subscribe({
      next: (response) => {
        console.log("Response",response);
        // const fetchedEvent = response
        // if (!fetchedEvent) {
        //   console.error('Fetched event is undefined or null');
        //   return;
        // }   
        // this.currentEvent = fetchedEvent;
        this.currentEvent = response
        console.log("current event", this.currentEvent + ", category " + this.currentEvent.category);
        this.isEditing = true;
    
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
          eventImage: event.imageUrl // Assuming imageUrl is the URL or name of the image
        });
      },
      error: (err) => {
        console.log("Error fetching response", err);
      }
    })
  }

  saveEvent(): void {
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
        // date: new Date(this.editForm.value.date).toISOString().split('T')[0],
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
      this.loadUserEvents();
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
  checkDuplicateVenue() {
    const venueName = this.editForm.get('venueName').value;
    
    this.eventService.checkDuplicateVenue(venueName).subscribe({
      next: (response) => {
        if (response && response.msg) {
          console.log(response.msg);
          if (response.msg === "Venue name not registered yet") {
            this.editForm.get('venueName').setErrors(null);
          } else {
            this.editForm.get('venueName').setErrors({duplicateVenue: true});
          }
        }
      },
      error: (response) => {
        const message = response.error.msg
        console.log(message)
        this.editForm.get('venueName').setErrors({duplicateVenue: true})
      },
    })
  }
}
