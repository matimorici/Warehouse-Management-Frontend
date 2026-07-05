import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ProductForm {
  id_producto: string;
  nombre_productos: string;
  descripcion_producto: string;
  codigo_barras: string;
  id_proveedor: string;
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
}
