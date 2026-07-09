import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface ProductForm {
  id_producto: string;
  nombre_productos: string;
  descripcion_producto: string;
  codigo_barras: string;
  id_proveedor: string;
}

export interface ProductInfo {
  idProducto: number;
  nombreProducto: string;
  descripcionProducto: string;
  codigoBarras: string;
  idProveedor: number;
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

  getProducts(): Observable<ProductInfo[]> {
    return this.http.get<unknown>(`${this.apiUrl}/productos`).pipe(
      map((response) => this.normalizeProducts(response)),
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
