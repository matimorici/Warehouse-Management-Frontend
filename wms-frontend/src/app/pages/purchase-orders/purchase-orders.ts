import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PurchaseOrderInfo, PurchaseOrderService } from '../../services/purchase-order.service';
import { ProviderForm, ProviderService } from '../../services/provider.service';
import { PageTopbarComponent } from '../../shared/page-topbar';

@Component({
  selector: 'app-purchase-orders',
  standalone: true,
  imports: [CommonModule, RouterLink, PageTopbarComponent],
  templateUrl: './purchase-orders.html',
})
export class PurchaseOrdersComponent implements OnInit {
  orders: PurchaseOrderInfo[] = [];
  providers: ProviderForm[] = [];
  loading = false;
  errorMessage = '';
  successMessage = '';
  listMessage = '';

  constructor(
    private purchaseOrderService: PurchaseOrderService,
    private providerService: ProviderService,
  ) {}

  ngOnInit(): void {
    this.loadProviders();
    this.loadOrders();
  }

  loadProviders(): void {
    this.providerService.getProviders().subscribe({
      next: (providers) => (this.providers = providers),
      error: (err) => console.error('Error al cargar proveedores:', err),
    });
  }

  loadOrders(): void {
    this.loading = true;
    this.listMessage = '';

    this.purchaseOrderService.list().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.loading = false;

        if (orders.length === 0) {
          this.listMessage = 'No hay órdenes de compra registradas';
        }
      },
      error: (err) => {
        this.loading = false;
        console.error('Error al cargar órdenes de compra:', err);
        this.listMessage = err.error?.error || 'No se pudieron cargar las órdenes de compra';
      },
    });
  }

  providerName(id: number): string {
    const provider = this.providers.find((p) => p.idProveedor === id);
    return provider ? provider.razonSocial : `Proveedor #${id}`;
  }

  statusLabel(status: string): string {
    switch (status) {
      case 'PENDIENTE':
        return 'Pendiente';
      case 'RECIBIDA':
        return 'Recibida';
      case 'CANCELADA':
        return 'Cancelada';
      default:
        return status;
    }
  }

  statusClass(status: string): string {
    switch (status) {
      case 'PENDIENTE':
        return 'wms-status-pending';
      case 'RECIBIDA':
        return 'wms-status-ok';
      case 'CANCELADA':
        return 'wms-status-cancel';
      default:
        return 'wms-status-neutral';
    }
  }

  lineSummary(order: PurchaseOrderInfo): string {
    if (!order.lines || order.lines.length === 0) {
      return '—';
    }

    return `${order.lines.length} ${order.lines.length === 1 ? 'línea' : 'líneas'}`;
  }

  deleteOrder(id: number): void {
    if (!confirm('¿Estás seguro de eliminar esta orden de compra?')) {
      return;
    }

    this.purchaseOrderService.delete(id).subscribe({
      next: () => {
        this.successMessage = 'Orden de compra eliminada correctamente';
        this.loadOrders();
      },
      error: (err) => {
        console.error('Error al eliminar orden de compra:', err);
        this.errorMessage = err.error?.error || 'No se pudo eliminar la orden de compra';
      },
    });
  }
}
