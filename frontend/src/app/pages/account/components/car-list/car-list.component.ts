import { Component, OnInit } from '@angular/core';
import { CarService } from '../../../../services/car.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../../services/auth.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-car-list',
  standalone: true,
  templateUrl: './car-list.component.html',
  styleUrls: ['./car-list.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class CarListComponent implements OnInit {
  cars: any[] = [];

  brand = '';
  model = '';
  year = '';
  engine = '';
  plate = '';

  constructor(private carService: CarService, private router: Router, private auth: AuthService) {}

  isAuthenticated = false;

  ngOnInit() {
    const token = this.auth.getToken();
    if (!token) {
      alert('A bejelentkezésed lejárt. Kérlek jelentkezz be újra.');
      this.auth.logout();
      return;
    }

    this.isAuthenticated = true;
    this.fetchCars();
  }

  fetchCars() {
    this.carService.getCars().subscribe({
      next: data => this.cars = data,
      error: err => {
        if (err.error?.error === 'Érvénytelen token!') {
          this.auth.handleAuthError(err);
        } else {
          alert('Hiba az autók lekérdezésekor!');
        }
      }
    });
  }

  addCar() {
    if (this.plate && !this.isValidPlate(this.plate)) {
      alert('Érvényes rendszámot adj meg!');
      return;
    }
    this.carService.addCar({
      brand: this.brand,
      model: this.model,
      year: Number(this.year),
      engine: this.engine || undefined,
      plate: this.plate || undefined
    }).subscribe({
      next: () => {
        this.resetForm();
        this.fetchCars();
      },
      error: err => {
        if (err.error?.error === 'Érvénytelen token!') {
          this.auth.handleAuthError(err);
        } else {
        const msg = err.error?.errors?.[0]?.msg || err.error?.error || 'Hiba az autó mentésekor!';
        alert(msg);
        }
      }
    });
  }

  deleteCar(id: string) {
    if (!confirm('Biztosan törölni szeretnéd?')) return;
    this.carService.deleteCar(id).subscribe({
      next: () => this.fetchCars(),
      error: err => alert('Hiba az autó törlésekor!')
    });
  }

  selectCar(id: string) {
    this.router.navigate(['account', 'cars', id]);
  }

  resetForm() {
    this.brand = '';
    this.model = '';
    this.year = '';
    this.engine = '';
    this.plate = '';
  }

  limitYearLength(event: any) {
    const input = event.target;
    if (input.value.length > 4) {
      input.value = input.value.slice(0, 4);
      this.year = input.value;
    }
  }

  showAddForm = false;

  toggleAddForm() {
    this.showAddForm = !this.showAddForm;
  }

  formatPlate(event: any) {
    let raw = event.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    if (raw.length === 6) {
      // régi formátum: ABC123 → ABC-123
      this.plate = `${raw.slice(0, 3)}-${raw.slice(3, 6)}`;
    } else if (raw.length === 7) {
      // új formátum: AABB123 → AA BB-123
      this.plate = `${raw.slice(0, 2)} ${raw.slice(2, 4)}-${raw.slice(4, 7)}`;
    } else {
      this.plate = raw;
    }
  }

  formatPlateDisplay(raw: string): string {
    raw = raw.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();

    if (raw.length === 6) {
      return `${raw.slice(0, 3)}-${raw.slice(3)}`;
    } else if (raw.length === 7) {
      return `${raw.slice(0, 2)} ${raw.slice(2, 4)}-${raw.slice(4)}`;
    }
    return raw;
  }

  isValidPlate(plate: string): boolean {
    const clean = plate.replace(/[^A-Z0-9]/gi, '').toUpperCase();

    const oldRegex = /^[A-Z]{3}[0-9]{3}$/;
    const newRegex = /^[A-Z]{4}[0-9]{3}$/;

    return oldRegex.test(clean) || newRegex.test(clean);
  }


}
