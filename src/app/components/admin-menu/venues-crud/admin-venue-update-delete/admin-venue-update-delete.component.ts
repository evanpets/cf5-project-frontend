import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { RouterLink } from '@angular/router';
import { LoggedInUser, User } from 'src/app/shared/interfaces/user';
import { EventService } from 'src/app/shared/services/event.service';
import { UserService } from 'src/app/shared/services/user.service';
import { Venue } from 'src/app/shared/interfaces/event';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-admin-venue-update-delete',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelect, MatOptionModule],
  templateUrl: './admin-venue-update-delete.component.html',
  styleUrl: './admin-venue-update-delete.component.css'
})
export class AdminVenueUpdateDeleteComponent implements OnInit{
  editForm: FormGroup;
  currentUser: User
  currentVenue: Venue
  selectedFile: File | null = null
  venues: any[] = [];
  currentIndex: number = -1;

  constructor(private eventService: EventService, private userService: UserService, private fb: FormBuilder) {
    this.editForm = this.fb.group({
      name: [''],
      street: [''],
      streetNumber: [''],
      zipCode: [''],
      city: ['']
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
        if (this.venues.length > 0) {
          this.currentIndex = 0;
          this.currentVenue = this.venues[this.currentIndex];
          this.editVenue(this.currentVenue);
        }},
      error: (error) => {
        console.error('Error fetching venues', error);
      }
    });
  }

  editVenue(venue: Venue): void {
    console.log("edit started");
    
    this.eventService.getVenueById(venue.venueId).subscribe({
      next: (response: any) => {
        console.log("Response: "+ response.name);
        console.log("VAddr Id " + response.venueAddress.venueAddressId);
        
        
        this.currentVenue = response;

        this.editForm.patchValue({
          venueId: this.currentVenue.venueId,
          name: this.currentVenue.name,
          venueAddressId: this.currentVenue.venueAddress.venueAddressId,
          street: this.currentVenue.venueAddress.street,
          streetNumber: this.currentVenue.venueAddress.streetNumber,
          zipCode: this.currentVenue.venueAddress.zipCode,
          city: this.currentVenue.venueAddress.city
        });

      },
      error: (err) => {
        console.log("Error fetching response", err);
      }
    });
  }

  saveVenue(): void {
    console.log('Form Submitted');

    if (this.editForm.valid && this.currentVenue) {
      console.log("save beginning",this.currentVenue);
      
      const venueToUpdate: Venue = {
        venueId: this.currentVenue.venueId,
        name: this.editForm.value.name,
        venueAddress: {
          venueAddressId: this.currentVenue.venueAddress.venueAddressId,
          street: this.editForm.value.street,
          streetNumber: this.editForm.value.streetNumber,
          zipCode: this.editForm.value.zipCode,
          city: this.editForm.value.city,
        }
       };

      console.log("Update info: ", venueToUpdate);
      this.eventService.updateVenue(this.currentVenue.venueId, venueToUpdate).subscribe({
        next: (response) => {
          console.log("Response after update: ", response,  response.msg);
          this.loadVenues();
        },
        error: (error) => {
          console.error('Error updating event', error.msg);
        }
      });
    } else {
      console.log("Couldn't save");
      
    }
  }

  deleteVenue(venueId: number): void {
    if (!venueId) {
      console.error('Venue is undefined or null');
      return;
    } 
    this.eventService.deleteVenue(venueId).subscribe(response => {
      this.loadVenues();
    });
  }

  navigateToPreviousVenue() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.editVenue(this.venues[this.currentIndex]);
    }
  }

  navigateToNextVenue() {
    if (this.currentIndex < this.venues.length - 1) {
      this.currentIndex++;
      this.editVenue(this.venues[this.currentIndex]);
    }
  }
}
