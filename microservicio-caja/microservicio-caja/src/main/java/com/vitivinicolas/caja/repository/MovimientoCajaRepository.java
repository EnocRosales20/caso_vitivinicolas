package com.vitivinicolas.caja.repository;

import com.vitivinicolas.caja.model.MovimientoCaja;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MovimientoCajaRepository extends JpaRepository<MovimientoCaja, Long> {

    List<MovimientoCaja> findByTipo(String tipo);

    List<MovimientoCaja> findByFechaBetween(LocalDateTime inicio, LocalDateTime fin);

    // 👇 CAMBIADO: usa "Depósito" en vez de "INGRESO"
    @Query("SELECT COALESCE(SUM(CASE WHEN m.tipo = 'Depósito' THEN m.monto ELSE -m.monto END), 0) FROM MovimientoCaja m")
    BigDecimal calcularSaldoActual();
}