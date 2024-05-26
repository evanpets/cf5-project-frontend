import { Component } from '@angular/core';
import { EventCarouselComponent } from './event-carousel/event-carousel.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { EventsListComponent } from './events-list/events-list.component';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [EventCarouselComponent, SearchBarComponent, EventsListComponent],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent {

}
