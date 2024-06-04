import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatOptionModule, MatNativeDateModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { RouterLink } from "@angular/router";
import { EventService } from "src/app/shared/services/event.service";
import { animate, state, style, transition, trigger } from "@angular/animations";


@Component({
  selector: 'app-event-submission-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatOptionModule, MatIconModule, MatNativeDateModule, MatDatepickerModule, MatCheckboxModule, MatSelectModule],
  templateUrl: './event-submission-form.component.html',
  styleUrl: './event-submission-form.component.css',
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

export class EventSubmissionFormComponent implements OnInit{
  form: FormGroup;
  showNewVenueFields = false;
  newVenueNameInput = ''
  venues = []; 

  constructor(private fb: FormBuilder, private eventService: EventService) {}

  submissionStatus: {success: boolean, message: string} = 
  {success: false, message: "Something went wrong." }

  ngOnInit(): void {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      description: ['', [Validators.maxLength(250)]],
      venue: [''],
      newVenueName: [''],
      newVenueStreet: [''],
      newVenueStreetNo: [''],
      newVenueZipCode: [''],
      price: [null, [Validators.required]],
      date: [null, [Validators.required]],
      category: [null, [Validators.required]],
      performers: this.fb.array([this.createPerformer()])
    });
    this.loadVenues();
  }

  loadVenues() {
    this.eventService.getVenues().subscribe({
      next: (venues) => {
        this.venues = venues;
        console.log('Venues loaded:', this.venues);  // Debug log to check if venues are loaded

      },
      error: (error) => {
        console.error('Error fetching venues', error);
      }
    });
  }

  get performers() {
    return this.form.get('performers') as FormArray;
  }

  createPerformer(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(1)], ]
    });
  }  

  addPerformer() {
    this.performers.push(this.createPerformer());
  }

  removePerformer(index: number) {
    this.performers.removeAt(index);
  }

  toggleNewVenue() {
    this.showNewVenueFields = !this.showNewVenueFields;
    if (this.showNewVenueFields) {
      this.form.get('venue').clearValidators()
      this.form.get('venue').updateValueAndValidity()

      this.form.get('newVenueName').setValidators([Validators.required, Validators.minLength(3)]);
      this.form.get('newVenueStreet').setValidators([Validators.required, Validators.minLength(3)]);
      this.form.get('newVenueStreetNo').setValidators([Validators.required, Validators.minLength(1)]);
      this.form.get('newVenueZipCode').setValidators([Validators.required, Validators.minLength(5), Validators.maxLength(5)]);
    }
    else {
      this.form.get('venue').setValidators([Validators.required]);
      this.form.get('venue').updateValueAndValidity();

      this.form.get('newVenueName').clearValidators();
      this.form.get('newVenueStreet').clearValidators();
      this.form.get('newVenueStreetNo').clearValidators();
      this.form.get('newVenueZipCode').clearValidators();
    }
  }

  checkDuplicateVenue() {
    const venueName = this.form.get('newVenueName').value;
    
    this.eventService.checkDuplicateVenue(venueName).subscribe({
      next: (response) => {
        if (response && response.msg) {
          console.log(response.msg);
          if (response.msg === "Venue name available") {
            this.form.get('newVenueName').setErrors(null);
          } else {
            this.form.get('newVenueName').setErrors({duplicateVenue: true});
          }
        }
      },
      error: (response) => {
        const message = response.error.msg
        console.log(message)
        this.form.get('newVenueName').setErrors({duplicateVenue: true})
      },
    })
  }

  onSubmit () {
    if (this.form.valid) {
      // const eventToCreate = this.form.value as unknown as Event
      const formValue = this.form.value;

      const eventToCreate: any = {
        title: formValue.title,
        description: formValue.description,
        venueId: this.showNewVenueFields ? null : formValue.venue,
        newVenue: this.showNewVenueFields ? {
          name: formValue.newVenueName,
          venueAddress: {
            street: formValue.newVenueStreet,
            streetNumber: formValue.newVenueStreetNo,
            zipCode: formValue.newVenueZipCode
          }
        } : null,
        price: formValue.price,
        date: formValue.date.toISOString().split('T')[0],
        // date: formValue.date,
        category: formValue.category,
        performerIds: [], 
        newPerformers: formValue.performers.map(p => ({ name: p.name }))
      };
      console.log(eventToCreate)
      
      this.eventService.createEvent(eventToCreate).subscribe ({
        next: (response) => {
          console.log("response" + response.msg)
          console.log("Event created", response.msg)
          this.submissionStatus = {success: true, message: response.msg}
        }, 
        error: (response) => {
          const message = response.error.msg
          console.log("Error registering event", message)
          this.submissionStatus = {success: false, message}

        }
      })
    }
  }
}
