import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { GuiasAlmacenService, GuiaAlmacenBackend } from './guias-almacen.service';
import { AlmacenService } from '../../core/services/almacen.service'; 
import { NgApexchartsModule } from 'ng-apexcharts'; // <-- 1. IMPORTANTE: Agrega esta línea

@Component({
  selector: 'app-guias-almacen',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, NgApexchartsModule], // <-- 2. IMPORTANTE: Agrega NgApexchartsModule aquí
  templateUrl: './guias-almacen.html',
  styleUrl: './guias-almacen.scss',
  providers: [GuiasAlmacenService]
})
export class GuiasAlmacen implements OnInit {
  productos: any[] = []; 
  guias: any[] = [];
  esProductoNuevo: boolean = false; 

  // 3. COPIA ESTE OBJETO COMPLETO: Configuración inicial del gráfico
  public chartOptions: any = {
    series: [0, 0, 0], // Inicia en cero, se actualizará dinámicamente
    chart: {
      type: 'donut',
      width: '100%',
      height: 300
    },
    labels: ['Ingresos / Compras', 'Salidas / Ventas', 'Traslados'],
    colors: ['#2e7d32', '#c62828', '#0288d1'], // Verde, Rojo, Azul
    responsive: [{
      breakpoint: 480,
      options: {
        chart: { width: 200 },
        legend: { position: 'bottom' }
      }
    }]
  };

  formulario = {
    tipo: '',
    producto: '', 
    cantidad: 0,
    origen: 'Almacén Central',
    destino: 'Cava Principal',
    observacion: '',
    categoria: 'Tintos',
    precio: 0,
    ubicacion: 'Cava Principal'
  };

  constructor(
    private guiasService: GuiasAlmacenService,
    private almacenService: AlmacenService 
  ) {}

  ngOnInit(): void {
    this.cargarGuias();
    this.cargarProductosReal();
  }

  cargarProductosReal(): void {
    this.almacenService.listarTodos().subscribe({
      next: (data) => { this.productos = data; },
      error: (err) => {
        console.error('Error al recuperar productos remotos:', err);
        this.productos = [{ nombre: 'Malbec Gran Reserva' }, { nombre: 'Cabernet Sauvignon' }];
      }
    });
  }
  
  cargarGuias(): void {
    this.guiasService.listar().subscribe({
      next: (data) => {
        this.guias = data;
        this.actualizarGrafico(); // <-- 4. CADA VEZ QUE SE CARGAN LAS GUIAS, ACTUALIZAMOS EL GRAFICO
      },
      error: (err) => console.error('Error al recuperar guías desde el backend:', err)
    });
  }

  // 5. NUEVA FUNCIÓN: Envía los contadores reales al gráfico de ApexCharts
  actualizarGrafico(): void {
    this.chartOptions.series = [
      this.totalCompras,
      this.totalVentas,
      this.totalTraslados
    ];
  }

  get totalGuias(): number { return this.guias.length; }

  get totalCompras(): number {
    return this.guias.filter(g => g.tipoMovimiento === 'Compra' || g.tipoMovimiento === 'INGRESO' || g.tipoMovimiento === 'Ingreso').length;
  }

  get totalVentas(): number {
    return this.guias.filter(g => g.tipoMovimiento === 'Venta' || g.tipoMovimiento === 'SALIDA' || g.tipoMovimiento === 'Salida').length;
  }

  get totalTraslados(): number {
    return this.guias.filter(g => g.tipoMovimiento === 'Traslado').length;
  }

  registrarGuia(): void {
    if (!this.formulario.tipo || !this.formulario.producto || !this.formulario.cantidad) {
      alert('Por favor, complete los campos obligatorios del formulario.');
      return;
    }

    const proximoCodigo = 'G-' + String(this.guias.length + 1).padStart(3, '0');
    let motivoConstruido = '';
    if (this.esProductoNuevo && this.formulario.tipo === 'Compra') {
      motivoConstruido = `Prod: ${this.formulario.producto} | Cat: ${this.formulario.categoria} | Precio: ${this.formulario.precio} | Ubic: ${this.formulario.ubicacion} | Obs: ${this.formulario.observacion || 'Registro inicial'}`;
    } else {
      motivoConstruido = `Prod: ${this.formulario.producto} | Cant: ${this.formulario.cantidad} | De: ${this.formulario.origen} a ${this.formulario.destino} | Obs: ${this.formulario.observacion || 'Ninguna'}`;
    }
    
    const nuevaGuia: GuiaAlmacenBackend = {
      nroGuia: proximoCodigo,
      tipoMovimiento: this.formulario.tipo,
      encargado: String(this.formulario.cantidad), 
      motivo: motivoConstruido
    };

    this.guiasService.crear(nuevaGuia).subscribe({
      next: () => {
        this.cargarGuias(); 
        this.cargarProductosReal(); 
        this.limpiarFormulario();
        this.esProductoNuevo = false; 
      },
      error: (err) => alert('Error al procesar el movimiento en la base de datos.')
    });
  }

  eliminarGuia(id: number | undefined): void {
    if (!id) return;
    if (confirm('¿Está seguro de que desea eliminar permanentemente esta guía del almacén?')) {
      this.guiasService.eliminar(id).subscribe({
        next: () => { this.cargarGuias(); },
        error: (err) => console.error('Error al ejecutar el borrado:', err)
      });
    }
  }

  private limpiarFormulario(): void {
    this.formulario = {
      tipo: '', producto: '', cantidad: 0, origen: 'Almacén Central', destino: 'Cava Principal', observacion: '', categoria: 'Tintos', precio: 0, ubicacion: 'Cava Principal'
    };
  }
}