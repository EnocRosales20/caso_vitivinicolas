package com.vitivinicolas.caja.service;

import com.vitivinicolas.caja.model.MovimientoCaja;
import com.vitivinicolas.caja.repository.MovimientoCajaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class CajaService {

    private final MovimientoCajaRepository movimientoRepository;

    public CajaService(MovimientoCajaRepository movimientoRepository) {
        this.movimientoRepository = movimientoRepository;
    }

    public List<MovimientoCaja> listarTodos() {
        return movimientoRepository.findAll();
    }

    public MovimientoCaja obtenerPorId(Long id) {
        return movimientoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Movimiento no encontrado con ID: " + id));
    }

    @Transactional
    public MovimientoCaja registrar(MovimientoCaja movimiento) {
        // 👇 CAMBIADO: usa "Depósito" y "Retiro"
        if (!movimiento.getTipo().equals("Depósito") && !movimiento.getTipo().equals("Retiro")) {
            throw new RuntimeException("Tipo debe ser Depósito o Retiro");
        }

        if (movimiento.getMonto().compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("El monto debe ser mayor a 0");
        }

        // 👇 CAMBIADO: usa "Retiro" en vez de "EGRESO"
        if (movimiento.getTipo().equals("Retiro")) {
            BigDecimal saldoActual = calcularSaldo();
            if (movimiento.getMonto().compareTo(saldoActual) > 0) {
                throw new RuntimeException("Saldo insuficiente. Saldo actual: " + saldoActual);
            }
        }

        movimiento.setFecha(LocalDateTime.now());
        return movimientoRepository.save(movimiento);
    }

    @Transactional
    public MovimientoCaja actualizar(Long id, MovimientoCaja movimientoActualizado) {
        MovimientoCaja movimiento = obtenerPorId(id);

        movimiento.setTipo(movimientoActualizado.getTipo());
        movimiento.setCuenta(movimientoActualizado.getCuenta());
        movimiento.setMonto(movimientoActualizado.getMonto());
        movimiento.setMotivo(movimientoActualizado.getMotivo());

        return movimientoRepository.save(movimiento);
    }

    @Transactional
    public void eliminar(Long id) {
        MovimientoCaja movimiento = obtenerPorId(id);
        movimientoRepository.delete(movimiento);
    }

    public BigDecimal calcularSaldo() {
        BigDecimal saldo = movimientoRepository.calcularSaldoActual();
        return saldo != null ? saldo : BigDecimal.ZERO;
    }

    public List<MovimientoCaja> obtenerPorTipo(String tipo) {
        return movimientoRepository.findByTipo(tipo);
    }

    public List<MovimientoCaja> obtenerPorRangoFechas(LocalDateTime inicio, LocalDateTime fin) {
        return movimientoRepository.findByFechaBetween(inicio, fin);
    }
}