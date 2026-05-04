import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlmacenService {

  private apiUrl = 'http://localhost:8080/productos';

  constructor(private http: HttpClient) {}

  // 1. Trae todos los productos
  listarTodos(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // 2. ACTUALIZAR STOCK
  actualizarStock(id: number, cantidad: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/stock`, cantidad);
  }

  // 3. FILTRAR STOCK (Consolidado: acepta los 3 parámetros)
  filtrarStock(nombre: string, categoria: string, ubicacion: string): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/filtrar?nombre=${nombre}&categoria=${categoria}&ubicacion=${ubicacion}`
    );
  }
}