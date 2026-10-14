import { Component, OnInit } from '@angular/core';
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
  movements: PhysicalMovementInfo[] = [];
  products: ProductInfo[] = [];
  locations: LocationInfo[] = [];
  users: UserInfo[] = [];

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

  loading = false;
  saving = false;
  errorMessage = '';
  successMessage = '';
  listMessage = '';
  userLoadMessage = '';

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
    this.loading = true;
    this.listMessage = '';

    this.movementService
      .list({
        idProduct: this.filters.idProduct,
        idUser: this.filters.idUser,
        from: this.toIsoDateTime(this.filters.from),
        to: this.toIsoDateTime(this.filters.to),
      })
      .subscribe({
        next: (movements) => {
          this.movements = movements;
          this.loading = false;

          if (movements.length === 0) {
            this.listMessage = 'No hay movimientos para los filtros seleccionados';
          }
        },
        error: (err) => {
          this.loading = false;
          console.error('Error al cargar movimientos:', err);
          this.listMessage = err.error?.error || 'No se pudieron cargar los movimientos';
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
    this.productService.getProducts().subscribe({
      next: (products) => (this.products = products),
      error: (err) => console.error('Error al cargar productos:', err),
    });
  }

  loadLocations(): void {
    this.locationService.list().subscribe({
      next: (locations) => (this.locations = locations),
      error: (err) => console.error('Error al cargar ubicaciones:', err),
    });
  }

  loadUsers(): void {
    this.userLoadMessage = '';
    this.authService.getUsers().subscribe({
      next: (users) => (this.users = users),
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
        this.users = [];
        this.userLoadMessage = 'No se pudo cargar la lista de usuarios; se usará el usuario actual.';
      },
    });
  }

  productName(id: number): string {
    const product = this.products.find((p) => p.idProducto === id);
    return product ? product.nombreProducto : `Producto #${id}`;
  }

  locationName(id: number | null): string {
    if (!id) {
      return '—';
    }
    const location = this.locations.find((l) => l.id === id);
    return location ? location.name : `Ubicación #${id}`;
  }

  userName(id: number): string {
    const user = this.users.find((u) => u.idUsuario === id);
    return user ? `${user.nombre} ${user.apellido}` : `Usuario #${id}`;
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.form.idProduct || !this.form.idLocationTo || !this.form.idUser) {
      this.errorMessage = 'Completá producto, ubicación de destino y usuario';
      return;
    }

    this.saving = true;

    this.movementService.create(this.form).subscribe({
      next: () => {
        this.saving = false;
        this.successMessage = 'Movimiento registrado correctamente';
        this.form = this.emptyForm();
        this.loadMovements();
      },
      error: (err) => {
        this.saving = false;
        console.error('Error al registrar movimiento:', err);
        this.errorMessage = err.error?.error || 'No se pudo registrar el movimiento';
      },
    });
  }
}
