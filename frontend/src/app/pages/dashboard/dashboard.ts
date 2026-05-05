import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';

interface Modulo {
  nombre: string;
  descripcion: string;
  icono: string;
  ruta: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  searchTerm = signal('');
  mostrar = signal(true);
  selected = signal('');
  tema = signal(localStorage.getItem('tema') || 'light');
  themeMenuOpen = signal(false);
  notifMenuOpen = signal(false);
  userMenuOpen = signal(false);

  produccionActual = 842;
  metaProduccion = 1200;

  modulos: Modulo[] = [
    {
      nombre: 'Caja',
      descripcion: 'Gestión de ingresos y egresos',
      icono: '💰',
      ruta: '/caja'
    },
    {
      nombre: 'Almacén',
      descripcion: 'Control de inventario y productos',
      icono: '📦',
      ruta: '/almacen'
    },
    {
      nombre: 'Cuentas Bancarias',
      descripcion: 'Administración de cuentas bancarias',
      icono: '🏦',
      ruta: '/cuentas-bancarias'
    },
    {
      nombre: 'Guías de Almacén',
      descripcion: 'Registro de movimientos de inventario',
      icono: '📋',
      ruta: '/guias-almacen'
    },
    {
      nombre: 'Reportes',
      descripcion: 'Generación de reportes empresariales',
      icono: '📊',
      ruta: '/reportes'
    }
  ];

  notificaciones = signal([
    { texto: 'Nuevo lote registrado en bodega N° 12', tiempo: 'Hace 5 minutos', leida: false },
    { texto: 'Venta #0842 requiere aprobación de caja', tiempo: 'Hace 23 minutos', leida: false },
    { texto: 'Stock bajo en insumos: Bentonita', tiempo: 'Hace 1 hora', leida: false },
    { texto: 'Cierre de caja del 01/05/2026 completado', tiempo: 'Ayer', leida: true }
  ]);

  constructor(private router: Router) {}

  ngOnInit() {
    this.aplicarTema(this.tema());
  }

  get porcentajeProduccion() {
    return Math.round((this.produccionActual / this.metaProduccion) * 100);
  }

  updateSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value.toLowerCase());
  }

  filteredModulos(): Modulo[] {
    return this.modulos.filter(m =>
      m.nombre.toLowerCase().includes(this.searchTerm())
    );
  }

  activarModulos() {
    this.mostrar.set(!this.mostrar());
  }

  mostrarModulos() {
    return this.mostrar();
  }

  selectModulo(nombre: string) {
    this.selected.set(nombre);
  }

  moduloSeleccionado() {
    return this.selected();
  }

  toggleThemeMenu() {
    this.themeMenuOpen.set(!this.themeMenuOpen());
  }

  cambiarTemaDirecto(tema: string) {
    this.tema.set(tema);
    localStorage.setItem('tema', tema);
    this.aplicarTema(tema);
    this.themeMenuOpen.set(false);
  }

  temaIcono() {
    if (this.tema() === 'dark') return '🌙';
    if (this.tema() === 'system') return '🖥️';
    return '☀️';
  }

  aplicarTema(tema: string) {
    document.body.classList.remove('theme-light', 'theme-dark');

    if (tema === 'system') {
      const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.body.classList.add(dark ? 'theme-dark' : 'theme-light');
    } else {
      document.body.classList.add(tema === 'dark' ? 'theme-dark' : 'theme-light');
    }
  }

  toggleNotifMenu() {
    this.notifMenuOpen.set(!this.notifMenuOpen());
    this.themeMenuOpen.set(false);
    this.userMenuOpen.set(false);
  }

  toggleUserMenu() {
    this.userMenuOpen.set(!this.userMenuOpen());
    this.themeMenuOpen.set(false);
    this.notifMenuOpen.set(false);
  }

  notifNoLeidas() {
    return this.notificaciones().filter(n => !n.leida).length;
  }

  marcarTodasLeidas() {
    const notifs = this.notificaciones();
    notifs.forEach(n => n.leida = true);
    this.notificaciones.set([...notifs]);
  }

  irA(ruta: string) {
    this.userMenuOpen.set(false);
    this.router.navigate([ruta]);
  }

  logout() {
    localStorage.removeItem('rol');
    this.router.navigate(['/login']);
  }
}
