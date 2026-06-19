package com.vitivinicolas.backend.dto;

public class ProductoDTO {
    private Long id;
    private String codigo;
    private String nombre;
    private String categoria;
    private int stock;
    private String ubicacion;

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCodigo() { return codigo; }
    public void setCodigo(String codigo) { this.codigo = codigo; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }
    public int getStock() { return stock; }
    public void setStock(int stock) { this.stock = stock; }
    public String getUbicacion() { return ubicacion; }
    public void setUbicacion(String ubicacion) { this.ubicacion = ubicacion; }
}