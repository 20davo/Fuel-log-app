import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private API_URL = 'http://localhost:5000/api/auth';
  token: string | null = null;

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return this.http.post<{ token: string, name: string }>(`${this.API_URL}/login`, { email, password });
  }

  register(name: string, email: string, password: string) {
    return this.http.post(`${this.API_URL}/register`, { name, email, password });
  }

  saveToken(token: string, name: string) {
    this.token = token;
    localStorage.setItem('token', token);
    localStorage.setItem('name', name);
  }

  getName() {
    return localStorage.getItem('name') || 'Névtelen';
  }

  getToken() {
    return this.token || localStorage.getItem('token');
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }
}
