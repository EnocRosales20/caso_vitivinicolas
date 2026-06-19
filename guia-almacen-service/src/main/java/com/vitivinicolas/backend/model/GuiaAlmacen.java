package com.vitivinicolas.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "guia_almacen")
public class GuiaAlmacen {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nroGuia; // Ej: G-2026-001

    @Column(nullable = false)
    private String tipoMovimiento; // "INGRESO" o "SALIDA"

    @Column(nullable = false)
    private String encargado;

    @Column(nullable = false)
    private String motivo; // Ej: "Compra a proveedor", "Merma por rotura"

    private LocalDateTime fechaCreacion;

    @PrePersist
    protected void onCreate() {
        this.fechaCreacion = LocalDateTime.now();
    }

    // --- GETTERS Y SETTERS ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNroGuia() { return nroGuia; }
    public void setNroGuia(String nroGuia) { this.nroGuia = nroGuia; }

    public String getTipoMovimiento() { return tipoMovimiento; }
    public void setTipoMovimiento(String tipoMovimiento) { this.tipoMovimiento = tipoMovimiento; }

    public String getEncargado() { return encargado; }
    public void setEncargado(String encargado) { this.encargado = encargado; }

    public String getMotivo() { return motivo; }
    public void setMotivo(String motivo) { this.motivo = motivo; }

    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }
}