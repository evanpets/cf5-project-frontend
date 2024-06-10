import { Component, LOCALE_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { registerLocaleData } from '@angular/common';
import localeEl from '@angular/common/locales/el';

// Register the Greek locale data
registerLocaleData(localeEl);

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, HomepageComponent], 
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [
    { provide: LOCALE_ID, useValue: 'el-GR' } // Set the default locale to Greek
  ]
})

export class AppComponent {
  title = 'final-project-frontend';
}
