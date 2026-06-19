package com.vitivinicolas.caja.controller;

import com.vitivinicolas.caja.model.MovimientoCaja;
import com.vitivinicolas.caja.service.CajaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/caja")
@CrossOrigin(origins = "http://localhost:4200")
public class CajaController {

    private final CajaService cajaService;

    // CONSTRUCTOR MANUAL (sin Lombok)
    public CajaController(CajaService cajaService) {
        this.cajaService = cajaService;
    }

    @GetMapping
    public ResponseEntity<List<MovimientoCaja>> listarMovimientos() {
        return ResponseEntity.ok(cajaService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MovimientoCaja> obtenerMovimiento(@PathVariable Long id) {
        return ResponseEntity.ok(cajaService.obtenerPorId(id));
    }

    @PostMapping
    public ResponseEntity<MovimientoCaja> registrarMovimiento(@RequestBody MovimientoCaja movimiento) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(cajaService.registrar(movimiento));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MovimientoCaja> actualizarMovimiento(
            @PathVariable Long id,
            @RequestBody MovimientoCaja movimiento) {
        return ResponseEntity.ok(cajaService.actualizar(id, movimiento));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarMovimiento(@PathVariable Long id) {
        cajaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/saldo")
    public ResponseEntity<Map<String, BigDecimal>> obtenerSaldo() {
        return ResponseEntity.ok(Map.of("saldo", cajaService.calcularSaldo()));
    }

    @GetMapping("/tipo/{tipo}")
    public ResponseEntity<List<MovimientoCaja>> obtenerPorTipo(@PathVariable String tipo) {
        return ResponseEntity.ok(cajaService.obtenerPorTipo(tipo));
    }

    @GetMapping("/fechas")
    public ResponseEntity<List<MovimientoCaja>> obtenerPorFechas(
            @RequestParam LocalDateTime inicio,
            @RequestParam LocalDateTime fin) {
        return ResponseEntity.ok(cajaService.obtenerPorRangoFechas(inicio, fin));
    }
}