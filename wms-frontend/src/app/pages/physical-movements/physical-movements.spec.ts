import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { PhysicalMovementsComponent } from './physical-movements';

describe('PhysicalMovementsComponent', () => {
  let component: PhysicalMovementsComponent;
  let fixture: ComponentFixture<PhysicalMovementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhysicalMovementsComponent],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(PhysicalMovementsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
