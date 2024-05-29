import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Event, EventsList } from '../interfaces/event';
import { environment } from 'src/environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

const API_URL = `${environment.apiURL}/event`;

@Injectable({
  providedIn: 'root'
})

export class EventService {
  http: HttpClient = inject(HttpClient)
  router: Router = inject(Router)


  private events: Event[] = EventsList


  getEvents(): Observable<Event[]> {
    return of(this.events);
  }

  checkDuplicateVenue(venue: string) {
    return this.http.get<{msg: string}> (`${API_URL}/checkDuplicateVenue/${venue}`)
   }

   createEvent(event: Event) {
    return this.http.post<{ msg: string }> ( `${API_URL}/create`, event )
   }

  //  getEvents(events: Event[]) {
  //   return this.http.get<Event[]>(`${API_URL}/get`, events);
  // }

  // updateEvent(event: Event) {
  //   return this.http.patch<Event>(`${API_URL}/${event.id}`, event);
  // }

  // deleteEvent(eventId: number) {
  //   return this.http.delete(`${API_URL}/${eventId}`);
  // }
}