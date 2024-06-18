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
import { Router, RouterLink } from "@angular/router";
import { EventService } from "src/app/shared/services/event.service";
import { animate, state, style, transition, trigger } from "@angular/animations";
import { UserService } from "src/app/shared/services/user.service";
import { LoggedInUser, User} from "src/app/shared/interfaces/user"


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
  currentUser: User
  selectedFile: File | null = null;

  constructor(private fb: FormBuilder, private eventService: EventService, private userService: UserService, private router: Router) {}

  submissionStatus: {success: boolean, message: string} = 
  {success: false, message: "Not submitted yet." }

  ngOnInit(): void {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', [Validators.maxLength(250)]],
      venue: [''],
      newVenueName: [''],
      newVenueStreet: [''],
      newVenueStreetNo: [''],
      newVenueZipCode: [''],
      newVenueCity: [''],
      price: [null, [Validators.required]],
      date: [null, [Validators.required]],
      category: [null, [Validators.required]],
      performers: this.fb.array([this.createPerformer()]),
    });
    this.loadVenues()
    this.loadCurrentUser()
  }

  loadVenues() {
    this.eventService.getVenues().subscribe({
      next: (venues) => {
        this.venues = venues;
        console.log('Venues loaded:', this.venues);

      },
      error: (error) => {
        console.error('Error fetching venues', error);
      }
    });
  }

  loadCurrentUser() {
    const username = (this.userService.user() as LoggedInUser).username
    console.log(username)
    this.userService.getUser(username).subscribe({
      next: (response) => {
        this.currentUser = response;
        console.log('Current user: ', this.currentUser.userId)
        console.log('Current user:', this.currentUser);
      },
      error: (error) => {
        console.error('Error fetching current user', error);
      }
    });
  }

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
    }
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

      this.form.get('newVenueName').setValidators([Validators.required]);
      this.form.get('newVenueStreet').setValidators([Validators.required]);
      this.form.get('newVenueStreetNo').setValidators([Validators.required]);
      this.form.get('newVenueZipCode').setValidators([Validators.required, Validators.minLength(5), Validators.maxLength(5)]);
      this.form.get('newVenueCity').setValidators([Validators.required]);

    }
    else {
      this.form.get('venue').setValidators([Validators.required]);
      this.form.get('venue').updateValueAndValidity();

      this.form.get('newVenueName').clearValidators();
      this.form.get('newVenueStreet').clearValidators();
      this.form.get('newVenueStreetNo').clearValidators();
      this.form.get('newVenueZipCode').clearValidators();
      this.form.get('newVenueCity').clearValidators();

    }
  }

  checkDuplicateVenue() {
    const venueName = this.form.get('newVenueName').value;
    
    this.eventService.checkDuplicateVenue(venueName).subscribe({
      next: (response) => {
        if (response && response.msg) {
          console.log(response.msg);
          if (response.msg === "Venue name not registered yet") {
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
            zipCode: formValue.newVenueZipCode,
            city: formValue.newVenueCity
          }
        } : null,
        price: formValue.price,
        date: formValue.date.toISOString().split('T')[0],
        category: formValue.category,
        performerIds: [], 
        newPerformers: formValue.performers.map(p => ({ name: p.name })),
        userId: this.currentUser.userId
      };
      console.log('Event to create:', eventToCreate);

      const formData = new FormData();
      formData.append('eventEntity', JSON.stringify(eventToCreate));
      if (this.selectedFile) {
        if (this.selectedFile.size > 5 * 1024 * 1024) { // 5 MB size limit
          alert("File size should be less than 5 MB.");
          return;
        }
        formData.append('eventImage', this.selectedFile, this.selectedFile.name);
        console.log("File appended to FormData");
      }

      console.log("FormData content:", formData);
      
      this.eventService.createEvent(formData).subscribe ({
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

  reloadCurrentRoute() {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }
}
