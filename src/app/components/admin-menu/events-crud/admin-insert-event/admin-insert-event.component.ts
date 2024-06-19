import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from '@angular/router';
import { EventsDatatableComponent } from 'src/app/components/navbar/event-datatable-page/events-datatable/events-datatable.component';
import { BackendEvent, Event } from 'src/app/shared/interfaces/event';
import { User, LoggedInUser } from 'src/app/shared/interfaces/user';
import { EventService } from 'src/app/shared/services/event.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-admin-insert-event',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, EventsDatatableComponent, MatFormFieldModule, MatInputModule, MatButtonModule, MatOptionModule, MatIconModule, MatNativeDateModule, MatDatepickerModule, MatCheckboxModule, MatSelectModule, RouterLink],
  templateUrl: './admin-insert-event.component.html',
  styleUrl: './admin-insert-event.component.css'
})

export class AdminInsertEventComponent {

}