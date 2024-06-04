import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import sortBy from 'lodash-es/sortBy';
import { Event } from 'src/app/shared/interfaces/event';

@Component({
  selector: 'app-events-datatable',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './events-datatable.component.html',
  styleUrl: './events-datatable.component.css'
})
export class EventsDatatableComponent {
  @Input() data: Event[];
  @Output() eventClicked = new EventEmitter<Event>()

  sortOrder = {
    title: 'none',
    date: 'none',
    venue: 'none',
    performers: 'none',
    price: 'none',
  };

  sortData(sortKey: string) {
    if (this.sortOrder[sortKey] === 'asc') {
      this.sortOrder[sortKey] = 'desc';
      this.data = sortBy(this.data, sortKey).reverse();
    } else {
      this.sortOrder[sortKey] = 'asc';
      this.data = sortBy(this.data, sortKey);
    }

    for (let key in this.sortOrder) {
      if (key !== sortKey) {
        this.sortOrder[key] = 'none';
      }
    }
  }

  sortSign(sortKey: string) {
    if (this.sortOrder[sortKey] === 'asc') {
      return '↑';
    } else if (this.sortOrder[sortKey] === 'desc') {
      return '↓';
    } else {
      return '';
    }
  }

  onEventClicked(event: Event) {
    this.eventClicked.emit(event);
  }
}
