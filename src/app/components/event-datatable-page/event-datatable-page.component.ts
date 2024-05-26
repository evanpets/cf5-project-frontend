import { Component } from '@angular/core';
import { UpcomingEventsDatatableComponent } from './upcoming-events-datatable/upcoming-events-datatable.component';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PastEventsDatatableComponent } from './past-events-datatable/past-events-datatable.component';

@Component({
  selector: 'app-event-datatable-page',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, UpcomingEventsDatatableComponent, PastEventsDatatableComponent, CommonModule],
  templateUrl: './event-datatable-page.component.html',
  styleUrl: './event-datatable-page.component.css'
})
export class EventDatatablePageComponent {
  activeTab: string = 'upcoming';

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }
}
