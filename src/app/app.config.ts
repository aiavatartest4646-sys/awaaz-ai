import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { SocialLoginModule, SocialAuthServiceConfig, GoogleLoginProvider, MicrosoftLoginProvider } from '@abacritt/angularx-social-login';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch()),
    provideAnimations(),
    provideRouter(routes),
    importProvidersFrom(SocialLoginModule),
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider('160704951696-5a0pqam554k2mq7kjvdnfemqf99aee3u.apps.googleusercontent.com')  // ← Replace with your real ID
          },
          {
            id: MicrosoftLoginProvider.PROVIDER_ID,
            provider: new MicrosoftLoginProvider('YOUR_MICROSOFT_CLIENT_ID')
          }
        ],
        onError: (err: any) => {
          console.error('Social login error:', err);
        }
      }
    }
  ]
};