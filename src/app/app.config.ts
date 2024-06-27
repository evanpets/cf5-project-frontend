import { ApplicationConfig, LOCALE_ID, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { JwtModule } from '@auth0/angular-jwt';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localeEl from '@angular/common/locales/el';
import { MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';



export function tokenGetter() {
  return localStorage.getItem("access_token");
}

registerLocaleData(localeEl);

export const GREEK_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    importProvidersFrom(
      JwtModule.forRoot({
          config: {
              tokenGetter: tokenGetter,
              allowedDomains: ['https://localhost:4200', 'https://localhost:5001']
          },
      }),
  ),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: LOCALE_ID, useValue: 'el-GR' },
    { provide: MAT_DATE_LOCALE, useValue: 'el-GR' },
    { provide: MAT_DATE_FORMATS, useValue: GREEK_DATE_FORMATS },    
  ]
};
