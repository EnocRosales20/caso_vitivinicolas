import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface Producto {
  codigo: string;
  producto: string;
  categoria: string;
  almacen: string;
  stock: number;
}

@Component({
  selector: 'app-almacen',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './almacen.html',
  styleUrl: './almacen.scss',
})
export class Almacen {
  buscarProducto = '';
  buscarCategoria = '';
  buscarAlmacen = '';

  productos: Producto[] = [
    {
      codigo: 'P001',
      producto: 'Pisco Acholado',
      categoria: 'Bebidas',
      almacen: 'Bodega Sur',
      stock: 120
    },
    {
      codigo: 'P002',
      producto: 'Corcho Premium',
      categoria: 'Insumos',
      almacen: 'Almacén Central',
      stock: 300
    },
    {
      codigo: 'P003',
      producto: 'Botella 750 ml',
      categoria: 'Envases',
      almacen: 'Almacén Central',
      stock: 80
    },
    {
      codigo: 'P004',
      producto: 'Vino Tinto Reserva',
      categoria: 'Bebidas',
      almacen: 'Bodega Norte',
      stock: 25
    }
  ];

  get productosFiltrados(): Producto[] {
    return this.productos.filter(p =>
      p.producto.toLowerCase().includes(this.buscarProducto.toLowerCase()) &&
      p.categoria.toLowerCase().includes(this.buscarCategoria.toLowerCase()) &&
      p.almacen.toLowerCase().includes(this.buscarAlmacen.toLowerCase())
    );
  }

  get totalProductos() {
    return this.productos.length;
  }

  get stockTotal() {
    return this.productos.reduce((total, p) => total + p.stock, 0);
  }

  get stockBajo() {
    return this.productos.filter(p => p.stock <= 50).length;
  }

  limpiarFiltros() {
    this.buscarProducto = '';
    this.buscarCategoria = '';
    this.buscarAlmacen = '';
  }
}
