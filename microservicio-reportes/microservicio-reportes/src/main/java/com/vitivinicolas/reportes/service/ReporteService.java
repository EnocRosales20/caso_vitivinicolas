package com.vitivinicolas.reportes.service;

import com.vitivinicolas.reportes.model.Reporte;
import com.vitivinicolas.reportes.repository.ReporteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class ReporteService {
    
    @Autowired
    private ReporteRepository reporteRepository;

    public Reporte generarReporte(String tipo, String responsable) {
        System.out.println("=== SERVICE: Generando reporte ===");
        System.out.println("Tipo recibido: " + tipo);
        
        Reporte reporte = new Reporte();
        reporte.setCodigo(generarCodigo());
        reporte.setTipo(tipo);
        reporte.setPeriodo(getPeriodoActual());
        reporte.setResponsable(responsable);
        reporte.setEstado("Generado");
        reporte.setFecha(LocalDate.now());
        reporte.setContenido("Reporte generado correctamente");
        
        Reporte saved = reporteRepository.save(reporte);
        System.out.println("Reporte guardado con ID: " + saved.getId() + " y tipo: " + saved.getTipo());
        return saved;
    }
    
    private String generarCodigo() {
        long count = reporteRepository.count() + 1;
        return String.format("R%03d", count);
    }
    
    private String getPeriodoActual() {
        return LocalDate.now().format(DateTimeFormatter.ofPattern("MMMM yyyy"));
    }
    
    public List<Reporte> getAllReportes() {
        return reporteRepository.findAllByOrderByFechaDesc();
    }
    
    @Transactional
    public void eliminarReporte(Long id) {
        if (!reporteRepository.existsById(id)) {
            throw new RuntimeException("Reporte no encontrado con ID: " + id);
        }
        reporteRepository.deleteById(id);
    }
}