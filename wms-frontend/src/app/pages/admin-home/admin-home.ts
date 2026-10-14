import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductInfo, ProductService } from '../../services/product.service';
import { PurchaseOrderInfo, PurchaseOrderService } from '../../services/purchase-order.service';
import { PageTopbarComponent } from '../../shared/page-topbar';

type SourceState = 'loading' | 'error' | 'empty' | 'data';

interface AdminSection {
  label: string;
  description: string;
  route: string;
  badge?: () => string | null;
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
          badge: () =>
            this.purchaseOrdersState() === 'data' && this.pendingPurchaseOrders > 0
              ? String(this.pendingPurchaseOrders)
              : null,
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
          badge: () =>
            this.productsState() === 'data' && this.outOfStockProducts.length > 0
              ? 'Revisar'
              : null,
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
    {
      title: 'Administración',
      hint: 'Cuentas y personal',
      sections: [
        {
          label: 'Usuarios',
          description: 'Consultá y administrá las cuentas existentes.',
          route: '/usuarios',
        },
      ],
    },
  ];

  readonly products = signal<ProductInfo[]>([]);
  readonly purchaseOrders = signal<PurchaseOrderInfo[]>([]);

  readonly productsState = signal<SourceState>('loading');
  readonly purchaseOrdersState = signal<SourceState>('loading');

  constructor(
    private productService: ProductService,
    private purchaseOrderService: PurchaseOrderService,
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadPurchaseOrders();
  }

  get outOfStockProducts(): ProductInfo[] {
    return this.products().filter((product) => product.cantidadDisponible === 0).slice(0, 6);
  }

  get pendingPurchaseOrders(): number {
    return this.purchaseOrders().filter((order) => order.status === 'PENDIENTE').length;
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
}
