import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, timeout, catchError } from 'rxjs';
import { API_BASE_URL } from '../shared/api-config';

export interface SupplierRatingInfo {
  id: number;
  dateTime: string;
  idSupplier: number;
  deliveryTime: number | null;
  deliveryMethod: string;
  priceQualityRatio: string;
}

export interface SupplierRatingForm {
  idSupplier: number | null;
  deliveryTime: number | null;
  deliveryMethod: string;
  priceQualityRatio: string;
}

@Injectable({
  providedIn: 'root',
})
export class SupplierRatingService {
  private get apiUrl(): string {
    return API_BASE_URL;
  }

  constructor(private http: HttpClient) {}

  private applyTimeout<T>(obs: Observable<T>): Observable<T> {
    return obs.pipe(
      timeout(15000),
      catchError((err) => {
        console.error('Error /api/valoraciones-proveedor:', err);
        throw err;
      }),
    );
  }

  list(idSupplier?: number | null): Observable<SupplierRatingInfo[]> {
    let params = new HttpParams();

    if (idSupplier) {
      params = params.set('idSupplier', String(idSupplier));
    }

    return this.applyTimeout(
      this.http.get<SupplierRatingInfo[]>(`${this.apiUrl}/valoraciones-proveedor`, { params }),
    );
  }

  create(data: SupplierRatingForm): Observable<SupplierRatingInfo> {
    return this.applyTimeout(
      this.http.post<SupplierRatingInfo>(`${this.apiUrl}/valoraciones-proveedor`, data),
    );
  }

  update(id: number, data: SupplierRatingForm): Observable<SupplierRatingInfo> {
    return this.applyTimeout(
      this.http.put<SupplierRatingInfo>(`${this.apiUrl}/valoraciones-proveedor/${id}`, data),
    );
  }

  delete(id: number): Observable<void> {
    return this.applyTimeout(this.http.delete<void>(`${this.apiUrl}/valoraciones-proveedor/${id}`));
  }
}
