package com.vitivinicolas.backend.repository;

import com.vitivinicolas.backend.model.CuentaBancaria;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CuentaBancariaRepository extends JpaRepository<CuentaBancaria, Long> {
    List<CuentaBancaria> findByNombreBancoContainingIgnoreCase(String nombreBanco);
    List<CuentaBancaria> findByTitularContainingIgnoreCase(String titular);
}