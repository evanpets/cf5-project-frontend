import { DialogRef, DIALOG_DATA, Dialog } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { Router, RouterLink } from '@angular/router';
import { LoggedInUser, User } from 'src/app/shared/interfaces/user';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-admin-user-update-delete',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelect, MatOptionModule],
    templateUrl: './admin-user-update-delete.component.html',
  styleUrl: './admin-user-update-delete.component.css'
})
export class AdminUserUpdateDeleteComponent {
  editForm: FormGroup;
  currentActiveUser: User
  displayedUser: User
  users: User[] = []
  currentIndex: number = -1;

  constructor(private userService: UserService, private fb: FormBuilder, public dialog: Dialog) {
    this.editForm = this.fb.group({
      userId: [''],
      username: [''],
      password: [''],
      email: [''],
      firstname: [''],
      lastname: [''],
      phoneNumber: [''],
      role: ['']
    });
  }

  ngOnInit(): void {
    this.loadCurrentUser();
  }
  
  loadCurrentUser() {
    const username = (this.userService.user() as LoggedInUser).username
    console.log(username)
    this.userService.getUserByUsername(username).subscribe({
      next: (response) => {
        this.currentActiveUser = response;
        this.loadUsers();
        console.log('Current user ID: ', this.currentActiveUser.userId)
        console.log('Current user:', this.currentActiveUser);
      },
      error: (error) => {
        console.error('Error fetching current user', error);
      }
    });
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        console.log('Users loaded:', this.users);
        if (this.users.length > 0) {
          this.currentIndex = 0;
          this.displayedUser = this.users[this.currentIndex];
          this.editUser(this.displayedUser);
        }},
      error: (error) => {
        console.error('Error fetching venues', error);
      }
    });
  }

  editUser(user: User): void {
    console.log("edit started");
    
    this.userService.getUserByUsername(user.username).subscribe({
      next: (response: User) => {
        console.log("Role: " + response.role);
        
        this.displayedUser = response;

        this.editForm.patchValue({
          userId: this.displayedUser.userId,
          username: this.displayedUser.username,
          email: this.displayedUser.email,
          password: this.displayedUser.password,
          firstname: this.displayedUser.firstName,
          lastname: this.displayedUser.lastName,
          phoneNumber: this.displayedUser.phoneNumber,
          role: this.displayedUser.role
        });

      },
      error: (err) => {
        console.log("Error fetching response", err);
      }
    });
  }

  saveUser(): void {
    console.log('Form Submitted');

    if (this.editForm.valid && this.displayedUser) {
      console.log("save beginning",this.displayedUser);
      
      const userToUpdate: User = {
        userId: this.displayedUser.userId,
        username: this.editForm.value.username,
        email: this.editForm.value.email,
        password: this.editForm.value.password,
        firstName: this.editForm.value.firstname,
        lastName: this.editForm.value.lastname,
        phoneNumber: this.editForm.value.phoneNumber,
        role: this.editForm.value.role

       };

      console.log("Update info: ", userToUpdate);
      this.userService.updateUser(userToUpdate).subscribe({
        next: (response) => {
          console.log("Response after update: ", response,  response.msg);
          this.loadUsers();
        },
        error: (error) => {
          console.error('Error updating event', error.msg);
        }
      });
    } else {
      console.log("Couldn't save");
    }
  }

  openConfirmDeleteDialog(user: User) {
    this.dialog.open(UserConfirmDeleteDialogComponent, {
      data: user
    });
  }

  navigateToPreviousUser() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.editUser(this.users[this.currentIndex]);
    }
  }

  navigateToNextUser() {
    if (this.currentIndex < this.users.length - 1) {
      this.currentIndex++;
      this.editUser(this.users[this.currentIndex]);
    }
  }
}

@Component({
  selector: 'app-user-confirm-delete',
  template: `
    <div>
      <h4>Are you sure you want to delete this user?</h4>
      <p class="text-center">{{ user.username }}</p>
      <div class="d-flex justify-content-around">
        <button class="btn btn-primary" mat-button (click)="confirmDelete(user.userId)">Confirm</button>
        <button class="btn btn-danger" mat-button (click)="closeDialog()">Cancel</button>
      </div>

    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        background: #fff;
        border-radius: 8px;
        padding: 16px;
        max-width: 500px;
      }
    `,
  ]
})
export class UserConfirmDeleteDialogComponent {

  constructor(private dialogRef: DialogRef, private router: Router, private userService: UserService, @Inject(DIALOG_DATA) public user: any) {}

  confirmDelete(userId: number) {
    if (!userId) {
      console.error('User is undefined or null');
      return;
    } 
    this.userService.deleteUser(userId).subscribe({
      next: (response) => {
        console.log("Delete complete", response);
        this.reloadCurrentRoute()
      },
      error: (err) => {
        console.log("Error during deletion ", err);
      }
    });
        this.dialogRef.close();
  }

  closeDialog() {
    this.dialogRef.close();
  }

  reloadCurrentRoute() {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }
}