package com.vitivinicolas.caja.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "movimiento_caja")
public class MovimientoCaja {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String tipo;

    @Column(nullable = false)
    private String cuenta;

    @Column(nullable = false)
    private BigDecimal monto;

    @Column(name = "fecha_movimiento", nullable = false)
    private LocalDateTime fecha;

    @Column(nullable = false)
    private String motivo;

    @Column(name = "usuario_registro")
    private String usuarioRegistro;

    // CONSTRUCTOR VACÍO
    public MovimientoCaja() {}

    // CONSTRUCTOR CON PARÁMETROS
    public MovimientoCaja(String tipo, String cuenta, BigDecimal monto, LocalDateTime fecha, String motivo, String usuarioRegistro) {
        this.tipo = tipo;
        this.cuenta = cuenta;
        this.monto = monto;
        this.fecha = fecha;
        this.motivo = motivo;
        this.usuarioRegistro = usuarioRegistro;
    }

    // GETTERS Y SETTERS MANUALES
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public String getCuenta() {
        return cuenta;
    }

    public void setCuenta(String cuenta) {
        this.cuenta = cuenta;
    }

    public BigDecimal getMonto() {
        return monto;
    }

    public void setMonto(BigDecimal monto) {
        this.monto = monto;
    }

    public LocalDateTime getFecha() {
        return fecha;
    }

    public void setFecha(LocalDateTime fecha) {
        this.fecha = fecha;
    }

    public String getMotivo() {
        return motivo;
    }

    public void setMotivo(String motivo) {
        this.motivo = motivo;
    }

    public String getUsuarioRegistro() {
        return usuarioRegistro;
    }

    public void setUsuarioRegistro(String usuarioRegistro) {
        this.usuarioRegistro = usuarioRegistro;
    }

    @PrePersist
    public void prePersist() {
        if (fecha == null) {
            fecha = LocalDateTime.now();
        }
    }
}