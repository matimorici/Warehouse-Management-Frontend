import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { OrdenRetiroService, OrdenRetiroCreate, LineaRetiroCreate } from '../../services/orden-retiro.service';
import { ProductService, ProductInfo } from '../../services/product.service';
import { AuthService, UserInfo } from '../../services/auth.service';

interface LineaForm {
  idProducto: number | null;
  cantidad: number;
}

@Component({
  selector: 'app-orden-retiro-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './orden-retiro-form.html',
})
export class OrdenRetiroFormComponent implements OnInit {
  isEditMode = false;
  orderId: number | null = null;
  loadingOrder = false;

  form = {
    idUsuario: null as number | null,
    lineasRetiro: [] as LineaForm[],
  };

  users: UserInfo[] = [];
  products: ProductInfo[] = [];
  loadingUsers = false;
  loadingProducts = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private service: OrdenRetiroService,
    private productService: ProductService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.orderId = Number(id);
      this.loadOrder(this.orderId);
    }

    this.loadUsers();
    this.loadProducts();
  }

  loadOrder(id: number): void {
    this.loadingOrder = true;
    this.service.getById(id).subscribe({
      next: (order) => {
        this.form.idUsuario = order.idUsuario;
        this.form.lineasRetiro = (order.lineasRetiro ?? []).map((line) => ({
          idProducto: line.idProducto,
          cantidad: line.cantidad,
        }));
        this.loadingOrder = false;
      },
      error: (err) => {
        this.loadingOrder = false;
        console.error('Error al cargar orden:', err);
        this.errorMessage = err.error?.message || 'No se pudo cargar la orden de retiro';
      },
    });
  }

  loadUsers(): void {
    this.loadingUsers = true;
    this.authService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.loadingUsers = false;
      },
      error: (err) => {
        this.loadingUsers = false;
        console.error('Error al cargar usuarios:', err);
      },
    });
  }

  loadProducts(): void {
    this.loadingProducts = true;
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.loadingProducts = false;
      },
      error: (err) => {
        this.loadingProducts = false;
        console.error('Error al cargar productos:', err);
      },
    });
  }

  getProduct(productId: number | null): ProductInfo | undefined {
    if (!productId) return undefined;
    return this.products.find((p) => p.idProducto === productId);
  }

  isStockWarning(line: LineaForm): boolean {
    if (!line.idProducto || line.cantidad < 1) return false;
    const product = this.getProduct(line.idProducto);
    return product !== undefined && line.cantidad > product.cantidadDisponible;
  }

  addLine(): void {
    this.form.lineasRetiro.push({ idProducto: null, cantidad: 1 });
  }

  removeLine(index: number): void {
    this.form.lineasRetiro.splice(index, 1);
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.form.idUsuario) {
      this.errorMessage = 'Tenés que seleccionar un usuario';
      return;
    }

    if (this.form.lineasRetiro.length === 0) {
      this.errorMessage = 'Agregá al menos una línea de retiro';
      return;
    }

    const invalidLines = this.form.lineasRetiro.filter((l) => !l.idProducto || l.cantidad < 1);
    if (invalidLines.length > 0) {
      this.errorMessage = 'Completá todos los productos y cantidades (mínimo 1)';
      return;
    }

    const dto: OrdenRetiroCreate = {
      idUsuario: this.form.idUsuario,
      lineasRetiro: this.form.lineasRetiro.map(
        (l): LineaRetiroCreate => ({
          idProducto: l.idProducto!,
          cantidad: l.cantidad,
        }),
      ),
    };

    const request = this.isEditMode && this.orderId
      ? this.service.update(this.orderId, dto)
      : this.service.create(dto);

    request.subscribe({
      next: () => {
        this.successMessage = this.isEditMode
          ? 'Orden de retiro actualizada correctamente'
          : 'Orden de retiro creada correctamente';
        this.loadProducts();
        setTimeout(() => this.router.navigate(['/ordenes-retiro']), 1500);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'No se pudo guardar la orden de retiro';
      },
    });
  }
}
