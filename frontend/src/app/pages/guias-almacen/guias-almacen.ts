import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface GuiaAlmacen {
  codigo: string;
  tipo: string;
  producto: string;
  cantidad: number;
  origen: string;
  destino: string;
  fecha: string;
  estado: string;
  observacion: string;
}

@Component({
  selector: 'app-guias-almacen',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './guias-almacen.html',
  styleUrl: './guias-almacen.scss',
})
export class GuiasAlmacen {
  guia: GuiaAlmacen = {
    codigo: '',
    tipo: '',
    producto: '',
    cantidad: 0,
    origen: '',
    destino: '',
    fecha: '',
    estado: 'Registrada',
    observacion: ''
  };

  guias: GuiaAlmacen[] = [
    {
      codigo: 'G001',
      tipo: 'Compra',
      producto: 'Botella 750 ml',
      cantidad: 200,
      origen: 'Proveedor',
      destino: 'Almacén Central',
      fecha: '2026-05-02',
      estado: 'Registrada',
      observacion: 'Ingreso de envases'
    },
    {
      codigo: 'G002',
      tipo: 'Venta',
      producto: 'Vino Tinto Reserva',
      cantidad: 30,
      origen: 'Bodega Norte',
      destino: 'Cliente',
      fecha: '2026-05-02',
      estado: 'Despachada',
      observacion: 'Salida por venta'
    },
    {
      codigo: 'G003',
      tipo: 'Traslado',
      producto: 'Pisco Acholado',
      cantidad: 50,
      origen: 'Bodega Sur',
      destino: 'Almacén Central',
      fecha: '2026-05-02',
      estado: 'Registrada',
      observacion: 'Reubicación interna'
    }
  ];

  get totalGuias() {
    return this.guias.length;
  }

  get totalCompras() {
    return this.guias.filter(g => g.tipo === 'Compra').length;
  }

  get totalVentas() {
    return this.guias.filter(g => g.tipo === 'Venta').length;
  }

  get totalTraslados() {
    return this.guias.filter(g => g.tipo === 'Traslado').length;
  }

  registrarGuia() {
    if (!this.guia.tipo || !this.guia.producto || !this.guia.cantidad || !this.guia.fecha) {
      alert('Complete los campos obligatorios');
      return;
    }

    const nuevoCodigo = 'G' + String(this.guias.length + 1).padStart(3, '0');

    this.guias.unshift({
      ...this.guia,
      codigo: nuevoCodigo
    });

    this.guia = {
      codigo: '',
      tipo: '',
      producto: '',
      cantidad: 0,
      origen: '',
      destino: '',
      fecha: '',
      estado: 'Registrada',
      observacion: ''
    };
  }

  eliminarGuia(codigo: string) {
    this.guias = this.guias.filter(g => g.codigo !== codigo);
  }
}
