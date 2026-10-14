import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductForm, ProductInfo, ProductService } from '../../services/product.service';
import { ProviderForm, ProviderService } from '../../services/provider.service';
import { PageTopbarComponent } from '../../shared/page-topbar';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, PageTopbarComponent],
  templateUrl: './products.html',
})
export class ProductsComponent implements OnInit {
  form: ProductForm = {
    nombreProducto: '',
    descripcionProducto: '',
    codigoBarras: '',
    idProveedor: null as unknown as number,
    origenCodigoBarras: 'FABRICANTE',
    cantidadDisponible: null as unknown as number,
    cantidadPendiente: null as unknown as number,
  };

  editingProduct: ProductInfo | null = null;
  readonly products = signal<ProductInfo[]>([]);
  readonly providers = signal<ProviderForm[]>([]);
  readonly loadingProviders = signal(false);
  readonly loadingProducts = signal(false);
  readonly errorMessage = signal('');
  readonly successMessage = signal('');
  readonly providerLoadMessage = signal('');
  readonly productsLoadMessage = signal('');

  constructor(
    private productService: ProductService,
    private providerService: ProviderService,
  ) {}

  ngOnInit(): void {
    this.loadProviders();
    this.loadProducts();
  }

  loadProviders(): void {
    this.loadingProviders.set(true);
    this.providerLoadMessage.set('');

    this.providerService.getProviders().subscribe({
      next: (providers) => {
        this.providers.set(providers);
        this.loadingProviders.set(false);

        if (providers.length === 0) {
          this.providerLoadMessage.set('No hay proveedores cargados');
        }
      },
      error: (err) => {
        this.loadingProviders.set(false);
        console.error('Error al cargar proveedores:', err);
        this.providerLoadMessage.set(err.error?.message || 'No se pudieron cargar los proveedores');
      },
    });
  }

  loadProducts(): void {
    this.loadingProducts.set(true);
    this.productsLoadMessage.set('');

    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products.set(products);
        this.loadingProducts.set(false);

        if (products.length === 0) {
          this.productsLoadMessage.set('No hay productos cargados');
        }
      },
      error: (err) => {
        this.loadingProducts.set(false);
        console.error('Error al cargar productos:', err);
        this.productsLoadMessage.set(err.error?.message || 'No se pudieron cargar los productos');
      },
    });
  }

  editProduct(product: ProductInfo): void {
    this.editingProduct = product;
    this.form = {
      nombreProducto: product.nombreProducto,
      descripcionProducto: product.descripcionProducto,
      codigoBarras: product.codigoBarras,
      idProveedor: product.idProveedor,
      origenCodigoBarras: product.origenCodigoBarras,
      cantidadDisponible: product.cantidadDisponible,
      cantidadPendiente: product.cantidadPendiente,
    };
  }

  cancelEdit(): void {
    this.editingProduct = null;
    this.resetForm();
  }

  private resetForm(): void {
    this.form = {
      nombreProducto: '',
      descripcionProducto: '',
      codigoBarras: '',
      idProveedor: null as unknown as number,
      origenCodigoBarras: 'FABRICANTE',
      cantidadDisponible: null as unknown as number,
      cantidadPendiente: null as unknown as number,
    };
  }

  onSubmit(): void {
    this.errorMessage.set('');
    this.successMessage.set('');

    if (this.editingProduct) {
      this.productService.updateProduct(this.editingProduct.idProducto, this.form).subscribe({
        next: () => {
          this.successMessage.set('Producto actualizado correctamente');
          this.cancelEdit();
          this.loadProducts();
        },
        error: (err) => {
          this.errorMessage.set(err.error?.message || 'No se pudo actualizar el producto');
        },
      });
    } else {
      this.productService.createProduct(this.form).subscribe({
        next: () => {
          this.successMessage.set('Producto cargado correctamente');
          this.resetForm();
          this.loadProducts();
        },
        error: (err) => {
          this.errorMessage.set(err.error?.message || 'No se pudo cargar el producto');
        },
      });
    }
  }
}
