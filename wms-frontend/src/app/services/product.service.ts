import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, timeout, catchError } from 'rxjs';

export interface ProductForm {
  idProducto?: string;
  nombreProducto: string;
  descripcionProducto: string;
  codigoBarras?: string;
  idProveedor: number;
  origenCodigoBarras: string;
  cantidadDisponible?: number;
  cantidadPendiente?: number;
}

export interface ProductInfo {
  idProducto: number;
  nombreProducto: string;
  descripcionProducto: string;
  codigoBarras: string;
  idProveedor: number;
  origenCodigoBarras: string;
  cantidadDisponible: number;
  cantidadPendiente: number;
  stockFechaHora?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  createProduct(data: ProductForm): Observable<any> {
    return this.http.post(`${this.apiUrl}/productos`, data);
  }

  updateProduct(id: number, data: ProductForm): Observable<any> {
    return this.http.put(`${this.apiUrl}/productos/${id}`, data);
  }

  getProducts(): Observable<ProductInfo[]> {
    return this.http.get<unknown>(`${this.apiUrl}/productos`).pipe(
      timeout(15000),
      map((response) => this.normalizeProducts(response)),
      catchError((err) => {
        console.error('Error /api/productos:', err);
        throw err;
      }),
    );
  }

  private normalizeProducts(response: unknown): ProductInfo[] {
    if (Array.isArray(response)) {
      return response as ProductInfo[];
    }

    if (this.isRecord(response) && Array.isArray(response['content'])) {
      return response['content'] as ProductInfo[];
    }

    return [];
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
  }
}
