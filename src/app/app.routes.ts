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


export const routes: Routes = [
    { 
        path: "api/event/create",
        component: EventSubmissionFormComponent,
        canActivate: [authGuard]
    },
    {path: "api",
        children: [
            {path: "user", 
        children: [
            {
                path: "login",
                component: UserLoginComponent
            },
            {
                path: "register",
                component: UserRegistrationComponent
            }
        ]},

    { path: 'event', component: EventDatatablePageComponent,
        children: [
            { path: 'upcoming', component: UpcomingEventsDatatableComponent },
            { path: 'past', component: PastEventsDatatableComponent},
            // { path: 'create', component: EventSubmissionFormComponent, canActivate: [authGuard] }
        ]},

        ]},
    {
        path: "home",
        component: HomepageComponent
    },
    {
        path: 'about-us',
        component: AboutUsComponent,
        // canActivate: [authGuard]
    },
    { path: '', redirectTo: 'home', pathMatch: 'full' }
];
