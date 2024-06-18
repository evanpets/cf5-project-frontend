import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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
  @Output() searchCategoryChange = new EventEmitter<string>();
  @Output() searchQueryChange = new EventEmitter<string>();
  // @Output() searchOptionSelected = new EventEmitter<any>();


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

  constructor (private eventService: EventService) {}

  ngOnInit() {
    this.searchCategory = this.searchOptions[0].value;
    this.searchCategoryChange.emit(this.searchCategory);

    this.searchQueryChange.emit(this.searchCategory);
    this.filterEvents();

  }

  filterEvents() {
    // this.searchCategoryChange.emit(this.searchCategory);
    // if (!this.searchCategory) {return;}

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

  onQueryChange(query: string) {
    this.searchQuery = query;
    this.searchQueryChange.emit(this.searchQuery);
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

  onSearchCategoryChange(category: string) {
    this.searchCategory = category;
    this.searchCategoryChange.emit(this.searchCategory);
    this.filterEvents();
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
