import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { AuthService } from '../../../../services/auth.service';
import { CarService } from '../../../../services/car.service';


@Component({
  selector: 'app-car-list',
  standalone: true,
  templateUrl: './car-list.component.html',
  styleUrls: ['./car-list.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class CarListComponent implements OnInit {
  addCarForm!: FormGroup;
  cars: any[] = [];
  isAuthenticated = false;

  constructor(
    private carService: CarService, 
    private router: Router, 
    private auth: AuthService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    const token = this.auth.getToken();
    if (!token) {
      alert('A bejelentkezésed lejárt! Kérlek jelentkezz be újra!');
      this.auth.logout();
      return;
    }

    this.isAuthenticated = true;
    this.fetchCars();

    this.addCarForm = this.fb.group({
      brand: ['', Validators.required],
      model: ['', Validators.required],
      year: ['', Validators.pattern(/^\d{4}$/)],
      engine: [''],
      plate: [
        '',
        Validators.pattern(
          /^(?:[A-Z]{3}-?[0-9]{3}|[A-Z]{2} [A-Z]{2}-[0-9]{3})$/
        )
      ]
    });
  }

  fetchCars() {
    this.carService.getCars().subscribe({
      next: data => this.cars = data,
      error: err => {
        if (err.error?.error === 'Érvénytelen token!') {
          this.auth.handleAuthError(err);
        } else {
          alert('Hiba az autók lekérdezésekor!');
          this.auth.logout();
        }
      }
    });
  }

  addCar() {
    if (this.addCarForm.invalid) {
      this.addCarForm.markAllAsTouched();
      return;
    }
    this.carService.addCar(this.addCarForm.value)
      .subscribe({
        next: () => {
          this.addCarForm.reset();
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
      error: () => alert('Hiba az autó törlésekor!')
    });
  }

  selectCar(id: string) {
    this.router.navigate(['account', 'cars', id]);
  }

  formatYearInput(event: any) {
    let raw = event.target.value.replace(/\D/g, '').slice(0, 4);
    this.addCarForm.get('year')!.setValue(raw, { emitEvent: false });
  }

  showAddForm = false;

  toggleAddForm() {
    this.showAddForm = !this.showAddForm;
  }

  formatPlateInput(event: any) {
    let raw = (event.target.value || '')
      .replace(/[^A-Z0-9]/gi, '')
      .toUpperCase();

    raw = raw.slice(0, 7);

    let formatted = raw;
    if (raw.length === 6) {
      // régi formátum: ABC123 --> ABC-123
      formatted = `${raw.slice(0, 3)}-${raw.slice(3)}`;
    } else if (raw.length === 7) {
      // új formátum: AABB123 --> AA BB-123
      formatted = `${raw.slice(0, 2)} ${raw.slice(2, 4)}-${raw.slice(4)}`;
    }

    this.addCarForm.get('plate')!
      .setValue(formatted, { emitEvent: false });
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

}
