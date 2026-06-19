package com.vitivinicolas.cuentas.controller;

import com.vitivinicolas.cuentas.model.CuentaBancaria;
import com.vitivinicolas.cuentas.service.CuentaBancariaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cuentas")
@CrossOrigin(origins = "http://localhost:4200")
public class CuentaBancariaController {

    private final CuentaBancariaService cuentaService;

    public CuentaBancariaController(CuentaBancariaService cuentaService) {
        this.cuentaService = cuentaService;
    }

    @GetMapping
    public ResponseEntity<List<CuentaBancaria>> listarTodas() {
        return ResponseEntity.ok(cuentaService.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CuentaBancaria> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(cuentaService.obtenerPorId(id));
    }

    @PostMapping
    public ResponseEntity<CuentaBancaria> crear(@RequestBody CuentaBancaria cuenta) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(cuentaService.crear(cuenta));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CuentaBancaria> actualizar(@PathVariable Long id, @RequestBody CuentaBancaria cuenta) {
        return ResponseEntity.ok(cuentaService.actualizar(id, cuenta));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        cuentaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/buscar/banco")
    public ResponseEntity<List<CuentaBancaria>> buscarPorBanco(@RequestParam String nombre) {
        return ResponseEntity.ok(cuentaService.buscarPorBanco(nombre));
    }

    @GetMapping("/buscar/titular")
    public ResponseEntity<List<CuentaBancaria>> buscarPorTitular(@RequestParam String titular) {
        return ResponseEntity.ok(cuentaService.buscarPorTitular(titular));
    }
}