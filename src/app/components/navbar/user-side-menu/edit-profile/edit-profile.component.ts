  import { CommonModule } from '@angular/common';
  import { Component, OnInit } from '@angular/core';
  import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
  import { User } from 'src/app/shared/interfaces/user';
  import { UserService } from 'src/app/shared/services/user.service';
  
  @Component({
    selector: 'app-edit-profile',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './edit-profile.component.html',
    styleUrls: ['./edit-profile.component.css']
  })
  export class EditProfileComponent implements OnInit {
    user: User | null = null;
    originalUser: User | null = null;
    isEditing: boolean = false;
    profileForm: FormGroup;
  
    constructor(private userService: UserService, private fb: FormBuilder) {
      this.profileForm = this.fb.group({
        username: [{ value: '', disabled: true }],
        firstName: [{ value: '', disabled: true }, Validators.required],
        lastName: [{ value: '', disabled: true }, Validators.required],
        email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
        password: [{ value: '', disabled: true }, Validators.required],
        confirmPassword: [{ value: '', disabled: true }],
        phoneNumber: [{ value: '', disabled: true }, Validators.required]
      }, { validator: this.passwordConfirmValidator });
    }
  
    ngOnInit(): void {
      const loggedInUser = this.userService.user();
      if (loggedInUser) {
        this.userService.getUser(loggedInUser.username).subscribe({
          next: (response) => {
            this.user = response;
            this.originalUser = { ...response };
            this.profileForm.patchValue(this.user);
          },
          error: (err) => {
            console.error('Error fetching user data', err);
          }
        });
      }
    }

    passwordConfirmValidator(form: FormGroup) {
      if (form.get('password')?.value !== form.get('confirmPassword')?.value) {
        form.get('confirmPassword')?.setErrors({ passwordMismatch: true });
        return { passwordMismatch: true };
      }
      return null;
    }
  
    enableEdit(): void {
      this.isEditing = true;
      this.profileForm.get('firstName')?.enable();
      this.profileForm.get('lastName')?.enable();
      this.profileForm.get('email')?.enable();
      this.profileForm.get('password')?.enable();
      this.profileForm.get('confirmPassword')?.enable();
      this.profileForm.get('phoneNumber')?.enable();
    }
  
    saveChanges(): void {
      if (this.user && this.profileForm.valid) {
        const updatedUser = { ...this.user, ...this.profileForm.value };
        updatedUser.id = this.user.userId; 

        console.log(updatedUser)
        delete updatedUser.confirmPassword; // Ensure confirmPassword is not sent to the backend
  
        this.userService.updateUser(updatedUser).subscribe({
          next: (response) => {
            console.log(response.msg);
            this.isEditing = false;
            this.originalUser = { ...updatedUser };
            this.profileForm.patchValue(this.originalUser);
            this.disableFormFields();
          },
          error: (err) => {
            const message = err.error.msg;
            console.log(message);
          }
        });
      }
    }

  cancelChanges(): void {
    this.isEditing = false;
    if (this.originalUser) {
      this.profileForm.patchValue(this.originalUser);
      this.disableFormFields();
    }
  }

  private disableFormFields(): void {
    this.profileForm.get('firstName')?.disable();
    this.profileForm.get('lastName')?.disable();
    this.profileForm.get('email')?.disable();
    this.profileForm.get('password')?.disable();
    this.profileForm.get('confirmPassword')?.disable();
    this.profileForm.get('phoneNumber')?.disable();
  }
}
