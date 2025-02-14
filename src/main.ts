import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { trashOutline, star, eye, arrowBack } from 'ionicons/icons';

// Registrar los iconos
addIcons({
  'trash-outline': trashOutline,
  'star': star,
  'eye': eye,
  'arrow-back': arrowBack,
});

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideHttpClient(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
  ],
}).catch(err => console.log(err));

// Cargar los elementos personalizados de Ionic PWA
defineCustomElements(window);