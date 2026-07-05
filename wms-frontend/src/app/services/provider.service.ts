import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ProviderForm {
  id_proveedor: string;
  cuit: string;
  razon_social: string;
  telefono: string;
  mail: string;
  direccion: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProviderService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  createProvider(data: ProviderForm): Observable<any> {
    return this.http.post(`${this.apiUrl}/proveedores`, data);
  }

  getProviders(): Observable<ProviderForm[]> {
    return this.http.get<unknown>(`${this.apiUrl}/proveedores`).pipe(map((response) => this.normalizeProviders(response)));
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
