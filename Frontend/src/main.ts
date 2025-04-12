import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { appRouting } from './app/app.routes'; // ✅ Import `appRouting` instead of `appRoutes`
import { AuthInterceptor } from './app/authentication/interceptors/auth.interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(HttpClientModule),
    appRouting, // ✅ Use `appRouting` instead of `provideRouter(appRoutes)`
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ]
});
