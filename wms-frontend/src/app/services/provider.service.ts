import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, timeout, catchError } from 'rxjs';
import { API_BASE_URL } from '../shared/api-config';

export interface ProviderForm {
  idProveedor?: number;
  cuit: string;
  razonSocial: string;
  telefono: string;
  mail: string;
  direccion: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProviderService {
  private get apiUrl(): string {
    return API_BASE_URL;
  }

  constructor(private http: HttpClient) {}

  createProvider(data: ProviderForm): Observable<any> {
    return this.http.post(`${this.apiUrl}/proveedores`, data);
  }

  updateProvider(id: number, data: ProviderForm): Observable<any> {
    return this.http.put(`${this.apiUrl}/proveedores/${id}`, data);
  }

  deleteProvider(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/proveedores/${id}`);
  }

  getProviders(): Observable<ProviderForm[]> {
    return this.http.get<unknown>(`${this.apiUrl}/proveedores`).pipe(
      timeout(15000),
      map((response) => this.normalizeProviders(response)),
      catchError((err) => {
        console.error('Error /api/proveedores:', err);
        throw err;
      }),
    );
  }

  private normalizeProviders(response: unknown): ProviderForm[] {
    if (Array.isArray(response)) {
      return response as ProviderForm[];
    }

    if (this.isRecord(response) && Array.isArray(response['content'])) {
      return response['content'] as ProviderForm[];
    }

    return [];
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
  }
}
