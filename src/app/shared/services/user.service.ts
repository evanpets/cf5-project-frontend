import { HttpClient } from '@angular/common/http';
import { Injectable, effect, inject, signal } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { Credentials, DecodedTokenSubject, LoggedInUser, User } from '../interfaces/user';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

const API_URL = `${environment.apiURL}/api/user`;

@Injectable({
  providedIn: 'root',
})

export class UserService {
  http: HttpClient = inject(HttpClient);
  router: Router = inject(Router)

  user = signal<LoggedInUser | null>(null)
  claimName = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name";
  claimEmail = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress";

  constructor() {
    const access_token = localStorage.getItem('access_token')

    if (access_token) {

      const decodedToken = jwtDecode<DecodedTokenSubject>(access_token);

      const decodedTokenSubject: LoggedInUser = {
        Username: decodedToken[this.claimName],
        Email: decodedToken[this.claimEmail]
      };

      this.user.set({
        Username: decodedTokenSubject.Username,
        Email: decodedTokenSubject.Email
      })
    }
    
    effect(()=> {
      if (this.user()) {
        console.log('User logged in', this.user().Username)
      } else {
        console.log('No user logged in')
      }
    })
  }

  registerUser(user: User) {
    return this.http.post<{ msg: string }>(`${API_URL}/register`, user);
  }

   check_duplicate_email(email: string) {
    return this.http.get<{msg: string}> (`${API_URL}/check_duplicate_email/${email}`)
   }

   check_duplicate_username(username: string) {
    return this.http.get<{msg: string}> (`${API_URL}/check_duplicate_username/${username}`)
   }

   loginUser(credentials: Credentials) {
    return this.http.post<{token: string}>(`${API_URL}/login`, credentials)
   }

   logoutUser() {
    this.user.set(null)
    localStorage.removeItem('access-token')
    this.router.navigate([`${API_URL}/login`])
   }

}