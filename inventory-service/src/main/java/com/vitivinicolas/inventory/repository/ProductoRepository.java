package com.vitivinicolas.inventory.repository;

import com.vitivinicolas.inventory.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ProductoRepository extends JpaRepository<Producto, Long> {
    
    List<Producto> findByNombreContainingIgnoreCaseAndCategoriaContainingIgnoreCaseAndUbicacionContainingIgnoreCase(
            String nombre, String categoria, String ubicacion);

    Optional<Producto> findByNombre(String nombre);
}