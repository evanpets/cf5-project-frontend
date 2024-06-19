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
import { LikedEventsComponent } from "./components/navbar/user-side-menu/bookmarked-events/bookmarked-events.component";
import { EditProfileComponent } from "./components/navbar/user-side-menu/edit-profile/edit-profile.component";
import { UserSideMenuComponent } from "./components/navbar/user-side-menu/user-side-menu.component";
import { EventDetailsComponent } from "./components/event-details/event-details.component";
import { ContactUsComponent } from "./components/footer/contact-us/contact-us.component";
import { TermsAndConditionsComponent } from "./components/footer/terms-and-conditions/terms-and-conditions.component";
import { FaqComponent } from "./components/footer/faq/faq.component";


export const routes: Routes = [
    { 
        path: "api/events/create",
        component: EventSubmissionFormComponent,
        canActivate: [authGuard]
    },
    {path: "api",
        children: [
            {
                path: "user",
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
                        component: LikedEventsComponent,
                        canActivate: [authGuard]
                    }
                ]
            }
        ]
    },
    {
        path: "api/events/:eventId",
        component: EventDetailsComponent,
        
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
    { path: '', redirectTo: 'home', pathMatch: 'full' }
];
