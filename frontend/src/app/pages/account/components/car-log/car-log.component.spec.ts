import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarLogComponent } from './car-log.component';

describe('CarLogComponent', () => {
  let component: CarLogComponent;
  let fixture: ComponentFixture<CarLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarLogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
