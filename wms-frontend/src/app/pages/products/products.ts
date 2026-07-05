import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductForm, ProductService } from '../../services/product.service';
import { ProviderForm, ProviderService } from '../../services/provider.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './products.html',
})
export class ProductsComponent {
  form: ProductForm = {
    id_producto: '',
    nombre_productos: '',
    descripcion_producto: '',
    codigo_barras: '',
    id_proveedor: '',
  };

  providers: ProviderForm[] = [];
  loadingProviders = false;
  errorMessage = '';
  successMessage = '';
  providerLoadMessage = '';

  constructor(
    private productService: ProductService,
    private providerService: ProviderService,
  ) {}

  ngOnInit(): void {
    this.loadProviders();
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
        this.providerLoadMessage = err.error?.message || 'No se pudieron cargar los proveedores';
      },
    });
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    this.productService.createProduct(this.form).subscribe({
      next: (res) => {
        this.successMessage = 'Producto cargado correctamente';
        this.form = {
          id_producto: '',
          nombre_productos: '',
          descripcion_producto: '',
          codigo_barras: '',
          id_proveedor: '',
        };
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'No se pudo cargar el producto';
      },
    });
  }
}
