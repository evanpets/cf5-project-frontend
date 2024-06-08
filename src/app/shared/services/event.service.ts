import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BackendEvent, Event } from '../interfaces/event';
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

  //Insert functions
  /**
   * Inserts an event into the database.
   * @param event The event details as input from a user.
   * @returns A message confirming the result of the insertion attempt.
   */
  createEvent(event: any): Observable< {msg: string} > {
    console.log("Service:" + JSON.stringify(event))
    return this.http.post<{ msg: string }> ( `${API_URL}/create`, event )
  }

  //Get functions
   /**
    * Fetches a list of all the events.
    * @returns A list of all the events.
    */
   getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${API_URL}`);
  }

  /**
   * Fetches a list of all upcoming events (current or future date).
   * @returns A list of all the future events.
   */
  getUpcomingEvents(): Observable<Event[]> {
    console.log("Upcoming events")
    return this.http.get<Event[]>(`${API_URL}/upcoming`);
  }

  /**
   * Fetches a list of all past events (date before current one).
   * @returns A list of all the past events.
   */
  getPastEvents(): Observable<Event[]> {
    console.log("Past events")
    return this.http.get<Event[]>(`${API_URL}/past`);
  }

  /**
   * Fetches a list of all the events inserted by the active user.
   * @param userId The ID of the user.
   * @returns A list of events the user specified has inserted.
   */
  getUserEvents(userId: number): Observable<BackendEvent[]> {
    return this.http.get<BackendEvent[]>(`${API_URL}/user/${userId}`);
  }

  /**
   * Fetches a list of all the inserted venues.
   * @returns A list of all the venues.
   */
  getVenues(): Observable<any> {
    return this.http.get(`${API_URL}/venues`);
  }

  /**
   * Fetches a list of information whose category is specified by the user.
   * @param searchCategory The category by which to fetch results (event, venue, performer, date)
   * @returns The list of items corresponding to the category.
   */
  filterEvents(searchCategory: string): Observable<any[]> {
    return this.http.get<any[]>(`${API_URL}/filter-events?filter=${searchCategory}`);
  }

  /**
   * Examines whether a newly input venue name already exists.
   * @param venueName The input venue name.
   * @returns A message confirming or denying availability of the name.
   */
  checkDuplicateVenue(venueName: string) : Observable<{msg: string}> {
    return this.http.get<{msg: string}> (`${API_URL}/check-duplicate-venue`, { params: {venueName} })
  }

  //Update functions
  /**
   * Updates an event.
   * @param eventId The ID of the event to update.
   * @param event The event details as updated by the user.
   * @returns A message of the result, the updated event.
   */
  updateEvent(eventId: number, event: Event): Observable<{ msg: string, event: Event }> {
    return this.http.patch<{ msg: string, event: Event }>(`${API_URL}/update/${eventId}`, event);
  }

  //Delete functions
  /**
   * Deletes an event.
   * @param eventId The ID of the event to be deleted.
   * @returns A message confirming the result of the deletion attempt.
   */
  deleteEvent(eventId: number): Observable<{ msg: string }> {
    return this.http.delete<{ msg: string }>(`${API_URL}/delete/${eventId}`);
  }


}