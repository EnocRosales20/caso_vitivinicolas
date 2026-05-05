package com.vitivinicolas.backend.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.vitivinicolas.backend.model.CuentaBancaria;
import com.vitivinicolas.backend.repository.CuentaBancariaRepository;

@RestController
@RequestMapping("/cuentas-bancarias")
@CrossOrigin(origins = "http://localhost:4200")
public class CuentaBancariaController {

    private final CuentaBancariaRepository repo;

    public CuentaBancariaController(CuentaBancariaRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<CuentaBancaria> listarTodas() {
        return repo.findAll();
    }

    @GetMapping("/{id}")
    public CuentaBancaria obtenerPorId(@PathVariable Long id) {
        return repo.findById(id)
            .orElseThrow(() -> new RuntimeException("Cuenta bancaria no encontrada"));
    }

    @PostMapping
    public CuentaBancaria crear(@RequestBody CuentaBancaria cuenta) {
        return repo.save(cuenta);
    }

    @PutMapping("/{id}")
    public CuentaBancaria actualizar(@PathVariable Long id, @RequestBody CuentaBancaria cuentaDetails) {
        CuentaBancaria cuenta = repo.findById(id)
            .orElseThrow(() -> new RuntimeException("Cuenta bancaria no encontrada"));
        
        cuenta.setNombreBanco(cuentaDetails.getNombreBanco());
        cuenta.setNumeroCuenta(cuentaDetails.getNumeroCuenta());
        cuenta.setTipoCuenta(cuentaDetails.getTipoCuenta());
        cuenta.setSaldo(cuentaDetails.getSaldo());
        cuenta.setMoneda(cuentaDetails.getMoneda());
        cuenta.setFechaApertura(cuentaDetails.getFechaApertura());
        cuenta.setTitular(cuentaDetails.getTitular());
        
        return repo.save(cuenta);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        CuentaBancaria cuenta = repo.findById(id)
            .orElseThrow(() -> new RuntimeException("Cuenta bancaria no encontrada"));
        repo.delete(cuenta);
    }
}