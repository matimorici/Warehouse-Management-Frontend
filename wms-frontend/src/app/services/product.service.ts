import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, timeout, catchError } from 'rxjs';
import { API_BASE_URL } from '../shared/api-config';

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

export interface StockInfo {
  idProducto: number;
  fechaHora: string;
  cantidadDisponible: number;
  cantidadPendiente: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private get apiUrl(): string {
    return API_BASE_URL;
  }

  constructor(private http: HttpClient) {}

  createProduct(data: ProductForm): Observable<any> {
    return this.http.post(`${this.apiUrl}/productos`, data);
  }

  updateProduct(id: number, data: ProductForm): Observable<any> {
    return this.http.put(`${this.apiUrl}/productos/${id}`, data);
  }

  getById(id: number): Observable<ProductInfo> {
    return this.http.get<ProductInfo>(`${this.apiUrl}/productos/${id}`).pipe(timeout(15000));
  }

  getStock(id: number): Observable<StockInfo> {
    return this.http.get<StockInfo>(`${this.apiUrl}/productos/${id}/stock`).pipe(timeout(15000));
  }

  updateStock(
    id: number,
    data: { cantidadDisponible: number; cantidadPendiente: number },
  ): Observable<StockInfo> {
    return this.http
      .put<StockInfo>(`${this.apiUrl}/productos/${id}/stock`, data)
      .pipe(timeout(15000));
  }

  barcodeUrl(id: number): string {
    return `${this.apiUrl}/productos/${id}/barcode`;
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
