package com.vitivinicolas.backend.controller;

import com.vitivinicolas.backend.model.GuiaAlmacen;
import com.vitivinicolas.backend.service.GuiaAlmacenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/guias-almacen")
@CrossOrigin(origins = "http://localhost:4200")
public class GuiaAlmacenController {

    @Autowired
    private GuiaAlmacenService guiaService;

    @GetMapping
    public List<GuiaAlmacen> obtenerTodas() {
        return guiaService.listarTodas();
    }

    @PostMapping
    public ResponseEntity<?> crearGuia(@RequestBody GuiaAlmacen guia) {
        try {
            // Forzamos a que el ID sea nulo para que Hibernate entienda que es una INSERCIÓN limpia
            guia.setId(null); 
            
            System.out.println("Recibiendo payload en el controlador:");
            System.out.println("Movimiento: " + guia.getTipoMovimiento());
            System.out.println("Motivo: " + guia.getMotivo());
            System.out.println("Encargado (Cantidad): " + guia.getEncargado());

            GuiaAlmacen nuevaGuia = guiaService.guardar(guia);
            return ResponseEntity.ok(nuevaGuia);
        } catch (Exception e) {
            System.err.println("Error en Controlador: " + e.getMessage());
            return ResponseEntity.status(500).body("Error interno: " + e.getMessage());
        }
    }
}