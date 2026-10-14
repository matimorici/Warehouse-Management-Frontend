import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  PhysicalMovementForm,
  PhysicalMovementInfo,
  PhysicalMovementService,
} from '../../services/physical-movement.service';
import { LocationInfo, LocationService } from '../../services/location.service';
import { ProductInfo, ProductService } from '../../services/product.service';
import { AuthService, UserInfo } from '../../services/auth.service';
import { PageTopbarComponent } from '../../shared/page-topbar';

@Component({
  selector: 'app-physical-movements',
  standalone: true,
  imports: [CommonModule, FormsModule, PageTopbarComponent],
  templateUrl: './physical-movements.html',
})
export class PhysicalMovementsComponent implements OnInit {
  readonly movements = signal<PhysicalMovementInfo[]>([]);
  readonly products = signal<ProductInfo[]>([]);
  readonly locations = signal<LocationInfo[]>([]);
  readonly users = signal<UserInfo[]>([]);

  filters = {
    idProduct: null as number | null,
    idUser: null as number | null,
    from: '',
    to: '',
  };

  form: PhysicalMovementForm = {
    idProduct: null,
    idLocationFrom: null,
    idLocationTo: null,
    idUser: null,
  };

  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly errorMessage = signal('');
  readonly successMessage = signal('');
  readonly listMessage = signal('');
  readonly userLoadMessage = signal('');
  readonly productLoadMessage = signal('');
  readonly locationLoadMessage = signal('');

  constructor(
    private movementService: PhysicalMovementService,
    private productService: ProductService,
    private locationService: LocationService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadLocations();
    this.loadUsers();
    this.loadMovements();

    const currentUserId = this.authService.getCurrentUserId();
    if (currentUserId) {
      this.form.idUser = currentUserId;
    }
  }

  private emptyForm(): PhysicalMovementForm {
    return {
      idProduct: null,
      idLocationFrom: null,
      idLocationTo: null,
      idUser: this.authService?.getCurrentUserId() ?? null,
    };
  }

  loadMovements(): void {
    this.loading.set(true);
    this.listMessage.set('');

    this.movementService
      .list({
        idProduct: this.filters.idProduct,
        idUser: this.filters.idUser,
        from: this.toIsoDateTime(this.filters.from),
        to: this.toIsoDateTime(this.filters.to),
      })
      .subscribe({
        next: (movements) => {
          this.movements.set(movements);
          this.loading.set(false);

          if (movements.length === 0) {
            this.listMessage.set('No hay movimientos para los filtros seleccionados');
          }
        },
        error: (err) => {
          this.loading.set(false);
          console.error('Error al cargar movimientos:', err);
          this.listMessage.set(err.error?.error || 'No se pudieron cargar los movimientos');
        },
      });
  }

  applyFilters(): void {
    this.loadMovements();
  }

  clearFilters(): void {
    this.filters = { idProduct: null, idUser: null, from: '', to: '' };
    this.loadMovements();
  }

  private toIsoDateTime(value: string): string | null {
    if (!value) {
      return null;
    }

    return value.length === 16 ? `${value}:00` : value;
  }

  loadProducts(): void {
    this.productLoadMessage.set('');
    this.productService.getProducts().subscribe({
      next: (products) => this.products.set(products),
      error: (err) => {
        console.error('Error al cargar productos:', err);
        this.productLoadMessage.set('No se pudieron cargar los productos. Reintentá la carga.');
      },
    });
  }

  loadLocations(): void {
    this.locationLoadMessage.set('');
    this.locationService.list().subscribe({
      next: (locations) => this.locations.set(locations),
      error: (err) => {
        console.error('Error al cargar ubicaciones:', err);
        this.locationLoadMessage.set('No se pudieron cargar las ubicaciones. Reintentá la carga.');
      },
    });
  }

  loadUsers(): void {
    this.userLoadMessage.set('');
    this.authService.getUsers().subscribe({
      next: (users) => this.users.set(users),
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
        this.users.set([]);
        this.userLoadMessage.set(
          'No se pudo cargar la lista de usuarios; se usará el usuario actual.',
        );
      },
    });
  }

  productName(id: number): string {
    const product = this.products().find((p) => p.idProducto === id);
    return product ? product.nombreProducto : `Producto #${id}`;
  }

  locationName(id: number | null): string {
    if (!id) {
      return '—';
    }
    const location = this.locations().find((l) => l.id === id);
    return location ? location.name : `Ubicación #${id}`;
  }

  userName(id: number): string {
    const user = this.users().find((u) => u.idUsuario === id);
    return user ? `${user.nombre} ${user.apellido}` : `Usuario #${id}`;
  }

  onSubmit(): void {
    this.errorMessage.set('');
    this.successMessage.set('');

    if (!this.form.idProduct || !this.form.idLocationTo || !this.form.idUser) {
      this.errorMessage.set('Completá producto, ubicación de destino y usuario');
      return;
    }

    this.saving.set(true);

    this.movementService.create(this.form).subscribe({
      next: () => {
        this.saving.set(false);
        this.successMessage.set('Movimiento registrado correctamente');
        this.form = this.emptyForm();
        this.loadMovements();
      },
      error: (err) => {
        this.saving.set(false);
        console.error('Error al registrar movimiento:', err);
        this.errorMessage.set(err.error?.error || 'No se pudo registrar el movimiento');
      },
    });
  }
}
