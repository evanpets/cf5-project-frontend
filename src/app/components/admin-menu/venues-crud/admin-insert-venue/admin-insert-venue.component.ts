import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { Venue } from 'src/app/shared/interfaces/event';
import { EventService } from 'src/app/shared/services/event.service';

@Component({
  selector: 'app-admin-insert-venue',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, MatFormFieldModule, MatButtonModule, MatInputModule],
  templateUrl: './admin-insert-venue.component.html',
  styleUrl: './admin-insert-venue.component.css'
})
export class AdminInsertVenueComponent implements OnInit{
  form: FormGroup;
  insertionSuccess: boolean = false;
  
  constructor(private eventService: EventService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      street: ['', [Validators.required]],
      streetNumber: ['', [Validators.required]],
      zipCode: ['', [Validators.required]],
      city: ['', [Validators.required]]
    });
  }

  checkDuplicateVenue() {
    const venueName = this.form.get('name').value;
    
    this.eventService.checkDuplicateVenue(venueName).subscribe({
      next: (response) => {
        if (response && response.msg) {
          console.log(response.msg);
          if (response.msg === "Venue name not registered yet") {
            this.form.get('name').setErrors(null);
          } else {
            this.form.get('name').setErrors({duplicateVenue: true});
          }
        }
      },
      error: (response) => {
        const message = response.error.msg
        console.log(message)
        this.form.get('name').setErrors({duplicateVenue: true})
      },
    })
  }

  onSubmit () {
    if (this.form.valid) {
      const formValue = this.form.value;

      const venueToCreate: any = {
          name: formValue.name,
          venueAddress: {
            street: formValue.street,
            streetNumber: formValue.streetNumber,
            zipCode: formValue.zipCode,
            city: formValue.city
          }
      }
        
    this.eventService.insertVenue(venueToCreate).subscribe ({
      next: (response) => {
        console.log("Venue inserted", response.msg)
        this.insertionSuccess = true;
      }, 
      error: (response) => {
        const message = response.error.msg
        console.log("Error inserting venue", message)
      }
    })
    }
  }
}
