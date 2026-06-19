package com.vitivinicolas.cuentas.service;

import com.vitivinicolas.cuentas.model.CuentaBancaria;
import com.vitivinicolas.cuentas.repository.CuentaBancariaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CuentaBancariaService {

    private final CuentaBancariaRepository cuentaRepository;

    public CuentaBancariaService(CuentaBancariaRepository cuentaRepository) {
        this.cuentaRepository = cuentaRepository;
    }

    public List<CuentaBancaria> listarTodas() {
        return cuentaRepository.findAll();
    }

    public CuentaBancaria obtenerPorId(Long id) {
        return cuentaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cuenta bancaria no encontrada con ID: " + id));
    }

    @Transactional
    public CuentaBancaria crear(CuentaBancaria cuenta) {
        // Validar que el número de cuenta no esté duplicado
        return cuentaRepository.save(cuenta);
    }

    @Transactional
    public CuentaBancaria actualizar(Long id, CuentaBancaria cuentaActualizada) {
        CuentaBancaria cuenta = obtenerPorId(id);

        cuenta.setNombreBanco(cuentaActualizada.getNombreBanco());
        cuenta.setNumeroCuenta(cuentaActualizada.getNumeroCuenta());
        cuenta.setTipoCuenta(cuentaActualizada.getTipoCuenta());
        cuenta.setSaldo(cuentaActualizada.getSaldo());
        cuenta.setMoneda(cuentaActualizada.getMoneda());
        cuenta.setFechaApertura(cuentaActualizada.getFechaApertura());
        cuenta.setTitular(cuentaActualizada.getTitular());

        return cuentaRepository.save(cuenta);
    }

    @Transactional
    public void eliminar(Long id) {
        CuentaBancaria cuenta = obtenerPorId(id);
        cuentaRepository.delete(cuenta);
    }

    public List<CuentaBancaria> buscarPorBanco(String nombreBanco) {
        return cuentaRepository.findByNombreBancoContainingIgnoreCase(nombreBanco);
    }

    public List<CuentaBancaria> buscarPorTitular(String titular) {
        return cuentaRepository.findByTitularContainingIgnoreCase(titular);
    }
}