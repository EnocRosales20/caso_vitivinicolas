import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';  // 👈 AGREGAR
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';  // 👈 AGREGAR

// 👈 AGREGAR: Importar servicios de microservicios
import { CajaService } from '../../core/services/caja';
import { CuentasBancariasService } from '../../core/services/cuentas-bancarias';
import { ReportesService } from '../../core/services/reportes.service';

type Tema = 'light' | 'dark' | 'system';

interface Modulo {
  nombre: string;
  descripcion: string;
  icono: string;
  ruta: string;
  roles: string[];
}

interface Notificacion {
  texto: string;
  tiempo: string;
  leida: boolean;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  // 👈 AGREGAR: BaseChartDirective a los imports
  imports: [CommonModule, RouterLink, BaseChartDirective],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class Dashboard implements OnInit {
  searchTerm = signal('');
  mostrar = signal(true);
  selected = signal('');
  tema = signal<Tema>((localStorage.getItem('tema') as Tema) || 'light');

  rolUsuario = localStorage.getItem('rol') || '';
  usuario = localStorage.getItem('usuario') || '';

  themeMenuOpen = signal(false);
  notifMenuOpen = signal(false);
  userMenuOpen = signal(false);

  produccionActual = 842;
  metaProduccion = 1200;

  // ===========================================
  // 👈 NUEVO: KPIs de microservicios
  // ===========================================
  totalIngresos: number = 0;
  totalEgresos: number = 0;
  saldoCaja: number = 0;
  totalMovimientos: number = 0;
  totalCuentas: number = 0;
  saldoTotalCuentas: number = 0;
  totalReportes: number = 0;
  reportesPorTipo: { [key: string]: number } = {
    'Caja': 0,
    'Almacén': 0,
    'Cuentas': 0,
    'Guias': 0
  };
  isLoading: boolean = true;

  notificaciones: Notificacion[] = [
    { texto: 'Tienes una nueva orden pendiente', tiempo: 'Hace 10 min', leida: false },
    { texto: 'El inventario de vino tinto está bajo', tiempo: 'Hace 1 h', leida: true },
    { texto: 'Reporte mensual disponible', tiempo: 'Ayer', leida: false },
  ];

  // ===========================================
  // 👈 NUEVO: GRÁFICO 1 - CAJA (Barras)
  // ===========================================
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        display: true, 
        position: 'top',
        labels: { font: { size: 12 } }
      },
      title: { 
        display: true, 
        text: '💰 Caja - Ingresos vs Egresos',
        font: { size: 14 }
      }
    }
  };

  public barChartData: ChartData<'bar'> = {
    labels: ['Movimientos'],
    datasets: [
      { 
        data: [0], 
        label: 'Ingresos',
        backgroundColor: '#2e7d32',
        borderColor: '#1b5e20',
        borderWidth: 1
      },
      { 
        data: [0], 
        label: 'Egresos',
        backgroundColor: '#c62828',
        borderColor: '#b71c1c',
        borderWidth: 1
      }
    ]
  };
  public barChartType: ChartType = 'bar';

  // ===========================================
  // 👈 NUEVO: GRÁFICO 2 - CUENTAS (Dona)
  // ===========================================
  public doughnutChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        display: true, 
        position: 'top',
        labels: { font: { size: 12 } }
      },
      title: { 
        display: true, 
        text: '🏦 Cuentas Bancarias',
        font: { size: 14 }
      }
    }
  };

  public doughnutChartData: ChartData<'doughnut'> = {
    labels: ['Cuentas Activas'],
    datasets: [{
      data: [0],
      backgroundColor: ['#1976d2'],
      borderColor: ['#0d47a1'],
      borderWidth: 1
    }]
  };
  public doughnutChartType: ChartType = 'doughnut';

  // ===========================================
  // 👈 NUEVO: GRÁFICO 3 - REPORTES (Pie)
  // ===========================================
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        display: true, 
        position: 'top',
        labels: { font: { size: 12 } }
      },
      title: { 
        display: true, 
        text: '📊 Reportes por Tipo',
        font: { size: 14 }
      }
    }
  };

  public pieChartData: ChartData<'pie'> = {
    labels: ['Caja', 'Almacén', 'Cuentas', 'Guías'],
    datasets: [{
      data: [0, 0, 0, 0],
      backgroundColor: ['#1976d2', '#2e7d32', '#f57c00', '#6a1b9a'],
      borderColor: ['#0d47a1', '#1b5e20', '#e65100', '#4a148c'],
      borderWidth: 1
    }]
  };
  public pieChartType: ChartType = 'pie';

  get porcentajeProduccion(): number {
    return Math.round((this.produccionActual / this.metaProduccion) * 100);
  }

  modulos: Modulo[] = [
    {
      nombre: 'Caja',
      descripcion: 'Gestión de ingresos y egresos de caja.',
      icono: '💼',
      ruta: '/caja',
      roles: ['dueno'],
    },
    {
      nombre: 'Almacén',
      descripcion: 'Control de inventario y productos.',
      icono: '📦',
      ruta: '/almacen',
      roles: ['admin', 'dueno'],
    },
    {
      nombre: 'Cuentas Bancarias',
      descripcion: 'Administración de cuentas bancarias.',
      icono: '🏦',
      ruta: '/cuentas-bancarias',
      roles: ['dueno'],
    },
    {
      nombre: 'Guías de Almacén',
      descripcion: 'Registro de movimientos de inventario.',
      icono: '📋',
      ruta: '/guias-almacen',
      roles: ['admin', 'dueno'],
    },
    {
      nombre: 'Reportes',
      descripcion: 'Generación de reportes empresariales.',
      icono: '📊',
      ruta: '/reportes',
      roles: ['admin', 'dueno'],
    },
  ];

  // 👈 AGREGAR: Inyectar servicios en el constructor
  constructor(
    private router: Router,
    private cajaService: CajaService,
    private cuentasService: CuentasBancariasService,
    private reportesService: ReportesService
  ) {}

  ngOnInit(): void {
    this.aplicarTema(this.tema());
    this.cargarDashboard();  // 👈 AGREGAR: Cargar datos
  }

  // ===========================================
  // 👈 NUEVO: CARGAR DATOS DE MICROSERVICIOS
  // ===========================================
  cargarDashboard(): void {
    this.isLoading = true;

    // 1. MICROSERVICIO CAJA
    this.cajaService.listarMovimientos().subscribe({
      next: (movimientos) => {
        console.log('💰 Datos de Caja:', movimientos);
        
        this.totalIngresos = movimientos
          .filter(m => m.tipo === 'Depósito' || m.tipo === 'INGRESO')
          .reduce((sum, m) => sum + m.monto, 0);

        this.totalEgresos = movimientos
          .filter(m => m.tipo === 'Retiro' || m.tipo === 'EGRESO')
          .reduce((sum, m) => sum + m.monto, 0);

        this.saldoCaja = this.totalIngresos - this.totalEgresos;
        this.totalMovimientos = movimientos.length;

        // Actualizar gráfico de barras
        this.barChartData.datasets[0].data = [this.totalIngresos];
        this.barChartData.datasets[1].data = [this.totalEgresos];
        this.barChartData = { ...this.barChartData };

        this.isLoading = false;
      },
      error: (err) => {
        console.error('❌ Error al cargar Caja:', err);
        this.isLoading = false;
      }
    });

    // 2. MICROSERVICIO CUENTAS
    this.cuentasService.listarTodas().subscribe({
      next: (cuentas) => {
        console.log('🏦 Datos de Cuentas:', cuentas);
        
        this.totalCuentas = cuentas.length;
        this.saldoTotalCuentas = cuentas.reduce((sum, c) => sum + c.saldo, 0);

        this.doughnutChartData.datasets[0].data = [this.totalCuentas];
        this.doughnutChartData = { ...this.doughnutChartData };
      },
      error: (err) => {
        console.error('❌ Error al cargar Cuentas:', err);
      }
    });

    // 3. MICROSERVICIO REPORTES
    this.reportesService.obtenerTodos().subscribe({
      next: (reportes) => {
        console.log('📊 Datos de Reportes:', reportes);
        
        this.totalReportes = reportes.length;

        const tipos = ['Caja', 'Almacén', 'Cuentas', 'Guias'];
        tipos.forEach(t => this.reportesPorTipo[t] = 0);

        reportes.forEach(r => {
          if (this.reportesPorTipo[r.tipo] !== undefined) {
            this.reportesPorTipo[r.tipo]++;
          }
        });

        this.pieChartData.datasets[0].data = [
          this.reportesPorTipo['Caja'] || 0,
          this.reportesPorTipo['Almacén'] || 0,
          this.reportesPorTipo['Cuentas'] || 0,
          this.reportesPorTipo['Guias'] || 0
        ];
        this.pieChartData = { ...this.pieChartData };
      },
      error: (err) => {
        console.error('❌ Error al cargar Reportes:', err);
      }
    });
  }

  // 👈 NUEVO: Refrescar datos
  refrescar(): void {
    this.cargarDashboard();
  }

  puedeVerModulo(modulo: Modulo): boolean {
    return modulo.roles.includes(this.rolUsuario);
  }

  modulosPorRol(): Modulo[] {
    return this.modulos.filter((modulo) => this.puedeVerModulo(modulo));
  }

  filteredModulos(): Modulo[] {
    const term = this.searchTerm();

    return this.modulosPorRol().filter((modulo) =>
      !term ||
      modulo.nombre.toLowerCase().includes(term) ||
      modulo.descripcion.toLowerCase().includes(term)
    );
  }

  esDueno(): boolean {
    return this.rolUsuario === 'dueno';
  }

  esAdmin(): boolean {
    return this.rolUsuario === 'admin';
  }

  get nombreRol(): string {
    if (this.rolUsuario === 'dueno') return 'Dueño';
    if (this.rolUsuario === 'admin') return 'Administrador';
    return 'Usuario';
  }

  updateSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value.trim().toLowerCase());
  }

  activarModulos(): void {
    this.mostrar.set(!this.mostrar());
  }

  mostrarModulos(): boolean {
    return this.mostrar();
  }

  selectModulo(nombre: string): void {
    this.selected.set(nombre);
  }

  moduloSeleccionado(): string {
    return this.selected();
  }

  irA(ruta: string): void {
    this.router.navigate([ruta]);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('rol');
    this.router.navigate(['/login']);
  }

  cambiarTemaDirecto(tema: Tema): void {
    this.tema.set(tema);
    localStorage.setItem('tema', tema);
    this.aplicarTema(tema);
    this.themeMenuOpen.set(false);
  }

  temaIcono(): string {
    if (this.tema() === 'dark') return '🌙';
    if (this.tema() === 'system') return '🖥️';
    return '☀️';
  }

  aplicarTema(tema: Tema): void {
    document.body.classList.remove('theme-light', 'theme-dark', 'dark');
    document.body.classList.add(tema === 'dark' ? 'theme-dark' : 'theme-light');

    if (tema === 'dark') {
      document.body.classList.add('dark');
    }
  }

  toggleThemeMenu(): void {
    this.themeMenuOpen.set(!this.themeMenuOpen());
  }

  notifNoLeidas(): number {
    return 3;
  }

  marcarTodasLeidas(): void {}
}