import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { SupplierRatingsComponent } from './supplier-ratings';

describe('SupplierRatingsComponent', () => {
  let component: SupplierRatingsComponent;
  let fixture: ComponentFixture<SupplierRatingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierRatingsComponent],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(SupplierRatingsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
