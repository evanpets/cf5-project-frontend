import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from '@angular/router';
import { set } from 'lodash-es';
import { User } from 'src/app/shared/interfaces/user';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-admin-insert-user',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, CommonModule, RouterLink, MatSelectModule],
  templateUrl: './admin-insert-user.component.html',
  styleUrl: './admin-insert-user.component.css'
})
export class AdminInsertUserComponent {
  insertionSuccess: boolean = false;

  constructor(private userService: UserService) {}

  form = new FormGroup({
    username: new FormControl('', Validators.required),
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(8),   Validators.pattern("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%^&(){}[\\]\\:;<>,.?/~_+-=|]).{8,}$")
    ]),
    phoneNumber: new FormControl('', [Validators.required, Validators.minLength(10)]),
    role: new FormControl('', Validators.required)
  }
);

  onSubmit (value:any) {
    const user = this.form.value as User

    this.userService.registerUser(user).subscribe ({
      next: (response) => {
        console.log("User registered" + response)
        this.insertionSuccess = true;
      }, 
      error: (response) => {
        const message = response.error.msg
        console.log("Error registering user", message)
      }
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
