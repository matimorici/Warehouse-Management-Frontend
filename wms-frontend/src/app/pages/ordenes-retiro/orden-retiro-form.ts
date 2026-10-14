import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {
  OrdenRetiroService,
  OrdenRetiroCreate,
  LineaRetiroCreate,
} from '../../services/orden-retiro.service';
import { ProductService, ProductInfo } from '../../services/product.service';
import { AuthService, UserInfo } from '../../services/auth.service';
import { PageTopbarComponent } from '../../shared/page-topbar';

interface LineaForm {
  idProducto: number | null;
  cantidad: number;
}

@Component({
  selector: 'app-orden-retiro-form',
  standalone: true,
  imports: [CommonModule, FormsModule, PageTopbarComponent],
  templateUrl: './orden-retiro-form.html',
})
export class OrdenRetiroFormComponent implements OnInit {
  isEditMode = false;
  orderId: number | null = null;
  readonly loadingOrder = signal(false);

  form = {
    idUsuario: null as number | null,
    lineasRetiro: [] as LineaForm[],
  };

  readonly users = signal<UserInfo[]>([]);
  readonly products = signal<ProductInfo[]>([]);
  readonly loadingUsers = signal(false);
  readonly loadingProducts = signal(false);
  readonly userLoadMessage = signal('');
  readonly productLoadMessage = signal('');
  readonly saving = signal(false);
  readonly errorMessage = signal('');
  readonly successMessage = signal('');

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
    this.loadingOrder.set(true);
    this.service.getById(id).subscribe({
      next: (order) => {
        this.form.idUsuario = order.idUsuario;
        this.form.lineasRetiro = (order.lineasRetiro ?? []).map((line) => ({
          idProducto: line.idProducto,
          cantidad: line.cantidad,
        }));
        this.loadingOrder.set(false);
      },
      error: (err) => {
        this.loadingOrder.set(false);
        console.error('Error al cargar orden:', err);
        this.errorMessage.set(err.error?.message || 'No se pudo cargar la orden de retiro');
      },
    });
  }

  loadUsers(): void {
    this.userLoadMessage.set('');
    this.loadingUsers.set(true);
    this.authService.getUsers().subscribe({
      next: (users) => {
        this.users.set(users);
        this.loadingUsers.set(false);
      },
      error: (err) => {
        this.loadingUsers.set(false);
        this.userLoadMessage.set(
          'No se pudieron cargar los usuarios. Reintentá la carga para continuar.',
        );
        console.error('Error al cargar usuarios:', err);
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

  getProduct(productId: number | null): ProductInfo | undefined {
    if (!productId) return undefined;
    return this.products().find((p) => p.idProducto === productId);
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

    if (!this.form.idUsuario) {
      this.errorMessage.set('Tenés que seleccionar un usuario');
      return;
    }

    if (this.form.lineasRetiro.length === 0) {
      this.errorMessage.set('Agregá al menos una línea de retiro');
      return;
    }

    const invalidLines = this.form.lineasRetiro.filter((l) => !l.idProducto || l.cantidad < 1);
    if (invalidLines.length > 0) {
      this.errorMessage.set('Completá todos los productos y cantidades (mínimo 1)');
      return;
    }

    const dto: OrdenRetiroCreate = {
      idUsuario: this.form.idUsuario,
      lineasRetiro: this.form.lineasRetiro.map((l): LineaRetiroCreate => ({
        idProducto: l.idProducto!,
        cantidad: l.cantidad,
      })),
    };

    const request =
      this.isEditMode && this.orderId
        ? this.service.update(this.orderId, dto)
        : this.service.create(dto);

    this.saving.set(true);
    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.successMessage.set(
          this.isEditMode
            ? 'Orden de retiro actualizada correctamente'
            : 'Orden de retiro creada correctamente',
        );
        this.loadProducts();
        setTimeout(() => this.router.navigate(['/ordenes-retiro']), 1500);
      },
      error: (err) => {
        this.saving.set(false);
        this.errorMessage.set(err.error?.message || 'No se pudo guardar la orden de retiro');
      },
    });
  }
}
