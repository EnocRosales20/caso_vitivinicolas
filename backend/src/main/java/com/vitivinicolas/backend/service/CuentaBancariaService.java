package com.vitivinicolas.backend.service;

import com.vitivinicolas.backend.model.CuentaBancaria;
import com.vitivinicolas.backend.repository.CuentaBancariaRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CuentaBancariaService {

    private final CuentaBancariaRepository cuentaBancariaRepository;

    public CuentaBancariaService(CuentaBancariaRepository cuentaBancariaRepository) {
        this.cuentaBancariaRepository = cuentaBancariaRepository;
    }

    public CuentaBancaria registrarCuenta(CuentaBancaria cuenta) {
        return cuentaBancariaRepository.save(cuenta);
    }

    public List<CuentaBancaria> listarCuentas() {
        return cuentaBancariaRepository.findAll();
    }

    public CuentaBancaria obtenerCuenta(Long id) {
        return cuentaBancariaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cuenta no encontrada"));
    }

    public void eliminarCuenta(Long id) {
        cuentaBancariaRepository.deleteById(id);
    }
}