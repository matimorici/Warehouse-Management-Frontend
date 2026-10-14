import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductInfo, ProductService } from '../../services/product.service';
import { LocationInfo, LocationService } from '../../services/location.service';
import {
  PhysicalMovementInfo,
  PhysicalMovementService,
} from '../../services/physical-movement.service';
import { PurchaseOrderInfo, PurchaseOrderService } from '../../services/purchase-order.service';
import { OrdenRetiroResponse, OrdenRetiroService } from '../../services/orden-retiro.service';
import { PageTopbarComponent } from '../../shared/page-topbar';

type SourceState = 'loading' | 'error' | 'empty' | 'data';

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
        label: 'Registrar operario',
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

  readonly productsState = signal<SourceState>('loading');
  readonly purchaseOrdersState = signal<SourceState>('loading');
  readonly withdrawalOrdersState = signal<SourceState>('loading');
  readonly movementsState = signal<SourceState>('loading');
  readonly locationsState = signal<SourceState>('loading');

  constructor(
    private productService: ProductService,
    private locationService: LocationService,
    private movementService: PhysicalMovementService,
    private purchaseOrderService: PurchaseOrderService,
    private withdrawalOrderService: OrdenRetiroService,
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadPurchaseOrders();
    this.loadWithdrawalOrders();
    this.loadMovements();
    this.loadLocations();
  }

  get outOfStockProducts(): ProductInfo[] {
    return this.products().filter((product) => product.cantidadDisponible === 0).slice(0, 6);
  }

  get pendingPurchaseOrders(): number {
    return this.purchaseOrders().filter((order) => order.status === 'PENDIENTE').length;
  }

  get receivedPurchaseOrders(): number {
    return this.purchaseOrders().filter((order) => order.status === 'RECIBIDA').length;
  }

  loadProducts(): void {
    this.productsState.set('loading');
    this.products.set([]);
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products.set(products);
        this.productsState.set(products.length === 0 ? 'empty' : 'data');
      },
      error: (error) => {
        console.error('Error al cargar productos del panel:', error);
        this.productsState.set('error');
      },
    });
  }

  loadPurchaseOrders(): void {
    this.purchaseOrdersState.set('loading');
    this.purchaseOrders.set([]);
    this.purchaseOrderService.list().subscribe({
      next: (orders) => {
        this.purchaseOrders.set(orders);
        this.purchaseOrdersState.set(orders.length === 0 ? 'empty' : 'data');
      },
      error: (error) => {
        console.error('Error al cargar órdenes de compra del panel:', error);
        this.purchaseOrdersState.set('error');
      },
    });
  }

  loadWithdrawalOrders(): void {
    this.withdrawalOrdersState.set('loading');
    this.withdrawalOrders.set([]);
    this.withdrawalOrderService.list().subscribe({
      next: (orders) => {
        this.withdrawalOrders.set(orders);
        this.withdrawalOrdersState.set(orders.length === 0 ? 'empty' : 'data');
      },
      error: (error) => {
        console.error('Error al cargar órdenes de retiro del panel:', error);
        this.withdrawalOrdersState.set('error');
      },
    });
  }

  loadMovements(): void {
    this.movementsState.set('loading');
    this.movements.set([]);
    this.movementService.list().subscribe({
      next: (movements) => {
        this.movements.set(movements);
        this.movementsState.set(movements.length === 0 ? 'empty' : 'data');
      },
      error: (error) => {
        console.error('Error al cargar movimientos físicos del panel:', error);
        this.movementsState.set('error');
      },
    });
  }

  loadLocations(): void {
    this.locationsState.set('loading');
    this.locations.set([]);
    this.locationService.list().subscribe({
      next: (locations) => {
        this.locations.set(locations);
        this.locationsState.set(locations.length === 0 ? 'empty' : 'data');
      },
      error: (error) => {
        console.error('Error al cargar ubicaciones del panel:', error);
        this.locationsState.set('error');
      },
    });
  }
}
