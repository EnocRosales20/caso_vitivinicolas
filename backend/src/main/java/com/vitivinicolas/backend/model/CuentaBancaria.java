package com.vitivinicolas.backend.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
public class CuentaBancaria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String nombreBanco;
    private String numeroCuenta;
    private String tipoCuenta;
    private BigDecimal saldo;
    private String moneda;
    private LocalDate fechaApertura;
    private String titular;

    public CuentaBancaria() {}

    public CuentaBancaria(String nombreBanco, String numeroCuenta, String tipoCuenta, 
                          BigDecimal saldo, String moneda, LocalDate fechaApertura, String titular) {
        this.nombreBanco = nombreBanco;
        this.numeroCuenta = numeroCuenta;
        this.tipoCuenta = tipoCuenta;
        this.saldo = saldo;
        this.moneda = moneda;
        this.fechaApertura = fechaApertura;
        this.titular = titular;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getNombreBanco() { return nombreBanco; }
    public void setNombreBanco(String nombreBanco) { this.nombreBanco = nombreBanco; }
    
    public String getNumeroCuenta() { return numeroCuenta; }
    public void setNumeroCuenta(String numeroCuenta) { this.numeroCuenta = numeroCuenta; }
    
    public String getTipoCuenta() { return tipoCuenta; }
    public void setTipoCuenta(String tipoCuenta) { this.tipoCuenta = tipoCuenta; }
    
    public BigDecimal getSaldo() { return saldo; }
    public void setSaldo(BigDecimal saldo) { this.saldo = saldo; }
    
    public String getMoneda() { return moneda; }
    public void setMoneda(String moneda) { this.moneda = moneda; }
    
    public LocalDate getFechaApertura() { return fechaApertura; }
    public void setFechaApertura(LocalDate fechaApertura) { this.fechaApertura = fechaApertura; }
    
    public String getTitular() { return titular; }
    public void setTitular(String titular) { this.titular = titular; }
}