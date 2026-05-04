package com.vitivinicolas.backend.model;

import jakarta.persistence.*;

@Entity
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String codigo;
    private String nombre;
    private String categoria;
    private String ubicacion;
    private int stock;

    // 1. Constructor vacío (Obligatorio para Hibernate/JPA)
    public Producto() {}

    // 2. Constructor con parámetros (El que te faltaba para DataInitializer)
    public Producto(String codigo, String nombre, String categoria, String ubicacion, int stock) {
        this.codigo = codigo;
        this.nombre = nombre;
        this.categoria = categoria;
        this.ubicacion = ubicacion;
        this.stock = stock;
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCodigo() { return codigo; }
    public void setCodigo(String codigo) { this.codigo = codigo; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getCategoria() { return categoria; }
    public String getCategoria(String categoria) { return categoria; }
    public String getUbicacion() { return ubicacion; }
    public void setUbicacion(String ubicacion) { this.ubicacion = ubicacion; }
    public int getStock() { return stock; }
    public void setStock(int stock) { this.stock = stock; }
}