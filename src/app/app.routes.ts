import { Routes } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AppComponent } from './app.component';
import { EventCarouselComponent } from './components/event-carousel/event-carousel.component';
import { FooterComponent } from './components/footer/footer.component';
import { EventsListComponent } from './components/events-list/events-list.component';
import { EventSlideComponent } from './components/event-slide/event-slide.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { EventCardHomepageComponent } from './event-card-homepage/event-card-homepage.component';

export const routes: Routes = [
    {
        path: "navbar",
        component: NavbarComponent
    },
    {
        path: "event-carousel",
        component: EventCarouselComponent
    },
    {
        path: "footer",
        component: FooterComponent
    },
    {
        path: "events-list",
        component: EventsListComponent
    },
    {
        path: "event-card-homepage",
        component: EventCardHomepageComponent
    },
    {
        path: "event-slide",
        component: EventSlideComponent
    },
    {
        path: "search-bar",
        component: SearchBarComponent
    },
    { 
        path: '',
        component: AppComponent 
    },
];
