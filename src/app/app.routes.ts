import { Routes } from "@angular/router";
import { UserLoginComponent } from "./components/auth/user-login/user-login.component";
import { UserRegistrationComponent } from "./components/auth/user-registration/user-registration.component";
import { HomepageComponent } from "./components/homepage/homepage.component";
import { EventDatatablePageComponent } from "./components/navbar/event-datatable-page/event-datatable-page.component";
import { PastEventsDatatableComponent } from "./components/navbar/event-datatable-page/past-events-datatable/past-events-datatable.component";
import { UpcomingEventsDatatableComponent } from "./components/navbar/event-datatable-page/upcoming-events-datatable/upcoming-events-datatable.component";
import { AboutUsComponent } from "./components/navbar/about-us/about-us.component";
import { authGuard } from "./shared/guards/auth.guard";
import { EventSubmissionFormComponent } from "./components/navbar/event-submission-form/event-submission-form.component";
import { MyEventsComponent } from "./components/navbar/user-side-menu/my-events/my-events.component";
import { EditProfileComponent } from "./components/navbar/user-side-menu/edit-profile/edit-profile.component";
import { UserSideMenuComponent } from "./components/navbar/user-side-menu/user-side-menu.component";
import { EventDetailsComponent } from "./components/event-details/event-details.component";
import { ContactUsComponent } from "./components/footer/contact-us/contact-us.component";
import { TermsAndConditionsComponent } from "./components/footer/terms-and-conditions/terms-and-conditions.component";
import { FaqComponent } from "./components/footer/faq/faq.component";
import { AdminMenuComponent } from "./components/admin-menu/admin-menu.component";
import { EventsCrudComponent } from "./components/admin-menu/events-crud/events-crud.component";
import { VenuesCrudComponent } from "./components/admin-menu/venues-crud/venues-crud.component";
import { UsersCrudComponent } from "./components/admin-menu/users-crud/users-crud.component";
import { AdminInsertUserComponent } from "./components/admin-menu/users-crud/admin-insert-user/admin-insert-user.component";
import { AdminUserUpdateDeleteComponent } from "./components/admin-menu/users-crud/admin-user-update-delete/admin-user-update-delete.component";
import { AdminGetUserComponent } from "./components/admin-menu/users-crud/admin-get-user/admin-get-user.component";
import { AdminInsertEventComponent } from "./components/admin-menu/events-crud/admin-insert-event/admin-insert-event.component";
import { AdminGetEventComponent } from "./components/admin-menu/events-crud/admin-get-event/admin-get-event.component";
import { AdminEventUpdateDeleteComponent } from "./components/admin-menu/events-crud/admin-event-update-delete/admin-event-update-delete.component";
import { AdminGetVenueComponent } from "./components/admin-menu/venues-crud/admin-get-venue/admin-get-venue.component";
import { AdminInsertVenueComponent } from "./components/admin-menu/venues-crud/admin-insert-venue/admin-insert-venue.component";
import { AdminVenueUpdateDeleteComponent } from "./components/admin-menu/venues-crud/admin-venue-update-delete/admin-venue-update-delete.component";

import { adminGuard } from "./shared/guards/admin.guard";
import { SavedEventsComponent } from "./components/navbar/user-side-menu/saved-events/saved-events.component";
import { MusicComponent } from "./components/navbar/category-lists/music/music.component";
import { CinemaComponent } from "./components/navbar/category-lists/cinema/cinema.component";
import { TheaterComponent } from "./components/navbar/category-lists/theater/theater.component";


export const routes: Routes = [
    { 
        path: "api/events/new-event",
        component: EventSubmissionFormComponent,
        canActivate: [authGuard]
    },
    {path: "api",
        children: [
            {
                path: "users",
        children: [
            {
                path: "login",
                component: UserLoginComponent
            },
            {
                path: "register",
                component: UserRegistrationComponent
            },
        ],
    },

    { path: 'events', component: EventDatatablePageComponent,
        children: [
            { path: 'upcoming', component: UpcomingEventsDatatableComponent },
            { path: 'past', component: PastEventsDatatableComponent},
        ]},

    ]},
    {
        path: "api/events/music",
        component: MusicComponent
    },
    {
        path: "api/events/cinema",
        component: CinemaComponent
    },
    {
        path: "api/events/theater",
        component: TheaterComponent
    },
    {
        path: "home",
        component: HomepageComponent
    },
    {
        path: 'about-us',
        component: AboutUsComponent,
    },
    {
        path: "api/user",
        component: UserSideMenuComponent,
        children:
        [
            {
                path: "user-details",
                component: EditProfileComponent,
                canActivate: [authGuard]
            },
            {
                path: "events",
                children: [
                    {
                        path: "submitted",
                        component: MyEventsComponent,
                        canActivate: [authGuard]
                    },
                    {
                        path: "saved",
                        component: SavedEventsComponent,
                        canActivate: [authGuard]
                    }
                ]
            }
        ]
    },
    {
        path: "api/events/:eventId",
        component: EventDetailsComponent
    },

    {
        path: "contact",
        component: ContactUsComponent
    },
    {
        path: "terms",
        component: TermsAndConditionsComponent
    },
    {
        path: "faq",
        component: FaqComponent
    },
    {
        path: "api/admin",
        component: AdminMenuComponent,
        canActivate: [adminGuard]
    },
    {
        path: "api/admin/users", component: UsersCrudComponent,
        canActivate: [adminGuard]
    },
    {
        path: "api/admin/users/insert", component: AdminInsertUserComponent,
        canActivate: [adminGuard]
    },
    {
        path: "api/admin/users/update", component: AdminUserUpdateDeleteComponent,
        canActivate: [adminGuard]
    },
    {
        path: "api/admin/users/get", component: AdminGetUserComponent,
        canActivate: [adminGuard]
    },

    {
        path: "api/admin/events", component: EventsCrudComponent,
        canActivate: [adminGuard]
    },
    {
        path: "api/admin/events/insert", component: AdminInsertEventComponent,
        canActivate: [adminGuard]
    },
    {
        path: "api/admin/events/update", component: AdminEventUpdateDeleteComponent,
        canActivate: [adminGuard]
    },
    {
        path: "api/admin/events/get", component: AdminGetEventComponent,
        canActivate: [adminGuard]
    },
    {
        path: "api/admin/venues",
        component: VenuesCrudComponent,
        canActivate: [adminGuard]
    },
    {
        path: "api/admin/venues/insert", component: AdminInsertVenueComponent,
        canActivate: [adminGuard]
    },
    {
        path: "api/admin/venues/update", component: AdminVenueUpdateDeleteComponent,
        canActivate: [adminGuard]
    },
    {
        path: "api/admin/venues/get", component: AdminGetVenueComponent,
        canActivate: [adminGuard]
    },
    { path: '', redirectTo: 'home', pathMatch: 'full' }
];
