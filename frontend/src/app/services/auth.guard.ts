import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  constructor(private auth: AuthService) {}

  canActivate(): boolean {
    const token = this.auth.getToken();

    if (!token) {
      alert('A bejelentkezésed lejárt! Kérlek jelentkezz be újra!');
      this.auth.logout();
      return false;
    }

    return true;
  }
}
