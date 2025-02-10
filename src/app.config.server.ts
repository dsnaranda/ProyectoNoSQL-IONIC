import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';
import { provideHttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // <-- Importa esto

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(), 
    provideHttpClient(),
    CookieService
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
