import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  PurchaseOrderForm,
  PurchaseOrderInfo,
  PurchaseOrderService,
} from '../../services/purchase-order.service';
import { ProductInfo, ProductService } from '../../services/product.service';
import { ProviderForm, ProviderService } from '../../services/provider.service';
import { PageTopbarComponent } from '../../shared/page-topbar';

@Component({
  selector: 'app-purchase-order-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, PageTopbarComponent],
  templateUrl: './purchase-order-form.html',
})
export class PurchaseOrderFormComponent implements OnInit {
  isEditMode = false;
  orderId: number | null = null;
  readonly order = signal<PurchaseOrderInfo | null>(null);

  form: PurchaseOrderForm = {
    idSupplier: null,
    lines: [],
  };

  readonly providers = signal<ProviderForm[]>([]);
  readonly products = signal<ProductInfo[]>([]);

  readonly loadingOrder = signal(false);
  readonly loadingProviders = signal(false);
  readonly loadingProducts = signal(false);
  readonly providerLoadMessage = signal('');
  readonly productLoadMessage = signal('');
  readonly saving = signal(false);
  readonly showReceiveDialog = signal(false);

  readonly errorMessage = signal('');
  readonly successMessage = signal('');

  constructor(
    private purchaseOrderService: PurchaseOrderService,
    private productService: ProductService,
    private providerService: ProviderService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.isEditMode = true;
      this.orderId = Number(id);
      this.loadOrder(this.orderId);
    } else {
      this.addLine();
    }

    this.loadProviders();
    this.loadProducts();
  }

  get status(): string {
    return this.order()?.status ?? '';
  }

  get canReceive(): boolean {
    return this.isEditMode && this.status === 'PENDIENTE';
  }

  get isEditable(): boolean {
    return !this.isEditMode || this.status === 'PENDIENTE';
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

  loadOrder(id: number): void {
    this.loadingOrder.set(true);
    this.purchaseOrderService.getById(id).subscribe({
      next: (order) => {
        this.order.set(order);
        this.form = {
          idSupplier: order.idSupplier,
          lines: (order.lines ?? []).map((line) => ({
            idProduct: line.idProduct,
            amount: line.amount,
          })),
        };
        this.loadingOrder.set(false);
      },
      error: (err) => {
        this.loadingOrder.set(false);
        console.error('Error al cargar orden de compra:', err);
        this.errorMessage.set(err.error?.error || 'No se pudo cargar la orden de compra');
      },
    });
  }

  loadProviders(): void {
    this.providerLoadMessage.set('');
    this.loadingProviders.set(true);
    this.providerService.getProviders().subscribe({
      next: (providers) => {
        this.providers.set(providers);
        this.loadingProviders.set(false);
      },
      error: (err) => {
        this.loadingProviders.set(false);
        this.providerLoadMessage.set(
          'No se pudieron cargar los proveedores. Reintentá la carga para continuar.',
        );
        console.error('Error al cargar proveedores:', err);
      },
    });
  }

  loadProducts(): void {
    this.productLoadMessage.set('');
    this.loadingProducts.set(true);
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products.set(products);
        this.loadingProducts.set(false);
      },
      error: (err) => {
        this.loadingProducts.set(false);
        this.productLoadMessage.set(
          'No se pudieron cargar los productos. Reintentá la carga para continuar.',
        );
        console.error('Error al cargar productos:', err);
      },
    });
  }

  productName(id: number | null): string {
    if (!id) {
      return '—';
    }
    const product = this.products().find((p) => p.idProducto === id);
    return product ? product.nombreProducto : `Producto #${id}`;
  }

  addLine(): void {
    this.form.lines.push({ idProduct: null, amount: 1 });
  }

  removeLine(index: number): void {
    this.form.lines.splice(index, 1);
  }

  onSubmit(orderForm: NgForm): void {
    this.errorMessage.set('');
    this.successMessage.set('');

    if (orderForm.invalid) {
      orderForm.form.markAllAsTouched();
      this.errorMessage.set('Revisá los campos marcados antes de guardar.');
      requestAnimationFrame(() =>
        document.querySelector<HTMLElement>('form input:invalid, form select:invalid')?.focus(),
      );
      return;
    }

    if (!this.form.idSupplier) {
      this.errorMessage.set('Tenés que seleccionar un proveedor');
      return;
    }

    if (this.form.lines.length === 0) {
      this.errorMessage.set('Agregá al menos una línea de producto');
      return;
    }

    const invalidLines = this.form.lines.filter((l) => !l.idProduct || l.amount < 1);
    if (invalidLines.length > 0) {
      this.errorMessage.set('Completá todos los productos y cantidades (mínimo 1)');
      return;
    }

    this.saving.set(true);

    const request =
      this.isEditMode && this.orderId
        ? this.purchaseOrderService.update(this.orderId, this.form)
        : this.purchaseOrderService.create(this.form);

    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.successMessage.set(
          this.isEditMode
            ? 'Orden de compra actualizada correctamente'
            : 'Orden de compra creada correctamente',
        );
        setTimeout(() => this.router.navigate(['/ordenes-compra']), 1200);
      },
      error: (err) => {
        this.saving.set(false);
        console.error('Error al guardar orden de compra:', err);
        this.errorMessage.set(err.error?.error || 'No se pudo guardar la orden de compra');
      },
    });
  }

  openReceiveDialog(): void {
    this.showReceiveDialog.set(true);
  }

  cancelReceive(): void {
    this.showReceiveDialog.set(false);
  }

  confirmReceive(): void {
    if (!this.orderId) {
      return;
    }

    this.errorMessage.set('');
    this.successMessage.set('');

    this.purchaseOrderService.receive(this.orderId).subscribe({
      next: (order) => {
        this.order.set(order);
        this.showReceiveDialog.set(false);
        this.successMessage.set('Orden recibida: el stock de los productos fue actualizado');
        this.loadProducts();
      },
      error: (err) => {
        this.showReceiveDialog.set(false);
        console.error('Error al recibir orden de compra:', err);
        this.errorMessage.set(err.error?.error || 'No se pudo recibir la orden de compra');
      },
    });
  }
}
