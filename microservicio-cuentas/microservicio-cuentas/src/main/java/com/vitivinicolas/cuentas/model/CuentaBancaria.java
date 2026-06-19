package com.vitivinicolas.cuentas.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "cuenta_bancaria")
public class CuentaBancaria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nombre_banco", nullable = false)
    private String nombreBanco;

    @Column(name = "numero_cuenta", nullable = false, unique = true)
    private String numeroCuenta;

    @Column(name = "tipo_cuenta", nullable = false)
    private String tipoCuenta;

    @Column(nullable = false)
    private BigDecimal saldo;

    @Column(nullable = false)
    private String moneda;

    @Column(name = "fecha_apertura", nullable = false)
    private LocalDate fechaApertura;

    @Column(nullable = false)
    private String titular;

    // CONSTRUCTOR VACÍO
    public CuentaBancaria() {}

    // CONSTRUCTOR CON PARÁMETROS
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

    // GETTERS Y SETTERS
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