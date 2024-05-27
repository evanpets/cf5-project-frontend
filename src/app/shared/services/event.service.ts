import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Event, EventsList } from '../interfaces/event';
import { environment } from 'src/environments/environment';
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
    return this.http.get<{msg: string}> (`${API_URL}/check_duplicate_venue/${venue}`)
   }

   createEvent(event: Event) {
    return this.http.post<{ msg: string }> ( `${API_URL}/create`, event )
   }

  //  getEvents() {
  //   return this.http.get<Event[]>(this.apiUrl);
  // }

  // createEvent(event: Event) {
  //   return this.http.post<Event>(this.apiUrl, event);
  // }

  // updateEvent(event: Event) {
  //   return this.http.put<Event>(`${this.apiUrl}/${event.id}`, event);
  // }

  // deleteEvent(eventId: number) {
  //   return this.http.delete(`${this.apiUrl}/${eventId}`);
  // }
}