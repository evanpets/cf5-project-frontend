import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BackendEvent, Event, Venue } from '../interfaces/event';
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
  // createEvent(event: any): Observable< {msg: string} > {
  //   // console.log("Service:" + JSON.stringify(event))
  //   return this.http.post<{ msg: string }> ( `${API_URL}/create`, event )
  // }

  createEvent(formData: FormData): Observable<Event> {
    console.log("service");
    console.log("Service data: " + formData);
    
    return this.http.post<Event>(`${API_URL}/new`, formData);
  }

  insertVenue(venue: Venue): Observable<{ msg: string }> {
    console.log("service");
    console.log("Service data: " + venue);
    
    return this.http.post<{ msg: string }>(`${API_URL}/venues/new`, venue);
  }

  saveEvent(eventId: number, userId: number): Observable<{ msg: string }> {
    return this.http.post<{ msg: string }>(`${API_URL}/save`, { eventId });
  }

  unsaveEvent(eventId: number, userId: number): Observable<{ msg: string }> {
    return this.http.post<{ msg: string }>(`${API_URL}/unsave`, { eventId });
  }

  //Get functions
  /**
   * Fetches a single event using its ID.
   * @param eventId The ID of the event to be fetched.
   * @returns An event.
   */
  getSingleEventById(eventId: number): Observable<any> {
    return this.http.get<any>(`${API_URL}/id/${eventId}`)
  }

  getEventsWithTitle(title: string): Observable<BackendEvent[]> {
    return this.http.get<BackendEvent[]>(`${API_URL}/by-title/${title}`)
  }
   /**
    * Fetches a list of all the events.
    * @returns A list of all the events.
    */
  getEvents(): Observable<Event[] | BackendEvent[]> {
    return this.http.get<Event[] | BackendEvent[]>(`${API_URL}`);
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

  getSavedEvents(userId: number): Observable<{ msg: string, savedEventsList: BackendEvent[] }> {
    return this.http.get<{ msg: string, savedEventsList: BackendEvent[] }>(`${API_URL}/saved/${userId}`)
  }

  /**
   * Returns a venue by its name.
   * @param venueName The name of the venue.
   * @returns The venue's details.
   */
  getVenueById(venueId: number): Observable<Venue> {
    console.log("service venue id " +venueId);
    return this.http.get<Venue>(`${API_URL}/venues/${venueId}`)
  }

  getVenueByName(venueName: string): Observable<Venue> {
    console.log("service venue name " + venueName);
    
    return this.http.get<Venue>(`${API_URL}/venues?name=${venueName}`)
  }

  /**
   * Fetches a list of all the registered venues.
   * @returns A list of all the already registered venues.
   */
  getVenues(): Observable<Venue[]> {
    return this.http.get<Venue[]>(`${API_URL}/venues/registered`);
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

  isEventSaved(eventId: number, userId: number): Observable<{ isSaved: boolean }> {
    return this.http.get<{ isSaved: boolean }>(`${API_URL}/is-saved/${eventId}`, { params: { eventId, userId } });
  }
  //Update functions
  /**
   * Updates an event.
   * @param eventId The ID of the event to update.
   * @param event The event details as updated by the user.
   * @returns A message of the result, the updated event.
   */
  // updateEvent(eventId: number, event: BackendEvent): Observable<{ msg: string, event: BackendEvent }> {
  //   return this.http.patch<{ msg: string, event: BackendEvent }>(`${API_URL}/update/${eventId}`, event);
  // }
  updateEvent(eventId: number, eventToUpdate: FormData): Observable<{ msg: string, event: Event }> {
    return this.http.patch<{ msg: string, event: Event }>(`${API_URL}/${eventId}`, eventToUpdate);
  }

  updateVenue(venueId: number, venueToUpdate: any): Observable<{ msg: string, venue: Venue }> {
    return this.http.patch<{ msg: string, venue: Venue }>(`${API_URL}/venues/${venueId}`, venueToUpdate);
  }

  //Delete functions
  /**
   * Deletes an event.
   * @param eventId The ID of the event to be deleted.
   * @returns A message confirming the result of the deletion attempt.
   */
  deleteEvent(eventId: number): Observable<{ msg: string }> {
    return this.http.delete<{ msg: string }>(`${API_URL}/${eventId}`);
  }

  deleteVenue(venueId: number) {
    return this.http.delete(`${API_URL}/venues/${venueId}`);
  }
}