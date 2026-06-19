package com.vitivinicolas.reportes.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.time.LocalDate;

@Entity
@Table(name = "reportes")
public class Reporte {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String codigo;
    
    @Column(nullable = false)
    private String tipo;
    
    @Column(nullable = false)
    private String periodo;
    
    @Column(nullable = false)
    private String responsable;
    
    @Column(nullable = false)
    private String estado;
    
    @Column(nullable = false)
    private LocalDate fecha;
    
    @Column(columnDefinition = "TEXT")
    private String contenido;
    
    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion;
    
    private Double totalIngresos;
    private Double totalEgresos;
    private Double saldoFinal;
    private Integer totalProductos;
    private Integer productosCriticos;
    private Integer totalCuentas;
    private Double saldoTotalCuentas;
    private Integer totalGuias;
    
    public Reporte() {
        this.fechaCreacion = LocalDateTime.now();
    }
    
    // GETTERS Y SETTERS
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getCodigo() { return codigo; }
    public void setCodigo(String codigo) { this.codigo = codigo; }
    
    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    
    public String getPeriodo() { return periodo; }
    public void setPeriodo(String periodo) { this.periodo = periodo; }
    
    public String getResponsable() { return responsable; }
    public void setResponsable(String responsable) { this.responsable = responsable; }
    
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    
    public LocalDate getFecha() { return fecha; }
    public void setFecha(LocalDate fecha) { this.fecha = fecha; }
    
    public String getContenido() { return contenido; }
    public void setContenido(String contenido) { this.contenido = contenido; }
    
    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }
    
    public Double getTotalIngresos() { return totalIngresos; }
    public void setTotalIngresos(Double totalIngresos) { this.totalIngresos = totalIngresos; }
    
    public Double getTotalEgresos() { return totalEgresos; }
    public void setTotalEgresos(Double totalEgresos) { this.totalEgresos = totalEgresos; }
    
    public Double getSaldoFinal() { return saldoFinal; }
    public void setSaldoFinal(Double saldoFinal) { this.saldoFinal = saldoFinal; }
    
    public Integer getTotalProductos() { return totalProductos; }
    public void setTotalProductos(Integer totalProductos) { this.totalProductos = totalProductos; }
    
    public Integer getProductosCriticos() { return productosCriticos; }
    public void setProductosCriticos(Integer productosCriticos) { this.productosCriticos = productosCriticos; }
    
    public Integer getTotalCuentas() { return totalCuentas; }
    public void setTotalCuentas(Integer totalCuentas) { this.totalCuentas = totalCuentas; }
    
    public Double getSaldoTotalCuentas() { return saldoTotalCuentas; }
    public void setSaldoTotalCuentas(Double saldoTotalCuentas) { this.saldoTotalCuentas = saldoTotalCuentas; }
    
    public Integer getTotalGuias() { return totalGuias; }
    public void setTotalGuias(Integer totalGuias) { this.totalGuias = totalGuias; }
}