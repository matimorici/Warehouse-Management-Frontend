import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, timeout, catchError } from 'rxjs';
import { API_BASE_URL } from '../shared/api-config';

export interface PhysicalMovementInfo {
  idProduct: number;
  dateTime: string;
  idLocationFrom: number | null;
  idLocationTo: number;
  idUser: number;
}

export interface PhysicalMovementForm {
  idProduct: number | null;
  idLocationFrom: number | null;
  idLocationTo: number | null;
  idUser: number | null;
}

export interface PhysicalMovementFilters {
  idProduct?: number | null;
  idUser?: number | null;
  from?: string | null;
  to?: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class PhysicalMovementService {
  private get apiUrl(): string {
    return API_BASE_URL;
  }

  constructor(private http: HttpClient) {}

  private applyTimeout<T>(obs: Observable<T>): Observable<T> {
    return obs.pipe(
      timeout(15000),
      catchError((err) => {
        console.error('Error /api/movimientos-fisicos:', err);
        throw err;
      }),
    );
  }

  list(filters: PhysicalMovementFilters = {}): Observable<PhysicalMovementInfo[]> {
    let params = new HttpParams();

    if (filters.idProduct) {
      params = params.set('idProduct', String(filters.idProduct));
    }
    if (filters.idUser) {
      params = params.set('idUser', String(filters.idUser));
    }
    if (filters.from) {
      params = params.set('from', filters.from);
    }
    if (filters.to) {
      params = params.set('to', filters.to);
    }

    return this.applyTimeout(
      this.http.get<PhysicalMovementInfo[]>(`${this.apiUrl}/movimientos-fisicos`, { params }),
    );
  }

  create(data: PhysicalMovementForm): Observable<PhysicalMovementInfo> {
    return this.applyTimeout(
      this.http.post<PhysicalMovementInfo>(`${this.apiUrl}/movimientos-fisicos`, data),
    );
  }
}
