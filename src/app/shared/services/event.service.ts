import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Event, EventsList } from '../interfaces/event';


@Injectable({
  providedIn: 'root'
})
export class EventService {
//   private events: Event[] = [
//     // Your event data
//   ];
    private events: Event[] = EventsList
    // = [
    //         // Your event data
    // ];

  getEvents(): Observable<Event[]> {
    return of(this.events);
  }
}