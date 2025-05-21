import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';

import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

import { environment } from '../../../../../environments/environment';
import { AuthService } from '../../../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-car-log',
  templateUrl: './car-log.component.html',
  styleUrls: ['./car-log.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
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
  car: any = {};
  userName = '';
  today = new Date().toISOString().split('T')[0];

  entries: any[] = [];
  entryForm!: FormGroup;

  constructor(
    private http: HttpClient, 
    private auth: AuthService, 
    private router: Router, 
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.entryForm = this.fb.group({
      date: [
        '',
        [Validators.required, Validators.pattern(/^\d{4}-\d{2}-\d{2}$/)]
      ],
      odometer: ['', Validators.required],
      liters: ['', Validators.required],
      unitPrice: ['', Validators.required],
      location: [''],
      fuelType: ['']
    });

    this.userName = this.auth.getName();
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
        alert('Hiányzó vagy érvénytelen azonosító!');
        this.router.navigate(['/account']);
        return;
      }

      this.carId = id;
      this.fetch();
    });
  }

  fetch() {
    this.http
      .get<any[]>(`${environment.apiUrl}/refuel?carId=${this.carId}`)
      .subscribe({  
        next: data => this.entries = data,
        error: err => {
          if (err.error?.error === 'Érvénytelen token!') {
            this.auth.handleAuthError(err);
          } else {
            alert('Hiba a lekérdezéskor!'); 
          }
        }
      });

    this.http
      .get<any>(`${environment.apiUrl}/cars/${this.carId}`)
      .subscribe({ next: c => (this.car = c) });
  }

  create() {
    if (this.entryForm.invalid) {
      this.entryForm.markAllAsTouched();
      return;
    }
    const { date, odometer, liters, unitPrice, location, fuelType } =
      this.entryForm.value;
    this.http
      .post(`${environment.apiUrl}/refuel`, {
        carId: this.carId,
        date,
        odometer: Number(odometer.replace(/\D/g, '')) || 0,
        liters,
        unitPrice,
        location: location || undefined,
        fuelType: fuelType || undefined
      })
      .subscribe({
        next: () => {
          this.resetEntry();
          this.fetch();
        },
        error: err => {
          if (err.error?.error === 'Érvénytelen token!') {
            this.auth.handleAuthError(err);
          } else {
            const msg =
              err.error?.errors?.[0]?.msg || err.error?.error || 'Ismeretlen hiba történt';
            alert('Hiba: ' + msg);
          }
        }
      });
  }

  delete(id: string) {
    this.http
      .delete(`${environment.apiUrl}/refuel/${id}`)
      .subscribe({ next: () => this.fetch(), error: () => alert('Törlési hiba!') });
  }

  resetEntry() {
    this.entryForm.reset();
  }

  formatOdometerInput(value: string) {
    const numeric = value.replace(/\D/g, '');
    this.entryForm
      .get('odometer')!
      .setValue(Number(numeric).toLocaleString('hu-HU'), { emitEvent: false });
  }

  formatDateInput(event: any) {
    const raw = event.target.value.replace(/\D/g, '').slice(0, 8);

    let formatted = raw;
    if (raw.length > 4 && raw.length <= 6) {
      formatted = `${raw.slice(0, 4)}-${raw.slice(4)}`;
    }
    else if (raw.length > 6) {
      formatted = `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6)}`;
    }
    
    this.entryForm.get('date')!
      .setValue(formatted, { emitEvent: false });
  }


  showAddForm = false;

  toggleAddForm() {
    this.showAddForm = !this.showAddForm;
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }

}
