package com.vitivinicolas.backend.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.vitivinicolas.backend.model.Producto;
import com.vitivinicolas.backend.repository.ProductoRepository;

@RestController
@RequestMapping("/productos")
public class ProductoController {

    private final ProductoRepository repo;

    public ProductoController(ProductoRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Producto> listarTodos() {
        return repo.findAll();
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

    @PutMapping("/{id}/stock")
    public Producto actualizarStock(@PathVariable Long id, @RequestBody int cantidad) {
        Producto producto = repo.findById(id)
            .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
        
        producto.setStock(cantidad);
        return repo.save(producto);
    }
}