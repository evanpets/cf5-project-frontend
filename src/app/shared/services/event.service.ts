import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BackendEvent, Event, Venue } from '../interfaces/event';
import { environment } from 'src/environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { isEmpty, values } from 'lodash-es';

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
   * @param event   The event details as input from a user.
   * @returns       A message confirming the result of the insertion attempt.
   */
  createEvent(formData: FormData): Observable<Event> {
    console.log("service");
    console.log("Service data: " + formData);
    
    return this.http.post<Event>(`${API_URL}/new`, formData);
  }

  /**
   * Inserts an event into the database
   * @param venue   The venue to be inserted.
   * @returns       The inserted venue.
   */
  insertVenue(venue: Venue): Observable<{ msg: string, venue: Venue }> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<{ msg: string, venue: Venue }>(`${environment.apiURL}/api/admin/venues/new`, venue, { headers });
  }

/**
 * Adds the saved (bookmarked) status to an event for a specific user.
 * @param eventId   The ID of the event.
 * @param userId    The ID of the requesting user.
 * @returns         The new saved status.
 */
saveEvent(eventId: number): Observable<{ msg: string }> {
  const token = localStorage.getItem('access_token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.post<{ msg: string }>(`${API_URL}/save`, { eventId }, { headers });
}


  /**
 * Removes the saved (bookmarked) status from an event for a specific user.
 * @param eventId   The ID of the event.
 * @param userId    The ID of the requesting user.
 * @returns         The new saved status.
 */
  unsaveEvent(eventId: number): Observable<{ msg: string }> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<{ msg: string }>(`${API_URL}/unsave`, { eventId }, { headers});
  }

  //Get functions
  /**
   * Fetches a single event using its ID.
  * @param eventId     The ID of the event to be fetched.
  * @returns           An event.
   */
  getSingleEventById(eventId: number): Observable<any> {
    return this.http.get<any>(`${API_URL}/id/${eventId}`)
  }

  /**
   * Fetches a list of events containing a user-input string in their title.
   * @param title     The string input.
   * @returns         The list of events with the given string in their title.
   */
  getAllEventsWithTitle(title: string): Observable<BackendEvent[]> {
    return this.http.get<BackendEvent[]>(`${API_URL}/by-title/${title}`)
  }

   /**
    * Fetches a list of all the events.
  * @returns        A list of all the events.
    */
  getAllEvents(): Observable<Event[] | BackendEvent[]> {
    return this.http.get<Event[] | BackendEvent[]>(`${API_URL}`);
  }

  /**
   * Fetches a list of all upcoming events (current or future date).
  * @returns         A list of all the future events.
   */
  getAllUpcomingEvents(): Observable<Event[]> {
    console.log("Upcoming events")
    return this.http.get<Event[]>(`${API_URL}/upcoming`);
  }

  /**
   * Fetches a list of all past events (date before current one).
  * @returns         A list of all the past events.
   */
  getAllPastEvents(): Observable<Event[]> {
    console.log("Past events")
    return this.http.get<Event[]>(`${API_URL}/past`);
  }

  getAllEventsInCategory(category: string): Observable<{msg: string, eventsList:Event[]}> {
    return this.http.get<{msg: string, eventsList: Event[]}>(`${API_URL}/${category.toLowerCase()}`)
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
   * Fetches a list of the events a specific user has added to their saved (bookmarked) list.
   * @param userId    The ID of the requesting user.
   * @returns         A list of all saved events.
   */
  getSavedEvents(userId: number): Observable<{ msg: string, savedEventsList: BackendEvent[] }> {
    return this.http.get<{ msg: string, savedEventsList: BackendEvent[] }>(`${API_URL}/saved/${userId}`)
  }

  /**
   * Returns a venue by its name.
   * @param venueName   The name of the venue.
   * @returns           The venue's details.
   */
  getVenueById(venueId: number): Observable<Venue> {
    return this.http.get<Venue>(`${API_URL}/venues/${venueId}`)
  }

  getVenueByName(venueName: string): Observable<Venue> {
    return this.http.get<Venue>(`${API_URL}/venues?name=${venueName}`)
  }

  /**
   * Fetches a list of all the registered venues.
   * @returns   A list of all the already registered venues.
   */
  getRegisteredVenues(): Observable<Venue[]> {
    return this.http.get<Venue[]>(`${API_URL}/venues/registered`);
  }

  /**
   * Fetches a list of information whose category is specified by the user.
   * @param searchCategory  The category by which to fetch results (event, venue, performer, date)
   * @returns               The list of items corresponding to the category.
   */
  filterEvents(searchCategory: string): Observable<any[]> {
    return this.http.get<any[]>(`${API_URL}/filter-events?filter=${searchCategory}`);
  }

  /**
   * Examines whether a newly input venue name already exists.
   * @param venueName   The input venue name.
   * @returns           A message confirming or denying availability of the name.
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
   * @param eventId   The ID of the event to update.
   * @param event     The event details as updated by the user.
   * @returns         A message of the result, the updated event.
   */
  // updateEvent(eventId: number, event: BackendEvent): Observable<{ msg: string, event: BackendEvent }> {
  //   return this.http.patch<{ msg: string, event: BackendEvent }>(`${API_URL}/update/${eventId}`, event);
  // }

  updateEvent(eventId: number, updateInformation: any): Observable<{ msg: string, event: Event }> {
    // const token = localStorage.getItem('access_token');
    // const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.patch<{ msg: string, event: Event }>(`${API_URL}/${eventId}`, updateInformation);
  }

  /**
   * Updates a venue's information.
   * @param venueId         The ID of the venue to update. 
   * @param venueToUpdate   The venue's updated information.
   * @returns               The updated venue.
   */
  updateVenue(venueId: number, venueToUpdate: any): Observable<{ msg: string, venue: Venue }> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.patch<{ msg: string, venue: Venue }>(`${environment.apiURL}/api/admin/venues/${venueId}`, venueToUpdate, { headers });
  }

  //Delete functions
  /**
   * Deletes an event.
   * @param eventId   The ID of the event to be deleted.
   * @returns         A message confirming the result of the deletion attempt.
   */
  deleteEvent(eventId: number): Observable<{ msg: string }> {
    return this.http.delete<{ msg: string }>(`${API_URL}/${eventId}`);
  }

  /**
   * Deletes a venue.
   * @param venueId   The ID of the venue to be deleted.
   */
  deleteVenue(venueId: number) {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(`${environment.apiURL}/api/admin/venues/${venueId}`, { headers });
  }
}