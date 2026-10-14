import { Component, OnInit } from '@angular/core';
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
  product: ProductInfo | null = null;
  stock: StockInfo | null = null;
  providers: ProviderForm[] = [];

  stockForm = {
    cantidadDisponible: 0,
    cantidadPendiente: 0,
  };

  loading = false;
  saving = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private productService: ProductService,
    private providerService: ProviderService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id || Number.isNaN(id)) {
      this.errorMessage = 'Producto inválido';
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
    if (!this.product) {
      return '—';
    }

    const provider = this.providers.find((p) => p.idProveedor === this.product?.idProveedor);
    return provider ? provider.razonSocial : `Proveedor #${this.product.idProveedor}`;
  }

  loadProduct(id: number): void {
    this.loading = true;
    this.productService.getById(id).subscribe({
      next: (product) => {
        this.product = product;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        console.error('Error al cargar producto:', err);
        this.errorMessage = err.error?.error || 'No se pudo cargar el producto';
      },
    });
  }

  loadStock(id: number): void {
    this.productService.getStock(id).subscribe({
      next: (stock) => {
        this.stock = stock;
        this.stockForm = {
          cantidadDisponible: stock.cantidadDisponible,
          cantidadPendiente: stock.cantidadPendiente,
        };
      },
      error: (err) => {
        console.error('Error al cargar stock:', err);
        this.errorMessage = err.error?.error || 'No se pudo cargar el stock';
      },
    });
  }

  loadProviders(): void {
    this.providerService.getProviders().subscribe({
      next: (providers) => (this.providers = providers),
      error: (err) => console.error('Error al cargar proveedores:', err),
    });
  }

  onSubmit(): void {
    if (!this.productId) {
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';
    this.saving = true;

    this.productService.updateStock(this.productId, this.stockForm).subscribe({
      next: (stock) => {
        this.stock = stock;
        this.stockForm = {
          cantidadDisponible: stock.cantidadDisponible,
          cantidadPendiente: stock.cantidadPendiente,
        };
        this.saving = false;
        this.successMessage = 'Stock actualizado correctamente';
      },
      error: (err) => {
        this.saving = false;
        this.errorMessage = err.error?.error || 'No se pudo actualizar el stock';
      },
    });
  }
}
