import {
  ApplicationConfig,
  inject,
  LOCALE_ID,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { AuthService } from '@features/auth/services/auth.service';
import { firstValueFrom } from 'rxjs';
import { authInterceptor } from '@features/auth/interceptors/auth.interceptor';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es-AR';
import localeBr from '@angular/common/locales/br';
import { LocaleService } from '@shared/services/locale.service';

registerLocaleData(localeEs, 'es');
registerLocaleData(localeBr, 'br');

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    //* The interceptor retrieves all http requests before sending to add 'Bearer Token' header
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),

    //* checkAuthStatus only sends one http request
    provideAppInitializer(() => {
      const authService = inject(AuthService);
      return firstValueFrom(authService.checkAuthStatus());
    }),

    {
      provide: LOCALE_ID,
      deps: [LocaleService],
      useFactory: (localeService: LocaleService) => localeService.getLocale,
    },
  ],
};
