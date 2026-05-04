package com.vitivinicolas.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.vitivinicolas.backend.model.Producto;

import java.util.List;

public interface ProductoRepository extends JpaRepository<Producto, Long> {

    List<Producto> findByMarcaAndUbicacion(String marca, String ubicacion);
}