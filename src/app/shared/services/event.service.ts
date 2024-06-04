import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Event } from '../interfaces/event';
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

  checkDuplicateVenue(venueName: string) : Observable<{msg: string}> {
    return this.http.get<{msg: string}> (`${API_URL}/check-duplicate-venue`, { params: {venueName} })
   }

   createEvent(event: any): Observable< {msg: string} > {
    console.log("Service:" + JSON.stringify(event))
    return this.http.post<{ msg: string }> ( `${API_URL}/create`, event )
   }

   
   getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${API_URL}`);
  }

  getUpcomingEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${API_URL}/upcoming`);
  }

  getPastEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${API_URL}/past`);
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

  getVenues(): Observable<any> {
    return this.http.get(`${API_URL}/venues`);
  }
}