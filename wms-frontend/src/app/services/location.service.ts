import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, timeout, catchError } from 'rxjs';
import { API_BASE_URL } from '../shared/api-config';

export interface LocationInfo {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private get apiUrl(): string {
    return API_BASE_URL;
  }

  constructor(private http: HttpClient) {}

  list(): Observable<LocationInfo[]> {
    return this.http.get<unknown>(`${this.apiUrl}/ubicaciones`).pipe(
      timeout(15000),
      map((response) => this.normalize(response)),
      catchError((err) => {
        console.error('Error /api/ubicaciones:', err);
        throw err;
      }),
    );
  }

  getById(id: number): Observable<LocationInfo> {
    return this.http.get<LocationInfo>(`${this.apiUrl}/ubicaciones/${id}`).pipe(timeout(15000));
  }

  create(data: { name: string }): Observable<LocationInfo> {
    return this.http.post<LocationInfo>(`${this.apiUrl}/ubicaciones`, data).pipe(timeout(15000));
  }

  update(id: number, data: { name: string }): Observable<LocationInfo> {
    return this.http
      .put<LocationInfo>(`${this.apiUrl}/ubicaciones/${id}`, data)
      .pipe(timeout(15000));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/ubicaciones/${id}`).pipe(timeout(15000));
  }

  private normalize(response: unknown): LocationInfo[] {
    if (Array.isArray(response)) {
      return response as LocationInfo[];
    }

    if (this.isRecord(response) && Array.isArray(response['content'])) {
      return response['content'] as LocationInfo[];
    }

    return [];
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
  }
}
