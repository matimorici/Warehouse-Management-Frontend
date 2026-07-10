import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductForm, ProductInfo, ProductService } from '../../services/product.service';
import { ProviderForm, ProviderService } from '../../services/provider.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
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
  products: ProductInfo[] = [];
  providers: ProviderForm[] = [];
  loadingProviders = false;
  loadingProducts = false;
  errorMessage = '';
  successMessage = '';
  providerLoadMessage = '';
  productsLoadMessage = '';

  constructor(
    private productService: ProductService,
    private providerService: ProviderService,
  ) {}

  ngOnInit(): void {
    this.loadProviders();
    this.loadProducts();
  }

  loadProviders(): void {
    this.loadingProviders = true;
    this.providerLoadMessage = '';

    this.providerService.getProviders().subscribe({
      next: (providers) => {
        this.providers = providers;
        this.loadingProviders = false;

        if (providers.length === 0) {
          this.providerLoadMessage = 'No hay proveedores cargados';
        }
      },
      error: (err) => {
        this.loadingProviders = false;
        console.error('Error al cargar proveedores:', err);
        this.providerLoadMessage = err.error?.message || 'No se pudieron cargar los proveedores';
      },
    });
  }

  loadProducts(): void {
    this.loadingProducts = true;
    this.productsLoadMessage = '';

    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.loadingProducts = false;

        if (products.length === 0) {
          this.productsLoadMessage = 'No hay productos cargados';
        }
      },
      error: (err) => {
        this.loadingProducts = false;
        console.error('Error al cargar productos:', err);
        this.productsLoadMessage = err.error?.message || 'No se pudieron cargar los productos';
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
    this.errorMessage = '';
    this.successMessage = '';

    if (this.editingProduct) {
      this.productService.updateProduct(this.editingProduct.idProducto, this.form).subscribe({
        next: () => {
          this.successMessage = 'Producto actualizado correctamente';
          this.cancelEdit();
          this.loadProducts();
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'No se pudo actualizar el producto';
        },
      });
    } else {
      this.productService.createProduct(this.form).subscribe({
        next: () => {
          this.successMessage = 'Producto cargado correctamente';
          this.resetForm();
          this.loadProducts();
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'No se pudo cargar el producto';
        },
      });
    }
  }
}
