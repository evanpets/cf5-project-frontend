import { HttpClient } from '@angular/common/http';
import { Injectable, effect, inject, signal } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { Credentials, DecodedTokenSubject, LoggedInUser, User } from '../interfaces/user';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { Observable } from 'rxjs';

const API_URL = `${environment.apiURL}/api/user`;

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

  registerUser(user: User) {
    return this.http.post<{ msg: string }>(`${API_URL}/register`, user);
  }

  getUser(username: string): Observable<User> {
    return this.http.get<User>(`${API_URL}/get/username`, {params: {username}});
  }

  updateUser(user: User): Observable<{ msg: string }> {
    console.log("Service: ", user.userId, user.username)
    return this.http.patch<{ msg: string, user: User }>(`${API_URL}/update/${user.userId}`, user);
  }

   check_duplicate_email(email: string) : Observable<{ msg: string }>{
    return this.http.get<{msg: string}> (`${API_URL}/check-duplicate-email`, {params: {email} })
   }

   check_duplicate_username(username: string) : Observable<{ msg: string }> {
    return this.http.get<{msg: string}> (`${API_URL}/check-duplicate-username`, {params: {username}})
   }

   loginUser(credentials: Credentials) {
    return this.http.post<{token: string}>(`${API_URL}/login`, credentials)
   }

   logoutUser() {
    this.user.set(null)
    localStorage.removeItem('access-token')
    this.router.navigate([`api/user/login`])
   }

}