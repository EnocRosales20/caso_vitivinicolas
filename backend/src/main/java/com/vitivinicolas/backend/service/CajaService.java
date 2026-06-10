package com.vitivinicolas.backend.service;

import com.vitivinicolas.backend.model.MovimientoCaja;
import com.vitivinicolas.backend.repository.MovimientoCajaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CajaService {

    private final MovimientoCajaRepository movimientoCajaRepository;

    public CajaService(MovimientoCajaRepository movimientoCajaRepository) {
        this.movimientoCajaRepository = movimientoCajaRepository;
    }

    public MovimientoCaja registrarMovimiento(MovimientoCaja movimiento) {
        return movimientoCajaRepository.save(movimiento);
    }

    public Double calcularIngresos() {
        List<MovimientoCaja> movimientos = movimientoCajaRepository.findAll();
        return movimientos.stream()
                .filter(m -> {
                    String tipo = m.getTipo();
                    return "Depósito".equalsIgnoreCase(tipo) || "Deposito".equalsIgnoreCase(tipo);
                })
                .mapToDouble(m -> m.getMonto().doubleValue())
                .sum();
    }

    public Double calcularRetiros() {
        List<MovimientoCaja> movimientos = movimientoCajaRepository.findAll();
        return movimientos.stream()
                .filter(m -> {
                    String tipo = m.getTipo();
                    return "Retiro".equalsIgnoreCase(tipo);
                })
                .mapToDouble(m -> m.getMonto().doubleValue())
                .sum();
    }

    public Double calcularSaldo() {
        return calcularIngresos() - calcularRetiros();
    }

    public List<MovimientoCaja> listarMovimientos() {
        return movimientoCajaRepository.findAll();
    }
}