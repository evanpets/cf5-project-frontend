import { Routes } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AppComponent } from './app.component';
import { EventCarouselComponent } from './components/event-carousel/event-carousel.component';
import { FooterComponent } from './components/footer/footer.component';
import { EventsListComponent } from './components/events-list/events-list.component';
import { EventCardComponent } from './components/event-card/event-card.component';

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
        path: "event-card",
        component: EventCardComponent
    },
    { 
        path: '',
        component: AppComponent 
    },
];
