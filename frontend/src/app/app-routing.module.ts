import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { CarListComponent } from './pages/account/components/car-list/car-list.component';
import { CarLogComponent } from './pages/account/components/car-log/car-log.component';
import { AccountComponent } from './pages/account/account.component';
import { AuthGuard } from './services/auth.guard';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'account',
    canActivate: [AuthGuard],
    component: AccountComponent,
    children: [
      { path: '', redirectTo: 'cars', pathMatch: 'full' },
      { path: 'cars', component: CarListComponent },
      { path: 'cars/:id', component: CarLogComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
