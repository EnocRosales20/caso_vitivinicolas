package com.vitivinicolas.backend.repository;

import com.vitivinicolas.backend.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductoRepository extends JpaRepository<Producto, Long> {
    
    List<Producto> findByNombreContainingIgnoreCaseAndCategoriaContainingIgnoreCaseAndUbicacionContainingIgnoreCase(
            String nombre, String categoria, String ubicacion);
}