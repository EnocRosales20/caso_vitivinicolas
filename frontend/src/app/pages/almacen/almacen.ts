import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AlmacenService } from '../../core/services/almacen.service';

// IMPORTANTE: Agregué el 'id' a la interfaz, es vital para actualizar
interface Producto {
  id: number; 
  codigo: string;
  producto: string; // Este nombre coincide con tu @JsonProperty("producto")
  categoria: string;
  almacen: string; // Este nombre coincide con tu @JsonProperty("almacen")
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

  constructor(private almacenService: AlmacenService) {}

  ngOnInit() {
    this.cargarProductos(); // Usamos el nombre estandarizado
  }

  // Método unificado para cargar la lista
  cargarProductos() {
    this.almacenService.listarTodos().subscribe((data: Producto[]) => {
      this.productos = data;
    });
  }

  // En tu método buscarBackend() dentro de almacen.ts
  buscarBackend() {
    this.almacenService
    // Ahora pasamos 3 variables. Si una está vacía, el Backend la tratará como ""
    .filtrarStock(this.buscarProducto, this.buscarCategoria, this.buscarAlmacen)
    .subscribe((data: any) => {
      this.productos = data;
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
        // Recargamos la lista para ver los cambios
        this.cargarProductos(); 
      },
      error: (err) => {
        console.error(err);
        alert("Error al actualizar el stock");
      }
    });
  }

  // --- MÉTODOS PARA LAS TARJETAS DE RESUMEN ---
  
  get totalProductos() {
    return this.productos.length;
  }

  get stockTotal() {
    return this.productos.reduce((total, p) => total + p.stock, 0);
  }

  get stockBajo() {
    return this.productos.filter(p => p.stock <= 20).length; // Ajusté a 20 para que coincida con tu badge de "Crítico"
  }
}