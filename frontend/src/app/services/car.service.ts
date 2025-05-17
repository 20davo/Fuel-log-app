import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class CarService {
  private API_URL = 'http://localhost:5000/api/cars';

  constructor(private http: HttpClient, private auth: AuthService) {}

  get headers() {
    return {
      headers: new HttpHeaders({ Authorization: `Bearer ${this.auth.getToken()}` })
    };
  }

  getCars() {
    return this.http.get<any[]>(this.API_URL, this.headers);
  }

  addCar(data: any) {
    return this.http.post(this.API_URL, data, this.headers);
  }

  deleteCar(id: string) {
    return this.http.delete(`${this.API_URL}/${id}`, this.headers);
  }
}
