import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from './auth-interceptor'; // ✅ note lowercase export

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor]), // 👈 register interceptor here
      withFetch()
    ),
  ],
};
