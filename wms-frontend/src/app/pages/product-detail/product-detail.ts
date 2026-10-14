import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProductInfo, ProductService, StockInfo } from '../../services/product.service';
import { ProviderForm, ProviderService } from '../../services/provider.service';
import { PageTopbarComponent } from '../../shared/page-topbar';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, PageTopbarComponent],
  templateUrl: './product-detail.html',
})
export class ProductDetailComponent implements OnInit {
  productId: number | null = null;
  readonly product = signal<ProductInfo | null>(null);
  readonly stock = signal<StockInfo | null>(null);
  readonly providers = signal<ProviderForm[]>([]);

  stockForm = {
    cantidadDisponible: 0,
    cantidadPendiente: 0,
  };

  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly errorMessage = signal('');
  readonly successMessage = signal('');

  constructor(
    private productService: ProductService,
    private providerService: ProviderService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id || Number.isNaN(id)) {
      this.errorMessage.set('Producto inválido');
      return;
    }

    this.productId = id;
    this.loadProduct(id);
    this.loadStock(id);
    this.loadProviders();
  }

  get barcodeUrl(): string {
    return this.productId ? this.productService.barcodeUrl(this.productId) : '';
  }

  get providerName(): string {
    const product = this.product();
    if (!product) {
      return '—';
    }

    const provider = this.providers().find((p) => p.idProveedor === product.idProveedor);
    return provider ? provider.razonSocial : `Proveedor #${product.idProveedor}`;
  }

  loadProduct(id: number): void {
    this.loading.set(true);
    this.productService.getById(id).subscribe({
      next: (product) => {
        this.product.set(product);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        console.error('Error al cargar producto:', err);
        this.errorMessage.set(err.error?.error || 'No se pudo cargar el producto');
      },
    });
  }

  loadStock(id: number): void {
    this.productService.getStock(id).subscribe({
      next: (stock) => {
        this.stock.set(stock);
        this.stockForm = {
          cantidadDisponible: stock.cantidadDisponible,
          cantidadPendiente: stock.cantidadPendiente,
        };
      },
      error: (err) => {
        console.error('Error al cargar stock:', err);
        this.errorMessage.set(err.error?.error || 'No se pudo cargar el stock');
      },
    });
  }

  loadProviders(): void {
    this.providerService.getProviders().subscribe({
      next: (providers) => this.providers.set(providers),
      error: (err) => console.error('Error al cargar proveedores:', err),
    });
  }

  onSubmit(): void {
    if (!this.productId) {
      return;
    }

    this.errorMessage.set('');
    this.successMessage.set('');
    this.saving.set(true);

    this.productService.updateStock(this.productId, this.stockForm).subscribe({
      next: (stock) => {
        this.stock.set(stock);
        this.stockForm = {
          cantidadDisponible: stock.cantidadDisponible,
          cantidadPendiente: stock.cantidadPendiente,
        };
        this.saving.set(false);
        this.successMessage.set('Stock actualizado correctamente');
      },
      error: (err) => {
        this.saving.set(false);
        this.errorMessage.set(err.error?.error || 'No se pudo actualizar el stock');
      },
    });
  }
}
