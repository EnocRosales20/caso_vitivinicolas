package com.vitivinicolas.cuentas.repository;

import com.vitivinicolas.cuentas.model.CuentaBancaria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CuentaBancariaRepository extends JpaRepository<CuentaBancaria, Long> {

    List<CuentaBancaria> findByNombreBancoContainingIgnoreCase(String nombreBanco);

    List<CuentaBancaria> findByTitularContainingIgnoreCase(String titular);
}