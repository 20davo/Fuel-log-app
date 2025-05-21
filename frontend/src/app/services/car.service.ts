import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';

import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CarService {
  private API_URL = `${environment.apiUrl}/cars`;

  constructor(private http: HttpClient, private auth: AuthService) {}

  getCars() {
    return this.http.get<any[]>(this.API_URL);
  }

  addCar(data: any) {
    return this.http.post(this.API_URL, data);
  }

  deleteCar(id: string) {
    return this.http.delete(`${this.API_URL}/${id}`);
  }
}
