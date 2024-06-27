import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, effect, inject, signal } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { Credentials, DecodedTokenSubject, LoggedInUser, User } from '../interfaces/user';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { Observable } from 'rxjs';

const API_URL = `${environment.apiURL}/api/users`;

@Injectable({
  providedIn: 'root',
})

export class UserService {
  http: HttpClient = inject(HttpClient);
  router: Router = inject(Router)

  user = signal<LoggedInUser | User | null>(null) 
  claimName = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name";
  claimEmail = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress";
  claimRole = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";


  constructor() {
    const access_token = localStorage.getItem('access_token')

    if (access_token) {

      const decodedToken = jwtDecode<DecodedTokenSubject>(access_token);

      const decodedTokenSubject: LoggedInUser = {
        username: decodedToken[this.claimName],
        email: decodedToken[this.claimEmail],
        role: decodedToken[this.claimRole]
      };

      this.user.set({
        username: decodedTokenSubject.username,
        email: decodedTokenSubject.email,
        role: decodedTokenSubject.role
      })
    }
    
    effect(()=> {
      if (this.user()) {
        console.log('User logged in', this.user().username)
      } else {
        console.log('No user logged in')
      }
    })
  }

    /**
   * Registers a new user.
   * @param user The user to register.
   * @returns An observable that emits the created user.
   */
  registerUser(user: User): Observable<User> {
    return this.http.post<User>(`${API_URL}/registration`, user);
  }  

    /**
   * Retrieves a user by their ID.
   * @param userId The ID of the user to retrieve.
   * @returns An observable that emits the retrieved user.
   */
  getUserById(userId: number): Observable<User> {
    return this.http.get<User>(`${API_URL}/${userId}`);
  }

    /**
   * Retrieves a user by their username.
   * @param username The username of the user to retrieve.
   * @returns An observable that emits the retrieved user.
   */
  getUserByUsername(username: string): Observable<User> {
    return this.http.get<User>(`${API_URL}/by-username?username=${username}`);
  }

    /**
   * Retrieves all users.
   * @returns An observable that emits an array of users.
   */
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${API_URL}`);
  }

    /**
   * Updates an existing user.
   * @param user The updated user data.
   * @returns An observable that emits a success message and the updated user.
   */
  updateUser(user: User): Observable<{ msg: string }> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.patch<{ msg: string, user: User }>(`${API_URL}/${user.userId}`, user, { headers});
  }

    /**
   * Allows an admin to update existing users.
   * @param user The updated user data.
   * @returns An observable that emits a success message and the updated user.
   */
  adminUpdateUser(user: User): Observable<{ msg: string, user: User}> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.patch<{ msg: string, user: User }>(`${environment.apiURL}/api/admin/users/${user.userId}`, user,  { headers });
  }

  /**
   * Deletes a user.
   * @param userId The ID of the user to delete.
   * @returns An observable that emits a success message.
   */
  deleteUser(userId: number) {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(`${environment.apiURL}/api/admin/users/${userId}`, { headers });
  }

    /**
   * Checks if an email is already in use.
   * @param email The email to check for duplication.
   * @returns An observable that emits a success message.
   */
   check_duplicate_email(email: string) : Observable<{ msg: string }>{
    return this.http.get<{msg: string}> (`${API_URL}/duplicate-email`, {params: {email} })
   }

     /**
   * Checks if a username is already in use.
   * @param username The username to check for duplication.
   * @returns An observable that emits a success message.
   */
   check_duplicate_username(username: string) : Observable<{ msg: string }> {
    return this.http.get<{msg: string}> (`${API_URL}/duplicate-username`, {params: {username}})
   }

     /**
   * Logs in a user with the provided credentials.
   * @param credentials The credentials to log in with.
   * @returns An observable that emits a token.
   */
   loginUser(credentials: Credentials) {
    return this.http.post<{token: string}>(`${API_URL}/login`, credentials)
   }

     /**
   * Logs out the current user and clears local storage.
   */
   logoutUser() {
    this.user.set(null)
    localStorage.removeItem('access_token')
    this.router.navigate([`api/users/login`])
   }

}