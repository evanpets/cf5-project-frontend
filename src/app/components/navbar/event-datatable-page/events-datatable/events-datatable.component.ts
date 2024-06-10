import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import sortBy from 'lodash-es/sortBy';
import { BackendEvent, Event } from 'src/app/shared/interfaces/event';

@Component({
  selector: 'app-events-datatable',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './events-datatable.component.html',
  styleUrl: './events-datatable.component.css'
})
export class EventsDatatableComponent {
  @Input() data: Event[];
  @Input() actionsTemplate?: TemplateRef<any>;
  @Output() eventClicked = new EventEmitter<Event>()
  event: any;


  sortOrder = {
    title: 'none',
    date: 'none',
    venue: 'none',
    performers: 'none',
    price: 'none',
  };

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('el-GR');
  }
  
  // formatDate(dateString: Date): string {
  //   const date = new Date(dateString);
  //   return date.toLocaleDateString('el-GR', {
  //     year: 'numeric',
  //     month: 'numeric',
  //     day: 'numeric',
  //   });
  // }

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
