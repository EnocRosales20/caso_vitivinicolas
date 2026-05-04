package com.vitivinicolas.backend.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;

import com.vitivinicolas.backend.model.Producto;
import com.vitivinicolas.backend.repository.ProductoRepository;

@RestController
@RequestMapping("/productos")
@CrossOrigin(origins = "http://localhost:4200")
public class ProductoController {

    private final ProductoRepository repo;

    public ProductoController(ProductoRepository repo) {
        this.repo = repo;
    }

    @GetMapping("/filtrar")
    public List<Producto> filtrar(
            @RequestParam String marca,
            @RequestParam String ubicacion
    ) {
        return repo.findByMarcaAndUbicacion(marca, ubicacion);
    }
}