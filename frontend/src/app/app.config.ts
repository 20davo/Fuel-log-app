import { provideRouter, Routes } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { AccountComponent } from './pages/account/account.component';
import { CarListComponent } from './pages/account/components/car-list/car-list.component';
import { CarLogComponent } from './pages/account/components/car-log/car-log.component';
import { AuthGuard } from './services/auth.guard';
import { AuthInterceptor } from './services/auth.interceptor';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'account',
    component: AccountComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'cars', pathMatch: 'full' },
      { path: 'cars', component: CarListComponent },
      { path: 'cars/:id', component: CarLogComponent }
    ]
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

export const appConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    provideAnimations(),
    importProvidersFrom(FormsModule)
  ]
};
