import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // <-- Corregido el módulo que causaba error de compilación
//import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { GuiasAlmacenService, GuiaAlmacenBackend } from './guias-almacen.service';
import { AlmacenService } from '../../core/services/almacen.service'; // <-- Inyectamos el servicio de inventario

@Component({
  selector: 'app-guias-almacen',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './guias-almacen.html',
  styleUrl: './guias-almacen.scss',
  providers: [GuiasAlmacenService]
})
export class GuiasAlmacen implements OnInit {
  productos: any[] = []; 
  guias: any[] = [];
  esProductoNuevo: boolean = false; // Variable de control para el formulario dinámico

  // Objeto unificado enlazado al formulario de la vista
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
    // CAMBIO CLAVE: Ahora trae los productos reales del Microservicio de Inventario (Puerto 8081)
    this.almacenService.listarTodos().subscribe({
      next: (data) => {
        this.productos = data;
      },
      error: (err) => {
        console.error('Error al recuperar productos remotos:', err);
        // Respaldo por si el microservicio de inventario está apagado en la prueba
        this.productos = [{ nombre: 'Malbec Gran Reserva' }, { nombre: 'Cabernet Sauvignon' }];
      }
    });
  }
  
  cargarGuias(): void {
    this.guiasService.listar().subscribe({
      next: (data) => {
        this.guias = data;
      },
      error: (err) => console.error('Error al recuperar guías desde el backend:', err)
    });
  }

  // Contadores calculados dinámicamente para los paneles del dashboard
  get totalGuias(): number {
    return this.guias.length;
  }

  get totalCompras(): number {
    return this.guias.filter(g => g.tipoMovimiento === 'Compra' || g.tipoMovimiento === 'INGRESO').length;
  }

  get totalVentas(): number {
    return this.guias.filter(g => g.tipoMovimiento === 'Venta' || g.tipoMovimiento === 'SALIDA').length;
  }

  get totalTraslados(): number {
    return this.guias.filter(g => g.tipoMovimiento === 'Traslado').length;
  }

  registrarGuia(): void {
    if (!this.formulario.tipo || !this.formulario.producto || !this.formulario.cantidad) {
      alert('Por favor, complete los campos obligatorios del formulario.');
      return;
    }

    // Generar un correlativo automático para la guía (Ej: G-001, G-002...)
    const proximoCodigo = 'G-' + String(this.guias.length + 1).padStart(3, '0');
    
    // Construcción del motivo condicional según si el producto es nuevo o existente
    let motivoConstruido = '';
    if (this.esProductoNuevo && this.formulario.tipo === 'Compra') {
      // Si es de estreno, empaqueta todos sus atributos para el INSERT del Backend
      motivoConstruido = `Prod: ${this.formulario.producto} | Cat: ${this.formulario.categoria} | Precio: ${this.formulario.precio} | Ubic: ${this.formulario.ubicacion} | Obs: ${this.formulario.observacion || 'Registro inicial'}`;
    } else {
      // Si ya existe, envía la trama básica para el UPDATE de stock estándar
      motivoConstruido = `Prod: ${this.formulario.producto} | Cant: ${this.formulario.cantidad} | De: ${this.formulario.origen} a ${this.formulario.destino} | Obs: ${this.formulario.observacion || 'Ninguna'}`;
    }
    
    // Mapeo final del objeto que va hacia Spring Boot
    const nuevaGuia: GuiaAlmacenBackend = {
      nroGuia: proximoCodigo,
      tipoMovimiento: this.formulario.tipo,
      encargado: String(this.formulario.cantidad), // Guardamos la cantidad numérica aquí para su fácil extracción con Integer.parseInt()
      motivo: motivoConstruido
    };

    this.guiasService.crear(nuevaGuia).subscribe({
      next: () => {
        this.cargarGuias(); // Refresca instantáneamente el historial de la derecha
        this.cargarProductosReal(); // Refresca el stock real del inventario después de cada movimiento
        this.limpiarFormulario();
        this.esProductoNuevo = false; // Resetea el interruptor visual
      },
      error: (err) => alert('Error al procesar el movimiento en la base de datos.')
    });
  }

  eliminarGuia(id: number | undefined): void {
    if (!id) return;
    
    if (confirm('¿Está seguro de que desea eliminar permanentemente esta guía del almacén?')) {
      this.guiasService.eliminar(id).subscribe({
        next: () => {
          this.cargarGuias(); // Recarga la cuadrícula desde Postgres
        },
        error: (err) => console.error('Error al ejecutar el borrado:', err)
      });
    }
  }

  private limpiarFormulario(): void {
    this.formulario = {
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
  }
}