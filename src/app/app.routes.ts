import { Routes } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AppComponent } from './app.component';
import { EventCarouselComponent } from './components/homepage/event-carousel/event-carousel.component';
import { FooterComponent } from './components/footer/footer.component';
import { EventsListComponent } from './components/homepage/events-list/events-list.component';
import { EventSlideComponent } from './components/homepage/event-slide/event-slide.component';
import { SearchBarComponent } from './components/homepage/search-bar/search-bar.component';
import { EventCardHomepageComponent } from './components/homepage/event-card-homepage/event-card-homepage.component';
import { UserLoginComponent } from './components/user-login/user-login.component';
import { UserRegistrationComponent } from './components/user-registration/user-registration.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { UpcomingEventsDatatableComponent } from './components/event-datatable-page/upcoming-events-datatable/upcoming-events-datatable.component';
import { EventSubmissionFormComponent } from './components/event-submission-form/event-submission-form.component';
import { PastEventsDatatableComponent } from './components/event-datatable-page/past-events-datatable/past-events-datatable.component';
import { EventsDatatableComponent } from './components/event-datatable-page/events-datatable/events-datatable.component';
import { EventDatatablePageComponent } from './components/event-datatable-page/event-datatable-page.component';

export const routes: Routes = [
    {
        path: "navbar",
        component: NavbarComponent
    },
    // {
    //     path: "event-carousel",
    //     component: EventCarouselComponent
    // },
    {
        path: "footer",
        component: FooterComponent
    },
    // {
    //     path: "events-list",
    //     component: EventsListComponent
    // },
    // {
    //     path: "event-card-homepage",
    //     component: EventCardHomepageComponent
    // },
    // {
    //     path: "event-slide",
    //     component: EventSlideComponent
    // },
    // {
    //     path: "search-bar",
    //     component: SearchBarComponent
    // },
    {
        path: "login",
        component: UserLoginComponent
    },
    {
        path: "register",
        component: UserRegistrationComponent
    },
    {
        path: "home",
        component: HomepageComponent
    },
    {
        path: 'events',
        component: EventDatatablePageComponent
    },
    {
        path: 'upcoming-events',
        component: UpcomingEventsDatatableComponent
    },
    {
        path: 'past-events',
        component: PastEventsDatatableComponent
    },
    {
        path: 'event-submission-form',
        component: EventSubmissionFormComponent
    },
    { 
        path: '',
        component: AppComponent 
    },
];
