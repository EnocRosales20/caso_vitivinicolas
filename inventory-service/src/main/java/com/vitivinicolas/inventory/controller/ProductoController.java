package com.vitivinicolas.inventory.controller;

import com.vitivinicolas.inventory.model.Producto;
import com.vitivinicolas.inventory.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = "http://localhost:4200")
public class ProductoController {

    @Autowired
    private ProductoRepository productoRepository;

    /**
     * 1. RUTA RAÍZ (GET /api/productos): Usada por la gráfica circular al cargar el dashboard.
     * Trae la lista completa sin restricciones para no romper las porciones del gráfico.
     */
    @GetMapping
    public ResponseEntity<List<Producto>> listarTodos() {
        System.out.println("Gráfica solicitando la carga masiva del catálogo.");
        List<Producto> lista = productoRepository.findAll();
        return ResponseEntity.ok(lista);
    }

    /**
     * 🔍 2. RUTA DE FILTRADO (GET /api/productos/filtrar): ¡EXCLUSIVA PARA TU TABLA DE CONSULTA!
     * Resuelve el error 405 mapeando la petición del botón "Consultar" de Angular.
     */
    @GetMapping("/filtrar")
    public ResponseEntity<List<Producto>> filtrarProductos(
            @RequestParam(value = "nombre", required = false, defaultValue = "") String nombre,
            @RequestParam(value = "categoria", required = false, defaultValue = "") String categoria,
            @RequestParam(value = "ubicacion", required = false, defaultValue = "") String ubicacion) {
        
        System.out.println("🔍 Buscador de Tabla procesando filtros -> Producto: [" + nombre + "], Categoría: [" + categoria + "], Almacén: [" + ubicacion + "]");
        
        List<Producto> filtrados = productoRepository.findByNombreContainingIgnoreCaseAndCategoriaContainingIgnoreCaseAndUbicacionContainingIgnoreCase(
                nombre.trim(), categoria.trim(), ubicacion.trim()
        );
        
        return ResponseEntity.ok(filtrados);
    }

    /**
     * 3. RUTA DE VALIDACIÓN (GET /api/productos/buscar-por-nombre): Usada por las guías de almacén.
     * Devuelve un objeto único estricto para procesar incrementos/decrementos de stock de forma segura.
     */
    @GetMapping("/buscar-por-nombre")
    public ResponseEntity<Producto> buscarParaGuia(@RequestParam("nombre") String nombre) {
        String nombreLimpio = nombre.trim();
        System.out.println("Guía de Almacén buscando coincidencia exacta para: [" + nombreLimpio + "]");
        
        return productoRepository.findByNombre(nombreLimpio)
                .map(producto -> ResponseEntity.ok(producto))
                .orElseGet(() -> {
                    System.out.println(" Error: '" + nombreLimpio + "' no existe en las tablas de Postgres.");
                    return ResponseEntity.status(404).build();
                });
    }

    /**
     * 4. RUTA DE ACTUALIZACIÓN (PUT /api/productos/{id}): Sincroniza los nuevos saldos físicos.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Producto> actualizarProducto(@PathVariable("id") Long id, @RequestBody Producto productoDetalles) {
        System.out.println("Remoto solicitando actualizar stock para el ID: " + id + " a: " + productoDetalles.getStock());
        
        return productoRepository.findById(id)
                .map(productoExistente -> {
                    productoExistente.setStock(productoDetalles.getStock());
                    Producto productoActualizado = productoRepository.save(productoExistente);
                    return ResponseEntity.ok(productoActualizado);
                })
                .orElseGet(() -> ResponseEntity.status(404).build());
    }
}