import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { LocationsComponent } from './locations';

describe('LocationsComponent', () => {
  let component: LocationsComponent;
  let fixture: ComponentFixture<LocationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocationsComponent],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(LocationsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows a success message and reloads the list after creating a location', async () => {
    const httpMock = TestBed.inject(HttpTestingController);

    fixture.detectChanges();
    httpMock.expectOne('/api/ubicaciones').flush([]);

    component.form.name = 'Pasillo A';
    component.onSubmit();

    const create = httpMock.expectOne('/api/ubicaciones');
    expect(create.request.method).toBe('POST');
    create.flush({ id: 1, name: 'Pasillo A' });

    expect(component.successMessage).toBe('Ubicación creada correctamente');

    const reload = httpMock.expectOne('/api/ubicaciones');
    expect(reload.request.method).toBe('GET');
    reload.flush([{ id: 1, name: 'Pasillo A' }]);

    expect(component.locations).toEqual([{ id: 1, name: 'Pasillo A' }]);
    expect(component.loading).toBe(false);
    httpMock.verify();
  });
});
