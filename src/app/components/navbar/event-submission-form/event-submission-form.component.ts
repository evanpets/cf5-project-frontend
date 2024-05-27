import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { EventService } from 'src/app/shared/services/event.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Event, Performer } from 'src/app/shared/interfaces/event';

@Component({
  selector: 'app-event-submission-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatOptionModule, MatIconModule, MatNativeDateModule, MatDatepickerModule, MatCheckboxModule, MatSelectModule],
  templateUrl: './event-submission-form.component.html',
  styleUrl: './event-submission-form.component.css'
})

export class EventSubmissionFormComponent implements OnInit {
  form: FormGroup;

  constructor(private fb: FormBuilder, private eventService: EventService) {}

  submissionStatus: {success: boolean, message: string} = 
  {success: false, message: "Event submission was not successful." }

  ngOnInit(): void {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required]],
      venue: ['', [Validators.required, Validators.minLength(3)]],
      newVenueName: ['', [Validators.required, Validators.minLength(3)]],
      newVenueStreet: ['', [Validators.required, Validators.minLength(3)]],
      newVenueStreetNo: ['', [Validators.required, Validators.minLength(1)]],
      newVenueZipCode: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(5)]],
      price: ['', [Validators.required]],
      date: ['', [Validators.required]],
      category: ['', [Validators.required]],
      performers: this.fb.array([this.createPerformer()])
    });
  }

  get performers() {
    return this.form.get('performers') as FormArray;
  }

  createPerformer(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(1)]]
    });
  }  

  addPerformer() {
    this.performers.push(this.createPerformer());
  }

  removePerformer(index: number) {
    this.performers.removeAt(index);
  }

  showNewVenueFields = false;

  toggleNewVenue() {
    this.showNewVenueFields = !this.showNewVenueFields;
    //   this.form.controls['newVenueName'].reset();
    //   this.form.controls['newVenueStreet'].reset();
    //   this.form.controls['newVenueStreetNo'].reset();
    //   this.form.controls['newVenueZipCode'].reset();
  }

  // addPerformer() {
  //   this.performers.push('');
  // }

  // removePerformer(index: number) {
  //   this.performers.splice(index, 1);
  // }

  checkDuplicateVenue() {
    const venue = this.form.get('venue').value
    
    this.eventService.checkDuplicateVenue(venue).subscribe({
      next: (response) => {
        console.log(response.msg)
        this.form.get('venue').setErrors(null)
      },
      error: (response) => {
        const message = response.error.msg
        console.log(message)
        this.form.get('venue').setErrors({duplicateVenue: true})
      },
    })
  }

  onSubmit () {
    if (this.form.valid) {
      const event = this.form.value as unknown as Event

      this.eventService.createEvent(event).subscribe ({
        next: (response) => {
          console.log("Event created", response.msg)
          this.submissionStatus = {success: true, message: response.msg}

        }, 
        error: (response) => {
          const message = response.error.msg
          console.log("Error registering user", message)
          this.submissionStatus = {success: false, message}

        }
      })
    }
  }
}
