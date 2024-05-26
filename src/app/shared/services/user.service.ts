import { HttpClient } from '@angular/common/http';
import { Injectable, effect, inject, signal } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Credentials, LoggedInUser, User } from '../interfaces/user';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';


const API_URL = `${environment.apiURL}/user`;

@Injectable({
  providedIn: 'root',
})

export class UserService {
  http: HttpClient = inject(HttpClient);
  router: Router = inject(Router)

  user = signal<LoggedInUser | null>(null)

  constructor() {
    //keeps token active through refreshes. doesn't check for expired tokens?
    const access_token = localStorage.getItem('access_token')

    if (access_token) {
      const decodedTokenSubject = jwtDecode(access_token).sub as unknown as LoggedInUser

      this.user.set(decodedTokenSubject)
      // this.user.set({
      //   firstName: decodedTokenSubject.firstName,
      //   email: decodedTokenSubject.email
      // })
    }
    
    effect(()=> {
      if (this.user()) {
        console.log('User logged in', this.user()!.firstName)
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

  //  loginUser(credentials: Credentials) {
  //   return this.http.post<{access_token: string}>(`${API_URL}/login`, credentials)
  //  }

   loginUser(credentials: Credentials) {
    return this.http.post<{ access_token: string }>(`${API_URL}/login`, credentials).subscribe(response => {
      const decodedTokenSubject = jwtDecode<LoggedInUser>(response.access_token)
      this.user.set(decodedTokenSubject)
      localStorage.setItem('access_token', response.access_token)
    });
  }

   logoutUser() {
    this.user.set(null)
    localStorage.removeItem('access-token')
    this.router.navigate(['login'])
   }

}