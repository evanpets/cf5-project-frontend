import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { Router, RouterLink } from '@angular/router';
import { LoggedInUser, User } from 'src/app/shared/interfaces/user';
import { EventService } from 'src/app/shared/services/event.service';
import { UserService } from 'src/app/shared/services/user.service';
import { Venue } from 'src/app/shared/interfaces/event';
import { CommonModule } from '@angular/common';
import { DialogRef, DIALOG_DATA, Dialog } from '@angular/cdk/dialog';


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

  constructor(private eventService: EventService, private userService: UserService, private fb: FormBuilder, public dialog: Dialog) {
    this.editForm = this.fb.group({
      venueId: [''],
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
    
    this.eventService.getVenueById(venue.venueId).subscribe({
      next: (response: any) => {
        
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

    if (this.editForm.valid && this.currentVenue) {
      
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

      this.eventService.updateVenue(this.currentVenue.venueId, venueToUpdate).subscribe({
        next: (response) => {
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

  openConfirmDeleteDialog(venue: Venue) {
    this.dialog.open(VenueConfirmDeleteDialogComponent, {
      data: venue
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
@Component({
  selector: 'app-venue-confirm-delete',
  template: `
    <div>
      <h4>Are you sure you want to delete this venue?</h4>
      <p class="text-center">{{ venue.name }}</p>
      <div class="d-flex justify-content-around">
        <button class="btn btn-primary" mat-button (click)="confirmDelete(venue.venueId)">Confirm</button>
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
export class VenueConfirmDeleteDialogComponent {

  constructor(private dialogRef: DialogRef, private router: Router, private eventService: EventService, @Inject(DIALOG_DATA) public venue: any) {}

  confirmDelete(venueId: number) {
    if (!venueId) {
      console.error('Venue is undefined or null');
      return;
    } 
    this.eventService.deleteVenue(venueId).subscribe({
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
