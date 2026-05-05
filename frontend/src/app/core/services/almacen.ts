import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Almacen {

  constructor(private http: HttpClient) {}

  filtrarStock(marca: string, ubicacion: string) {
    return this.http.get(
      `http://localhost:8080/productos/filtrar?marca=${marca}&ubicacion=${ubicacion}`
    );
  }
}