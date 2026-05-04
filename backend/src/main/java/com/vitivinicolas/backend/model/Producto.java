package com.vitivinicolas.backend.model;

import jakarta.persistence.*;

@Entity
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private String marca;
    private String ubicacion;
    private int stock;

    // getters y setters
}