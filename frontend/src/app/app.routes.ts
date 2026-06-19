/* import { Routes } from '@angular/router';

import { LoginComponent } from './pages/auth/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { CajaComponent } from './pages/caja/caja';
import { Cuentas } from './pages/cuentas-bancarias/cuentas-bancarias';
import { Almacen } from './pages/almacen/almacen';
import { GuiasAlmacen } from './pages/guias-almacen/guias-almacen';
import { Reportes } from './pages/reportes/reportes';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: Dashboard },
  { path: 'caja', component: CajaComponent },
  { path: 'cuentas-bancarias', component: Cuentas },
  { path: 'almacen', component: Almacen },
  { path: 'guias-almacen', component: GuiasAlmacen },
  { path: 'reportes', component: Reportes },

  { path: '**', redirectTo: 'login' }
];

*/

import { Routes } from '@angular/router';

import { LoginComponent } from './pages/auth/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { CajaComponent } from './pages/caja/caja';
import { Cuentas } from './pages/cuentas-bancarias/cuentas-bancarias';
import { Almacen } from './pages/almacen/almacen';
import { GuiasAlmacen } from './pages/guias-almacen/guias-almacen';
import { Reportes } from './pages/reportes/reportes';

export const routes: Routes = [
  // MODIFICADO: Ahora si abres la raíz, te manda directo a tu pantalla de Almacén
  { path: '', redirectTo: 'almacen', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: Dashboard },
  { path: 'caja', component: CajaComponent },
  { path: 'cuentas-bancarias', component: Cuentas },
  { path: 'almacen', component: Almacen },
  { path: 'guias-almacen', component: GuiasAlmacen },
  { path: 'reportes', component: Reportes },

  // MODIFICADO: Si algo sale mal o tecleas mal una sub-ruta, te deja en almacén en vez de botarte al login
  { path: '**', redirectTo: 'almacen' }
];