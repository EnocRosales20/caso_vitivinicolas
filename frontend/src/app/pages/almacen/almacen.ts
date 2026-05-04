import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AlmacenService } from '../../core/services/almacen.service';

interface Producto {
  id: number;
  codigo: string;
  nombre: string;
  categoria: string;
  ubicacion: string;
  stock: number;
}

@Component({
  selector: 'app-almacen',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './almacen.html',
  styleUrl: './almacen.scss',
})
export class Almacen implements OnInit {
  buscarProducto = '';
  buscarCategoria = '';
  buscarAlmacen = '';

  productos: Producto[] = [];

  constructor(
    private almacenService: AlmacenService,
    private cdr: ChangeDetectorRef // Inyectamos el detector de cambios
  ) {}

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos() {
    this.almacenService.listarTodos().subscribe((data: Producto[]) => {
      this.productos = data;
      this.cdr.detectChanges(); // Forzamos la actualización visual
    });
  }

  buscarBackend() {
    this.almacenService
      .filtrarStock(this.buscarProducto, this.buscarCategoria, this.buscarAlmacen)
      .subscribe((data: Producto[]) => {
        this.productos = data;
        this.cdr.detectChanges(); // Forzamos la actualización al filtrar
      });
  }

  limpiarFiltros() {
    this.buscarProducto = '';
    this.buscarCategoria = '';
    this.buscarAlmacen = '';
    this.cargarProductos();
  }

  actualizarStock(item: Producto) {
    this.almacenService.actualizarStock(item.id, item.stock).subscribe({
      next: () => {
        alert("Stock actualizado correctamente");
        this.cargarProductos();
      },
      error: (err) => {
        console.error(err);
        alert("Error al actualizar el stock");
      }
    });
  }

  get totalProductos() {
    return this.productos.length;
  }

  get stockTotal() {
    return this.productos.reduce((total, p) => total + p.stock, 0);
  }

  get stockBajo() {
    return this.productos.filter(p => p.stock <= 20).length;
  }
}