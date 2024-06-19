import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-users-crud',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './users-crud.component.html',
  styleUrl: './users-crud.component.css'
})
export class UsersCrudComponent {

}
