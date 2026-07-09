import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ProductoInfo {
  idProducto: number;
  nombreProducto: string;
  codigoBarras: string;
}

export interface LineaRetiroCreate {
  idProducto: number;
  cantidad: number;
}

export interface OrdenRetiroCreate {
  idUsuario: number;
  lineasRetiro: LineaRetiroCreate[];
}

export interface LineaRetiroResponse {
  idProducto: number;
  cantidad: number;
  producto?: ProductoInfo;
}

export interface OrdenRetiroResponse {
  idOrdenRetiro: number;
  fechaHora: string;
  idUsuario: number;
  lineasRetiro: LineaRetiroResponse[] | null;
}

@Injectable({
  providedIn: 'root',
})
export class OrdenRetiroService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  create(data: OrdenRetiroCreate): Observable<OrdenRetiroResponse> {
    return this.http.post<OrdenRetiroResponse>(`${this.apiUrl}/ordenes-retiro`, data);
  }

  list(): Observable<OrdenRetiroResponse[]> {
    return this.http.get<OrdenRetiroResponse[]>(`${this.apiUrl}/ordenes-retiro`);
  }

  getById(id: number): Observable<OrdenRetiroResponse> {
    return this.http.get<OrdenRetiroResponse>(`${this.apiUrl}/ordenes-retiro/${id}`);
  }

  update(id: number, data: OrdenRetiroCreate): Observable<OrdenRetiroResponse> {
    return this.http.put<OrdenRetiroResponse>(`${this.apiUrl}/ordenes-retiro/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/ordenes-retiro/${id}`);
  }
}
