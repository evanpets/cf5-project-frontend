import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { set } from 'lodash-es';
import { User } from 'src/app/shared/interfaces/user';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-user-registration',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, CommonModule, RouterLink],
  templateUrl: './user-registration.component.html',
  styleUrl: './user-registration.component.css'
})

export class UserRegistrationComponent {
  userService = inject(UserService);

  registrationStatus: {success: boolean; message: string} = 
  {success: false,
    message: 'Not attempted yet',
  }

  form = new FormGroup({
    username: new FormControl('', Validators.required),
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(4),
      Validators.pattern("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%^&(){}[\\]\\:;<>,.?/~_+-=|]).{8,}$")
    ]),
    phoneNumber: new FormControl('', [Validators.required, Validators.minLength(10)]),
    confirmPassword: new FormControl('', [Validators.required, Validators.minLength(4)])
  },
  this.passwordConfirmValidator
);

  passwordConfirmValidator(form: FormGroup) {
    if (form.get('password').value !== form.get('confirmPassword').value) {
      form.get('confirmPassword').setErrors({passwordMismatch: true})
      return {passwordMismatch: true}
    }
    return {}
  }

  onSubmit (value:any) {
    const user = this.form.value as User
    delete user['confirmPassword']
    user.role = 'User'

    this.userService.registerUser(user).subscribe ({
      next: (response) => {
        console.log("User registered" + response)
        this.registrationStatus = {success: true, message: "Registration successful"}
      }, 
      error: (response) => {
        const message = response.error.msg
        console.log("Error registering user", message)
        this.registrationStatus = { success: false, message }
      }
    })
  }

  check_duplicate_email() {
    const email = this.form.get('email').value
    console.log(`Checking email: ${email}`);

    this.userService.check_duplicate_email(email).subscribe({
      next: (response) => {
        if(response && response.msg) {
          console.log(response.msg)
          if (response.msg === "Email not registered yet") {
          this.form.get('email').setErrors(null)
          } else {
            this.form.get('email').setErrors({duplicateEmail: true})
          }
        }
      },
      error: (response) => {
        const message = response.error.msg
        console.log(message)
        this.form.get('email').setErrors({duplicateEmail: true})
      },
    })
  }

  check_duplicate_username() {
    const username = this.form.get('username').value
    
    this.userService.check_duplicate_username(username).subscribe({
      next: (response) => {
        if(response && response.msg) {
          console.log(response.msg)
          if (response.msg === "Username available") {
          this.form.get('username').setErrors(null)
          } else {
            this.form.get('username').setErrors({takenUsername: true})
          }
        }
      },
      error: (response) => {
        const message = response.error.msg
        console.log(message)
        this.form.get('username').setErrors({takenUsername: true})
      },
    })
   }
}
