package com.vitivinicolas.backend.repository;

package com.vitivinicolas.backend.repository;

import com.vitivinicolas.backend.model.GuiaAlmacen;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface GuiaAlmacenRepository extends JpaRepository<GuiaAlmacen, Long> {
    // Consulta personalizada opcional por si quieres buscar por número de guía
    Optional<GuiaAlmacen> findByNroGuia(String nroGuia);
}