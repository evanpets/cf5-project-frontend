import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Event, BackendEvent } from 'src/app/shared/interfaces/event';
import { EventService } from 'src/app/shared/services/event.service';
import { EventsDatatableComponent } from '../../event-datatable-page/events-datatable/events-datatable.component';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-my-events',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, EventsDatatableComponent],
  templateUrl: './my-events.component.html',
  styleUrl: './my-events.component.css'
})

export class MyEventsComponent implements OnInit{
  myEvents: Event[] = [];
  editForm: FormGroup;
  isEditing: boolean = false;
  currentEvent: Event | null = null;

  constructor(private eventService: EventService, private userService: UserService, private fb: FormBuilder) {
    this.editForm = this.fb.group({
      title: ['', Validators.required],
      venueName: ['', Validators.required],
      description: ['', Validators.required],
      date: ['', Validators.required],
      performers:['', Validators.required],
      price: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadUserEvents();
  }

  loadUserEvents(): void {
    let userId = 1;
    this.eventService.getUserEvents(userId).subscribe((response: BackendEvent[]) => {
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
            street: '', 
            streetNumber: '',
            zipCode: '' 
          }
        },
        performers: event.performers,
        price: event.price
      }));
      console.log(this.myEvents);
      for (let event of this.myEvents) {
        console.log(JSON.stringify(event));
      }
    });
  }
  
  

  editEvent(event: Event): void {
    this.currentEvent = event;
    this.isEditing = true;
    this.editForm.patchValue(event);
  }

  saveEvent(): void {
    if (this.editForm.valid && this.currentEvent) {
      const updatedEvent = { ...this.currentEvent, ...this.editForm.value };
      this.eventService.updateEvent(updatedEvent.id, updatedEvent).subscribe(response => {
        this.loadUserEvents();
        this.isEditing = false;
        this.currentEvent = null;
      });
    }
  }

  deleteEvent(eventId: number): void {
    this.eventService.deleteEvent(eventId).subscribe(response => {
      this.loadUserEvents();
    });
  }
}
