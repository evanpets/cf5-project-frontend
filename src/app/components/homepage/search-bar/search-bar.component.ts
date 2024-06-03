import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { EventService } from 'src/app/shared/services/event.service';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, MatInputModule, MatOptionModule, MatSelectModule, MatAutocompleteModule, FormsModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css'
})
export class SearchBarComponent implements OnInit{
  constructor (private eventService: EventService) {}

  sourcedResults: any[] = []
  filterableOptions: any[] = []

  searchCategory: string;
  searchQuery: string = ''
  searchOptions = [
    { value: 'event', viewValue: 'Event' },
    { value: 'venue', viewValue: 'Venue' },
    { value: 'performer', viewValue: 'Performer' },
    { value: 'date', viewValue: 'Date' }
  ];

  ngOnInit() {
    this.searchCategory = this.searchOptions[0].value;
    this.filterEvents();
  }

  filterEvents() {
    if (!this.searchCategory) {return;}

    this.eventService.filterEvents(this.searchCategory).subscribe({
      next: (response: any[]) => {
        this.sourcedResults = response
        this.filterableOptions = []
      },
      error: (err) => {
        console.error("Error fetching filtered data", err)
      }
    })
  }

  onSearchChange(query: string) {
    this.searchQuery = query;
    if (query.length >= 2) {
      console.log(query.toString())
      console.log(this.filterableOptions)
      
      this.filterableOptions = this.sourcedResults.filter(option =>
        this.getDisplayValue(option).toLowerCase().includes(query.toLowerCase())
      )
      console.log(this.filterableOptions)
    } else {
      this.filterableOptions = []
    }
  }

  getDisplayValue(option: any): string {
    switch (this.searchCategory){
      case 'venue':
      return option.name;
      
      case 'performer':
      return option.name;

      case 'date':
      return new Date(option).toLocaleDateString()

      default:
      return option.title
    }
  }
  
}
