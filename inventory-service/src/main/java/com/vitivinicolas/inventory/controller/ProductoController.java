package com.vitivinicolas.inventory.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.vitivinicolas.inventory.model.Producto;
import com.vitivinicolas.inventory.repository.ProductoRepository;

@RestController
@RequestMapping("/api/productos") // Mapeo estándar para microservicios
@CrossOrigin(origins = "http://localhost:4200") // Permiso directo a tu Angular
public class ProductoController {

    private final ProductoRepository repo;

    public ProductoController(ProductoRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Producto> listarTodos() {
        return repo.findAll();
    }

    @GetMapping("/produccion-actual")
    public int obtenerProduccionActual() {
        return repo.findAll()
                .stream()
                .mapToInt(Producto::getStock)
                .sum();
    }

    @GetMapping("/filtrar")
    public List<Producto> filtrar(
            @RequestParam(defaultValue = "") String nombre,
            @RequestParam(defaultValue = "") String categoria,
            @RequestParam(defaultValue = "") String ubicacion
    ) {
        return repo.findByNombreContainingIgnoreCaseAndCategoriaContainingIgnoreCaseAndUbicacionContainingIgnoreCase(
                nombre, categoria, ubicacion);
    }

    // NUEVO ENDPOINT INTER-SERVICIO: Permite buscar si el vino existe usando el nombre
    @GetMapping("/buscar-por-nombre")
    public Producto obtenerPorNombre(@RequestParam String nombre) {
        return repo.findByNombre(nombre)
                .orElseThrow(() -> new RuntimeException("Vino no encontrado en el catálogo"));
    }

    @PutMapping("/{id}/stock")
    public Producto actualizarStock(@PathVariable Long id, @RequestBody int cantidad) {
        Producto producto = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
        
        producto.setStock(cantidad);
        return repo.save(producto);
    }

    // NUEVO ENDPOINT INTER-SERVICIO: Permite registrar un vino desde el servicio de guías si es nuevo
    @PostMapping
    public Producto crearProducto(@RequestBody Producto nuevoProducto) {
        return repo.save(nuevoProducto);
    }
}