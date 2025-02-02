import { Component } from '@angular/core';
import { UpcomingEventsDatatableComponent } from './upcoming-events-datatable/upcoming-events-datatable.component';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet, UrlSegment } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PastEventsDatatableComponent } from './past-events-datatable/past-events-datatable.component';
import { filter } from 'rxjs';

@Component({
  selector: 'app-event-datatable-page',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, UpcomingEventsDatatableComponent, PastEventsDatatableComponent, CommonModule, RouterOutlet],
  templateUrl: './event-datatable-page.component.html',
  styleUrl: './event-datatable-page.component.css'
})
export class EventDatatablePageComponent {
  activeTab: string;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const activeChild = this.route.snapshot.firstChild?.url[0]?.path;
      this.activeTab = activeChild === 'past' ? 'past' : 'upcoming';
    });

    const initialActiveChild = this.route.snapshot.firstChild?.url[0]?.path;
    this.activeTab = initialActiveChild === 'past' ? 'past' : 'upcoming';
  }
  
  setActiveTab(tab: string) {
    this.activeTab = tab;
    this.router.navigate([`api/events/${tab}`])
  }
  
}
