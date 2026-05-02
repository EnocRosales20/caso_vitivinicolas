import { Routes } from '@angular/router';

import { LoginComponent } from './pages/auth/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { Caja } from './pages/caja/caja';
import { Cuentas } from './pages/cuentas-bancarias/cuentas-bancarias';
import { Almacen } from './pages/almacen/almacen';
import { GuiasAlmacen } from './pages/guias-almacen/guias-almacen';
import { Reportes } from './pages/reportes/reportes';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: Dashboard },
  { path: 'caja', component: Caja },
  { path: 'cuentas-bancarias', component: Cuentas },
  { path: 'almacen', component: Almacen },
  { path: 'guias-almacen', component: GuiasAlmacen },
  { path: 'reportes', component: Reportes },

  { path: '**', redirectTo: 'login' }
];
