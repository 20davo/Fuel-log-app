import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

@Component({
  standalone: true,
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    RouterModule,
    MatSelectModule,
    MatOptionModule
  ]
})
export class AccountComponent implements OnInit {
  entries: any[] = [];
  date = ''; odometer = ''; liters = ''; price = ''; location = ''; fuelType = ''; unitPrice = '';

  constructor(private http: HttpClient, private auth: AuthService, private router: Router) {}

  get headers() {
    return {
      headers: new HttpHeaders({ Authorization: `Bearer ${this.auth.getToken()}` })
    };
  }

  userName = '';

  ngOnInit() {
    this.userName = this.auth.getName();
    this.fetch();
  }

  fetch() {
    this.http.get<any[]>('http://localhost:5000/api/fuel', this.headers).subscribe({
      next: data => this.entries = data,
      error: err => alert('Hiba a lekérdezéskor')
    });
  }

  create() {
    this.http.post('http://localhost:5000/api/fuel', {
      date: this.date,
      odometer: this.odometerValue,
      liters: this.liters,
      unitPrice: this.unitPrice,
      location: this.location || undefined,    // opcionális
      fuelType: this.fuelType || undefined     // opcionális
    }, this.headers).subscribe({
      next: () => this.fetch(),
      error: err => {
        const msg = err.error?.errors?.[0]?.msg || err.error?.error || 'Ismeretlen hiba történt';
        alert('Hiba: ' + msg);
      }
    });
  }

  delete(id: string) {
    this.http.delete(`http://localhost:5000/api/fuel/${id}`, this.headers).subscribe({
      next: () => this.fetch(),
      error: err => alert('Törlési hiba')
    });
  }

  logout() {
    this.auth.clearToken();
    this.router.navigate(['/']);
  }

  get odometerValue(): number {
    return Number(this.odometer.replace(/\D/g, '')) || 0;
  }

  set odometerValue(val: number) {
    this.odometer = val.toLocaleString('hu-HU');
  }

  onOdometerChange(value: string) {
    const numeric = value.replace(/\D/g, '');
    this.odometer = Number(numeric).toLocaleString('hu-HU');
  }

  today = new Date().toISOString().split('T')[0];

  onDateInput(raw: string) {
    const digits = raw.replace(/\D/g, '').slice(0, 8); // csak szám, max 8 karakter
    let formatted = '';

    if (digits.length >= 4) formatted += digits.slice(0, 4);
    if (digits.length >= 5) formatted += '-' + digits.slice(4, 6);
    if (digits.length >= 7) formatted += '-' + digits.slice(6, 8);

    this.date = formatted;
  }


}
