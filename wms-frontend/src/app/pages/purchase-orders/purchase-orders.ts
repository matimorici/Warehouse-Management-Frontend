import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PurchaseOrderInfo, PurchaseOrderService } from '../../services/purchase-order.service';
import { ProviderForm, ProviderService } from '../../services/provider.service';
import { PageTopbarComponent } from '../../shared/page-topbar';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog';

@Component({
  selector: 'app-purchase-orders',
  standalone: true,
  imports: [CommonModule, RouterLink, PageTopbarComponent, ConfirmDialogComponent],
  templateUrl: './purchase-orders.html',
})
export class PurchaseOrdersComponent implements OnInit {
  readonly orders = signal<PurchaseOrderInfo[]>([]);
  readonly providers = signal<ProviderForm[]>([]);
  readonly loading = signal(false);
  readonly errorMessage = signal('');
  readonly successMessage = signal('');
  readonly listMessage = signal('');
  readonly listError = signal(false);
  readonly pendingDeleteId = signal<number | null>(null);

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
      next: (providers) => this.providers.set(providers),
      error: (err) => console.error('Error al cargar proveedores:', err),
    });
  }

  loadOrders(): void {
    this.loading.set(true);
    this.listMessage.set('');
    this.listError.set(false);

    this.purchaseOrderService.list().subscribe({
      next: (orders) => {
        this.orders.set(orders);
        this.loading.set(false);

        if (orders.length === 0) {
          this.listMessage.set('No hay órdenes de compra registradas');
        }
      },
      error: (err) => {
        this.loading.set(false);
        console.error('Error al cargar órdenes de compra:', err);
        this.listMessage.set(err.error?.error || 'No se pudieron cargar las órdenes de compra');
        this.listError.set(true);
      },
    });
  }

  providerName(id: number): string {
    const provider = this.providers().find((p) => p.idProveedor === id);
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
    this.pendingDeleteId.set(id);
  }

  confirmDelete(): void {
    const id = this.pendingDeleteId();
    if (id === null) return;
    this.pendingDeleteId.set(null);
    this.purchaseOrderService.delete(id).subscribe({
      next: () => {
        this.successMessage.set('Orden de compra eliminada correctamente');
        this.loadOrders();
      },
      error: (err) => {
        console.error('Error al eliminar orden de compra:', err);
        this.errorMessage.set(err.error?.error || 'No se pudo eliminar la orden de compra');
      },
    });
  }

  cancelDelete(): void {
    this.pendingDeleteId.set(null);
  }
}
