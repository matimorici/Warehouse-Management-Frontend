import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrdenRetiroService, OrdenRetiroResponse } from '../../services/orden-retiro.service';

@Component({
  selector: 'app-ordenes-retiro',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './ordenes-retiro.html',
})
export class OrdenesRetiroComponent implements OnInit {
  orders: OrdenRetiroResponse[] = [];
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(private service: OrdenRetiroService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.errorMessage = '';
    this.service.list().subscribe({
      next: (data) => {
        this.orders = data;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        console.error('Error al cargar órdenes de retiro:', err);
        this.errorMessage = err.error?.message || 'No se pudieron cargar las órdenes de retiro';
      },
    });
  }

  deleteOrder(id: number): void {
    if (!confirm('¿Estás seguro de eliminar esta orden de retiro?')) {
      return;
    }

    this.service.delete(id).subscribe({
      next: () => {
        this.successMessage = 'Orden de retiro eliminada correctamente';
        this.loadOrders();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'No se pudo eliminar la orden de retiro';
      },
    });
  }

  getLineCount(order: OrdenRetiroResponse): number {
    return order.lineasRetiro?.length ?? 0;
  }
}
