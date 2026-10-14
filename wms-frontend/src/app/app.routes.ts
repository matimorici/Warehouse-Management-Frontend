import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';
import { HomeComponent } from './pages/home/home';
import { AdminHomeComponent } from './pages/admin-home/admin-home';
import { OperatorHomeComponent } from './pages/operator-home/operator-home';
import { ProductsComponent } from './pages/products/products';
import { ProductDetailComponent } from './pages/product-detail/product-detail';
import { ProvidersComponent } from './pages/providers/providers';
import { LocationsComponent } from './pages/locations/locations';
import { SupplierRatingsComponent } from './pages/supplier-ratings/supplier-ratings';
import { PurchaseOrdersComponent } from './pages/purchase-orders/purchase-orders';
import { PurchaseOrderFormComponent } from './pages/purchase-orders/purchase-order-form';
import { PhysicalMovementsComponent } from './pages/physical-movements/physical-movements';
import { UsersComponent } from './pages/users/users';
import { OrdenesRetiroComponent } from './pages/ordenes-retiro/ordenes-retiro';
import { OrdenRetiroFormComponent } from './pages/ordenes-retiro/orden-retiro-form';
import { ForbiddenComponent } from './pages/errors/forbidden';
import { NotFoundComponent } from './pages/errors/not-found';
import { authGuard, roleGuard } from './services/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'sin-acceso', component: ForbiddenComponent },

  { path: 'admin', component: AdminHomeComponent, canActivate: [roleGuard(['ADMIN'])] },
  { path: 'registrar', component: RegisterComponent, canActivate: [roleGuard(['ADMIN'])] },
  { path: 'usuarios', component: UsersComponent, canActivate: [roleGuard(['ADMIN'])] },
  { path: 'proveedores', component: ProvidersComponent, canActivate: [roleGuard(['ADMIN'])] },
  { path: 'operario', component: OperatorHomeComponent, canActivate: [roleGuard(['OPERARIO'])] },

  { path: 'productos', component: ProductsComponent, canActivate: [authGuard] },
  { path: 'productos/:id', component: ProductDetailComponent, canActivate: [authGuard] },
  { path: 'ubicaciones', component: LocationsComponent, canActivate: [authGuard] },
  { path: 'valoraciones-proveedor', component: SupplierRatingsComponent, canActivate: [authGuard] },
  { path: 'movimientos-fisicos', component: PhysicalMovementsComponent, canActivate: [authGuard] },

  { path: 'ordenes-compra', component: PurchaseOrdersComponent, canActivate: [authGuard] },
  { path: 'ordenes-compra/nuevo', component: PurchaseOrderFormComponent, canActivate: [authGuard] },
  { path: 'ordenes-compra/:id', component: PurchaseOrderFormComponent, canActivate: [authGuard] },

  { path: 'ordenes-retiro', component: OrdenesRetiroComponent, canActivate: [authGuard] },
  { path: 'ordenes-retiro/nuevo', component: OrdenRetiroFormComponent, canActivate: [authGuard] },
  { path: 'ordenes-retiro/:id', component: OrdenRetiroFormComponent, canActivate: [authGuard] },

  { path: '**', component: NotFoundComponent },
];
