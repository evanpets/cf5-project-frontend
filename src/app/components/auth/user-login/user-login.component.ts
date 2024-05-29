import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Credentials, DecodedTokenSubject, LoggedInUser } from 'src/app/shared/interfaces/user';
import { UserService } from 'src/app/shared/services/user.service';
import { jwtDecode } from 'jwt-decode';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-user-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})

export class UserLoginComponent {
  userService = inject(UserService)
  router = inject(Router)

  invalidLogin = false

  
  form = new FormGroup ({
    Username: new FormControl('', Validators.required),
    // email: new FormControl('', [Validators.required, Validators.email]),
    Password: new FormControl('', Validators.required)
  })

  onSubmit() {
    const credentials = this.form.value as Credentials
    this.userService.loginUser(credentials).subscribe({
      next: (response) => {
        console.log(response)
        // const access_token = response.access_token
        const access_token =  response.token;
        console.log("Access token: ", access_token)

        localStorage.setItem('access_token', access_token)
        console.log("Access token after set: ", access_token)

        // const decodedTokenSubject = jwtDecode<String>(access_token).substring as unknown as LoggedInUser
        // const decodedTokenSubject = jwtDecode(access_token).sub as unknown as LoggedInUser
        const decodedToken = jwtDecode<DecodedTokenSubject>(access_token) as LoggedInUser;
        const decodedTokenSubject = decodedToken;

        console.log('Decoded Token Subject:', decodedTokenSubject);

        // console.log("Decoded items: " + decodedTokenSubject.Email + " " + decodedTokenSubject.Username)
        this.userService.user.set({
          Username: decodedTokenSubject.Username,
          Email: decodedTokenSubject.Email
        })


        this.router.navigate(['home'])
      },
      error: (response) => {
        console.error('Login Error', response)
        this.invalidLogin = true
      } 
    })
  }
}