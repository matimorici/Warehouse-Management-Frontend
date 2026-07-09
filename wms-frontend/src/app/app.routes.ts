import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';
import { HomeComponent } from './pages/home/home';
import { AdminHomeComponent } from './pages/admin-home/admin-home';
import { OperatorHomeComponent } from './pages/operator-home/operator-home';
import { ProductsComponent } from './pages/products/products';
import { ProvidersComponent } from './pages/providers/providers';
import { OrdenesRetiroComponent } from './pages/ordenes-retiro/ordenes-retiro';
import { OrdenRetiroFormComponent } from './pages/ordenes-retiro/orden-retiro-form';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'admin', component: AdminHomeComponent },
  { path: 'operario', component: OperatorHomeComponent },
  { path: 'productos', component: ProductsComponent },
  { path: 'proveedores', component: ProvidersComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'ordenes-retiro', component: OrdenesRetiroComponent },
  { path: 'ordenes-retiro/nuevo', component: OrdenRetiroFormComponent },
  { path: 'ordenes-retiro/:id', component: OrdenRetiroFormComponent },
  { path: '**', redirectTo: 'login' },
];
