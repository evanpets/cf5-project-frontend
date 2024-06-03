import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Event, EventsList } from '../interfaces/event';
import { environment } from 'src/environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

const API_URL = `${environment.apiURL}/api/events`;

@Injectable({
  providedIn: 'root'
})

export class EventService {
  http: HttpClient = inject(HttpClient)
  router: Router = inject(Router)

  // private events: Event[] = EventsList

  // getEvents(): Observable<Event[]> {
  //   return of(this.events);
  // }

  checkDuplicateVenue(venue: string) {
    return this.http.get<{msg: string}> (`${API_URL}/check-duplicate-venue/${venue}`)
   }

   createEvent(event: any): Observable< {msg: string} > {
    return this.http.post<{ msg: string }> ( `${API_URL}/create`, event )
   }

   getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${API_URL}/events`);
  }

  // updateEvent(event: Event) {
  //   return this.http.patch<Event>(`${API_URL}/${event.id}`, event);
  // }

  // deleteEvent(eventId: number) {
  //   return this.http.delete(`${API_URL}/${eventId}`);
  // }
  filterEvents(searchCategory: string): Observable<any[]> {
    return this.http.get<any[]>(`${API_URL}/filter-events?filter=${searchCategory}`);

  }
}