import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ProductInfo, ProductService } from '../../services/product.service';
import { ProviderForm, ProviderService } from '../../services/provider.service';
import { LocationInfo, LocationService } from '../../services/location.service';
import {
  PhysicalMovementInfo,
  PhysicalMovementService,
} from '../../services/physical-movement.service';
import { PurchaseOrderInfo, PurchaseOrderService } from '../../services/purchase-order.service';
import { OrdenRetiroResponse, OrdenRetiroService } from '../../services/orden-retiro.service';
import { AuthService, UserInfo } from '../../services/auth.service';
import { PageTopbarComponent } from '../../shared/page-topbar';

interface AdminSection {
  label: string;
  description: string;
  route: string;
}

interface AdminGroup {
  title: string;
  hint: string;
  sections: AdminSection[];
}

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [CommonModule, RouterLink, PageTopbarComponent],
  templateUrl: './admin-home.html',
})
export class AdminHomeComponent implements OnInit {
  readonly mainGroups: AdminGroup[] = [
    {
      title: 'Operaciones',
      hint: 'Movimientos de mercadería',
      sections: [
        {
          label: 'Órdenes de retiro',
          description: 'Creá y gestioná las solicitudes de retiro de mercadería.',
          route: '/ordenes-retiro',
        },
        {
          label: 'Órdenes de compra',
          description: 'Cargá pedidos a proveedores y registrá su recepción.',
          route: '/ordenes-compra',
        },
        {
          label: 'Movimientos físicos',
          description: 'Registrá entradas, salidas y traslados de stock.',
          route: '/movimientos-fisicos',
        },
      ],
    },
    {
      title: 'Catálogo',
      hint: 'Datos maestros del depósito',
      sections: [
        {
          label: 'Productos',
          description: 'Cargá artículos y mantené actualizado el inventario.',
          route: '/productos',
        },
        {
          label: 'Proveedores',
          description: 'Administrá los datos de contacto de los proveedores.',
          route: '/proveedores',
        },
        {
          label: 'Ubicaciones',
          description: 'Organizá las ubicaciones físicas dentro del depósito.',
          route: '/ubicaciones',
        },
        {
          label: 'Valoraciones de proveedor',
          description: 'Consultá y cargá evaluaciones de desempeño de proveedores.',
          route: '/valoraciones-proveedor',
        },
      ],
    },
  ];

  readonly adminGroup: AdminGroup = {
    title: 'Administración',
    hint: 'Cuentas y personal',
    sections: [
      {
        label: 'Registrar Operario',
        description: 'Creá una cuenta de acceso para el personal del depósito.',
        route: '/registrar',
      },
      {
        label: 'Usuarios',
        description: 'Consultá y administrá las cuentas existentes.',
        route: '/usuarios',
      },
    ],
  };

  readonly products = signal<ProductInfo[]>([]);
  readonly purchaseOrders = signal<PurchaseOrderInfo[]>([]);
  readonly withdrawalOrders = signal<OrdenRetiroResponse[]>([]);
  readonly movements = signal<PhysicalMovementInfo[]>([]);
  readonly locations = signal<LocationInfo[]>([]);
  readonly providers = signal<ProviderForm[]>([]);
  readonly users = signal<UserInfo[]>([]);

  readonly loadingSummary = signal(true);
  readonly summaryError = signal('');

  constructor(
    private productService: ProductService,
    private providerService: ProviderService,
    private locationService: LocationService,
    private movementService: PhysicalMovementService,
    private purchaseOrderService: PurchaseOrderService,
    private withdrawalOrderService: OrdenRetiroService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.loadSummary();
  }

  get totalAvailableUnits(): number {
    return this.products().reduce((acc, p) => acc + (p.cantidadDisponible ?? 0), 0);
  }

  get totalPendingUnits(): number {
    return this.products().reduce((acc, p) => acc + (p.cantidadPendiente ?? 0), 0);
  }

  get outOfStockCount(): number {
    return this.products().filter((p) => (p.cantidadDisponible ?? 0) === 0).length;
  }

  get pendingPurchaseOrders(): number {
    return this.purchaseOrders().filter((o) => o.status === 'PENDIENTE').length;
  }

  get receivedPurchaseOrders(): number {
    return this.purchaseOrders().filter((o) => o.status === 'RECIBIDA').length;
  }

  get outOfStockProducts(): ProductInfo[] {
    return this.products().filter((p) => (p.cantidadDisponible ?? 0) === 0).slice(0, 6);
  }

  private loadSummary(): void {
    const safe = <T>(obs: Observable<T[]>): Observable<T[]> =>
      obs.pipe(catchError(() => of([] as T[])));

    forkJoin({
      products: safe(this.productService.getProducts()),
      providers: safe(this.providerService.getProviders()),
      locations: safe(this.locationService.list()),
      movements: safe(this.movementService.list()),
      purchaseOrders: safe(this.purchaseOrderService.list()),
      withdrawalOrders: safe(this.withdrawalOrderService.list()),
      users: safe(this.authService.getUsers()),
    }).subscribe({
      next: (result) => {
        this.products.set(result.products);
        this.providers.set(result.providers);
        this.locations.set(result.locations);
        this.movements.set(result.movements);
        this.purchaseOrders.set(result.purchaseOrders);
        this.withdrawalOrders.set(result.withdrawalOrders);
        this.users.set(result.users);
        this.loadingSummary.set(false);
      },
      error: (err) => {
        console.error('Error al cargar el resumen:', err);
        this.loadingSummary.set(false);
        this.summaryError.set('No se pudo cargar el resumen operativo');
      },
    });
  }
}
