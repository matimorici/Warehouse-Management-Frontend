import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { throwError, of, Subject } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ProductInfo, ProductService } from '../../services/product.service';
import { PurchaseOrderInfo, PurchaseOrderService } from '../../services/purchase-order.service';
import { AdminHomeComponent } from './admin-home';

describe('AdminHomeComponent', () => {
  let component: AdminHomeComponent;
  let fixture: ComponentFixture<AdminHomeComponent>;
  let productResponses: Subject<ProductInfo[]>;
  let purchaseOrderResponses: Subject<PurchaseOrderInfo[]>;
  let productService: { getProducts: ReturnType<typeof vi.fn> };
  let purchaseOrderService: { list: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    productResponses = new Subject<ProductInfo[]>();
    purchaseOrderResponses = new Subject<PurchaseOrderInfo[]>();
    productService = { getProducts: vi.fn(() => productResponses) };
    purchaseOrderService = { list: vi.fn(() => purchaseOrderResponses) };

    await TestBed.configureTestingModule({
      imports: [AdminHomeComponent],
      providers: [
        provideRouter([]),
        {
          provide: AuthService,
          useValue: {
            getUserRole: () => null,
            getHomeRouteByRole: () => '/login',
            getCurrentUserName: () => '',
            logout: () => of(void 0),
            clearSession: () => undefined,
          },
        },
        { provide: ProductService, useValue: productService },
        { provide: PurchaseOrderService, useValue: purchaseOrderService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminHomeComponent);
    component = fixture.componentInstance;
  });

  it('muestra el estado de carga sin confirmar cantidades en cero', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('[role="status"]').length).toBe(2);
    expect(fixture.nativeElement.textContent).toContain('Cargando órdenes de compra');
    expect(fixture.nativeElement.textContent).toContain('Cargando productos');
    expect(fixture.nativeElement.textContent).not.toContain('0 pendientes');
  });

  it('muestra el error de productos y permite reintentar esa fuente', () => {
    const product = createProduct({ cantidadDisponible: 0 });
    productService.getProducts
      .mockReturnValueOnce(throwError(() => new Error('Error de red')))
      .mockReturnValueOnce(of([product]));

    fixture.detectChanges();

    const stockAlert = fixture.nativeElement.querySelector(
      '[aria-labelledby="stock-alert-title"]',
    ) as HTMLElement;
    expect(stockAlert.textContent).toContain('No se pudieron cargar los productos');
    expect(stockAlert.querySelector('table')).toBeNull();

    const retryButton = stockAlert.querySelector('button') as HTMLButtonElement;
    retryButton.click();
    fixture.detectChanges();

    expect(productService.getProducts).toHaveBeenCalledTimes(2);
    expect(stockAlert.querySelector('table')).not.toBeNull();
    expect(stockAlert.textContent).toContain(product.nombreProducto);
  });

  it('distingue una respuesta vacía de una consulta fallida', () => {
    fixture.detectChanges();
    productResponses.next([]);
    purchaseOrderResponses.next([]);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('La consulta no devolvió productos.');
    expect(fixture.nativeElement.textContent).toContain('No hay órdenes de compra para mostrar.');
    expect(fixture.nativeElement.textContent).not.toContain('No se pudieron cargar');
    expect(fixture.nativeElement.querySelector('table')).toBeNull();
  });

  it('muestra productos sin stock y compras pendientes cuando hay datos', () => {
    const product = createProduct({ cantidadDisponible: 0 });
    const purchaseOrder = createPurchaseOrder({ status: 'PENDIENTE' });

    fixture.detectChanges();
    productResponses.next([product]);
    purchaseOrderResponses.next([purchaseOrder]);
    fixture.detectChanges();

    expect(component.pendingPurchaseOrders).toBe(1);
    expect(component.outOfStockProducts).toEqual([product]);
    expect(fixture.nativeElement.textContent).toContain(product.nombreProducto);
    expect(fixture.nativeElement.textContent).toContain('1 pendientes');
    expect(fixture.nativeElement.querySelector('table')).not.toBeNull();
  });
});

function createProduct(overrides: Partial<ProductInfo> = {}): ProductInfo {
  return {
    idProducto: 12,
    nombreProducto: 'Tornillo hexagonal',
    descripcionProducto: 'Tornillo de prueba',
    codigoBarras: '7791234567890',
    idProveedor: 3,
    origenCodigoBarras: 'INTERNO',
    cantidadDisponible: 4,
    cantidadPendiente: 2,
    ...overrides,
  };
}

function createPurchaseOrder(
  overrides: Partial<PurchaseOrderInfo> = {},
): PurchaseOrderInfo {
  return {
    idPurchaseOrder: 9,
    dateTime: '2026-10-14T12:00:00',
    idSupplier: 5,
    status: 'PENDIENTE',
    lines: [],
    ...overrides,
  };
}
