import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, timeout, catchError } from 'rxjs';
import { API_BASE_URL } from '../shared/api-config';

export type PurchaseOrderStatus = 'PENDIENTE' | 'RECIBIDA' | 'CANCELADA';

export interface PurchaseOrderLine {
  idProduct: number;
  amount: number;
}

export interface PurchaseOrderInfo {
  idPurchaseOrder: number;
  dateTime: string;
  idSupplier: number;
  status: PurchaseOrderStatus | string;
  lines: PurchaseOrderLine[] | null;
}

export interface PurchaseOrderForm {
  idSupplier: number | null;
  lines: { idProduct: number | null; amount: number }[];
}

@Injectable({
  providedIn: 'root',
})
export class PurchaseOrderService {
  private get apiUrl(): string {
    return API_BASE_URL;
  }

  constructor(private http: HttpClient) {}

  private applyTimeout<T>(obs: Observable<T>): Observable<T> {
    return obs.pipe(
      timeout(15000),
      catchError((err) => {
        console.error('Error /api/ordenes-compra:', err);
        throw err;
      }),
    );
  }

  list(): Observable<PurchaseOrderInfo[]> {
    return this.applyTimeout(this.http.get<PurchaseOrderInfo[]>(`${this.apiUrl}/ordenes-compra`));
  }

  getById(id: number): Observable<PurchaseOrderInfo> {
    return this.applyTimeout(
      this.http.get<PurchaseOrderInfo>(`${this.apiUrl}/ordenes-compra/${id}`),
    );
  }

  create(data: PurchaseOrderForm): Observable<PurchaseOrderInfo> {
    return this.applyTimeout(
      this.http.post<PurchaseOrderInfo>(`${this.apiUrl}/ordenes-compra`, data),
    );
  }

  update(id: number, data: PurchaseOrderForm): Observable<PurchaseOrderInfo> {
    return this.applyTimeout(
      this.http.put<PurchaseOrderInfo>(`${this.apiUrl}/ordenes-compra/${id}`, data),
    );
  }

  receive(id: number): Observable<PurchaseOrderInfo> {
    return this.applyTimeout(
      this.http.put<PurchaseOrderInfo>(`${this.apiUrl}/ordenes-compra/${id}/recibir`, {}),
    );
  }

  delete(id: number): Observable<void> {
    return this.applyTimeout(this.http.delete<void>(`${this.apiUrl}/ordenes-compra/${id}`));
  }
}
