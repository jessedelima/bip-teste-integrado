package com.example.backend;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class BeneficioServiceTest {

    @Autowired
    private BeneficioService service;

    @Autowired
    private BeneficioRepository repository;

    @Test
    void shouldListSeedData() {
        List<Beneficio> all = service.list();
        assertTrue(all.size() >= 2);
    }

    @Test
    @Transactional
    void shouldTransferAmountSuccessfully() {
        Beneficio a = repository.save(new Beneficio());
        a.setNome("A"); a.setValor(new BigDecimal("1000.00")); a.setAtivo(true);
        repository.save(a);

        Beneficio b = repository.save(new Beneficio());
        b.setNome("B"); b.setValor(new BigDecimal("500.00")); b.setAtivo(true);
        repository.save(b);

        service.transfer(a.getId(), b.getId(), new BigDecimal("200.00"));

        Beneficio updatedA = repository.findById(a.getId()).orElseThrow();
        Beneficio updatedB = repository.findById(b.getId()).orElseThrow();

        assertEquals(new BigDecimal("800.00"), updatedA.getValor());
        assertEquals(new BigDecimal("700.00"), updatedB.getValor());
    }

    @Test
    @Transactional
    void shouldFailWhenInsufficientFunds() {
        Beneficio a = repository.save(new Beneficio());
        a.setNome("A"); a.setValor(new BigDecimal("100.00")); a.setAtivo(true);
        repository.save(a);

        Beneficio b = repository.save(new Beneficio());
        b.setNome("B"); b.setValor(new BigDecimal("500.00")); b.setAtivo(true);
        repository.save(b);

        IllegalStateException ex = assertThrows(IllegalStateException.class,
                () -> service.transfer(a.getId(), b.getId(), new BigDecimal("200.00")));
        assertTrue(ex.getMessage().toLowerCase().contains("saldo"));
    }
}