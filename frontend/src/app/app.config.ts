import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router'; // ✅ Import this
import { routes } from './app.routes'; // Ensure this file exists

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), // ✅ Now it will work
  ],
};
