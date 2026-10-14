import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrdenRetiroService, OrdenRetiroResponse } from '../../services/orden-retiro.service';
import { AuthService } from '../../services/auth.service';
import { PageTopbarComponent } from '../../shared/page-topbar';

@Component({
  selector: 'app-ordenes-retiro',
  standalone: true,
  imports: [CommonModule, RouterLink, PageTopbarComponent],
  templateUrl: './ordenes-retiro.html',
})
export class OrdenesRetiroComponent implements OnInit {
  readonly orders = signal<OrdenRetiroResponse[]>([]);
  readonly loading = signal(false);
  readonly errorMessage = signal('');
  readonly successMessage = signal('');

  constructor(
    private service: OrdenRetiroService,
    private authService: AuthService,
  ) {}

  get homeRoute(): string {
    return this.authService.getHomeRouteByRole(this.authService.getUserRole());
  }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading.set(true);
    this.errorMessage.set('');
    this.service.list().subscribe({
      next: (data) => {
        this.orders.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        console.error('Error al cargar órdenes de retiro:', err);
        this.errorMessage.set(err.error?.message || 'No se pudieron cargar las órdenes de retiro');
      },
    });
  }

  deleteOrder(id: number): void {
    if (!confirm('¿Estás seguro de eliminar esta orden de retiro?')) {
      return;
    }

    this.service.delete(id).subscribe({
      next: () => {
        this.successMessage.set('Orden de retiro eliminada correctamente');
        this.loadOrders();
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message || 'No se pudo eliminar la orden de retiro');
      },
    });
  }

  getLineCount(order: OrdenRetiroResponse): number {
    return order.lineasRetiro?.length ?? 0;
  }
}
