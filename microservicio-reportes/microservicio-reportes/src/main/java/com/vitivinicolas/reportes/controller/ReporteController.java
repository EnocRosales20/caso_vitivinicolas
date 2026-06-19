package com.vitivinicolas.reportes.controller;

import com.vitivinicolas.reportes.model.Reporte;
import com.vitivinicolas.reportes.service.ReporteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reportes")
@CrossOrigin(origins = "http://localhost:4200")
public class ReporteController {
    
    @Autowired
    private ReporteService reporteService;
    
    @PostMapping("/generar/{tipo}")
    public ResponseEntity<Reporte> generarReporte(
            @PathVariable String tipo,
            @RequestParam String responsable) {
        System.out.println("=== CONTROLLER: Recibida peticion ===");
        System.out.println("Tipo recibido: " + tipo);
        System.out.println("Responsable: " + responsable);
        
        Reporte reporte = reporteService.generarReporte(tipo, responsable);
        
        System.out.println("CONTROLLER: Retornando reporte de tipo: " + reporte.getTipo());
        return ResponseEntity.status(HttpStatus.CREATED).body(reporte);
    }
    
    @GetMapping
    public ResponseEntity<List<Reporte>> getAllReportes() {
        return ResponseEntity.ok(reporteService.getAllReportes());
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> eliminarReporte(@PathVariable Long id) {
        reporteService.eliminarReporte(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Reporte eliminado correctamente");
        return ResponseEntity.ok(response);
    }
}