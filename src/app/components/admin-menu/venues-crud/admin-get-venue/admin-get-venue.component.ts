import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { Venue } from 'src/app/shared/interfaces/event';
import { EventService } from 'src/app/shared/services/event.service';

@Component({
  selector: 'app-admin-get-venue',
  standalone: true,
  imports: [CommonModule, MatInputModule, FormsModule, RouterLink],
  templateUrl: './admin-get-venue.component.html',
  styleUrl: './admin-get-venue.component.css'
})
export class AdminGetVenueComponent {
  venue: Venue;
  hasResult: boolean = false;
  searchQuery: string = "";


  constructor(private eventService: EventService) {}

  searchByVenueName(): void {
    if (this.searchQuery) {
      this.getVenueByName(this.searchQuery);
    }
  }

  getVenueByName(venueName: string): void {
    this.eventService.getVenueByName(venueName).subscribe({
      next: (response: Venue) => {
        console.log(response);
        this.venue = response
        this.hasResult = true;
      },
      error: (err) => {
        console.log(err);
        this.venue = null
        this.hasResult = true;
      }

    });
  }
}