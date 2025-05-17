import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { Router } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';


@Component({
  standalone: true,
  selector: 'app-car-log',
  templateUrl: './car-log.component.html',
  styleUrls: ['./car-log.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    RouterModule,
    MatSelectModule,
    MatOptionModule,
    MatIconModule
  ]
})
export class CarLogComponent implements OnInit {
  carId: string = '';
  entries: any[] = [];
  date = ''; odometer = ''; liters = ''; price = ''; location = ''; fuelType = ''; unitPrice = '';

  constructor(private http: HttpClient, private auth: AuthService, private router: Router, private route: ActivatedRoute) {}

  get headers() {
    return {
      headers: new HttpHeaders({ Authorization: `Bearer ${this.auth.getToken()}` })
    };
  }

  userName = '';

  ngOnInit() {
    this.userName = this.auth.getName();
    this.route.paramMap.subscribe(params => {
      const carId = params.get('id');
      if (!carId) return alert('Hiányzó carId!');

      this.carId = carId;
      this.fetch();
    });
  }

  fetch() {
    this.http.get<any[]>(`http://localhost:5000/api/fuel?carId=${this.carId}`, this.headers).subscribe({  
      next: data => this.entries = data,
      error: err => {
        if (err.error?.error === 'Érvénytelen token!') {
          this.auth.handleAuthError(err);
        } else {
          alert('Hiba a lekérdezéskor!'); 
        }
      }
    });
  }

  create() {
    this.http.post('http://localhost:5000/api/fuel', {
      carId: this.carId,
      date: this.date,
      odometer: this.odometerValue,
      liters: this.liters,
      unitPrice: this.unitPrice,
      location: this.location || undefined,    // opcionális
      fuelType: this.fuelType || undefined     // opcionális
    }, this.headers).subscribe({
      next: () => {
        this.resetEntry();
        this.fetch();
      },
      error: err => {
        if (err.error?.error === 'Érvénytelen token!') {
          this.auth.handleAuthError(err);
        } else {
        const msg = err.error?.errors?.[0]?.msg || err.error?.error || 'Ismeretlen hiba történt';
        alert('Hiba: ' + msg);
        }
      }
    });
  }

  delete(id: string) {
    this.http.delete(`http://localhost:5000/api/fuel/${id}`, this.headers).subscribe({
      next: () => this.fetch(),
      error: err => alert('Törlési hiba!')
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

  formatDate(event: any) {
    let value = event.target.value.replace(/\D/g, '').slice(0, 8); // csak szám, max 8 karakter
    const parts = [];

    if (value.length >= 4) parts.push(value.slice(0, 4));
    if (value.length >= 6) parts.push(value.slice(4, 6));
    if (value.length >= 7) parts.push(value.slice(6, 8));

    this.date = parts.join('-');
  }

  resetEntry() {
    this.date = '';
    this.odometer = '';
    this.liters = '';
    this.unitPrice = '';
    this.location = '';
    this.fuelType = '';
  }

  showAddForm = false;

  toggleAddForm() {
    this.showAddForm = !this.showAddForm;
  }

}
