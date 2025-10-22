package com.example.backend;

import jakarta.persistence.EntityManager;
import jakarta.persistence.LockModeType;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class BeneficioService {

    private final BeneficioRepository repository;

    @PersistenceContext
    private EntityManager em;

    public BeneficioService(BeneficioRepository repository) {
        this.repository = repository;
    }

    public List<Beneficio> list() {
        return repository.findAll();
    }

    public Optional<Beneficio> get(Long id) {
        return repository.findById(id);
    }

    public Beneficio create(Beneficio b) {
        return repository.save(b);
    }

    public Beneficio update(Long id, Beneficio update) {
        Beneficio b = repository.findById(id).orElseThrow(() -> new IllegalArgumentException("Benefício não encontrado"));
        b.setNome(update.getNome());
        b.setDescricao(update.getDescricao());
        b.setValor(update.getValor());
        b.setAtivo(update.getAtivo());
        return repository.save(b);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    @Transactional
    public void transfer(Long fromId, Long toId, BigDecimal amount) {
        if (fromId == null || toId == null || amount == null) {
            throw new IllegalArgumentException("Parâmetros inválidos");
        }
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Valor de transferência deve ser positivo");
        }
        if (fromId.equals(toId)) {
            throw new IllegalArgumentException("IDs de origem e destino devem ser diferentes");
        }

        Long firstId = fromId < toId ? fromId : toId;
        Long secondId = fromId < toId ? toId : fromId;

        Beneficio first = em.find(Beneficio.class, firstId, LockModeType.PESSIMISTIC_WRITE);
        Beneficio second = em.find(Beneficio.class, secondId, LockModeType.PESSIMISTIC_WRITE);

        Beneficio from = fromId.equals(firstId) ? first : second;
        Beneficio to   = toId.equals(secondId) ? second : first;

        if (from == null || to == null) {
            throw new IllegalArgumentException("Benefício não encontrado");
        }
        if (Boolean.FALSE.equals(from.getAtivo()) || Boolean.FALSE.equals(to.getAtivo())) {
            throw new IllegalStateException("Benefício inativo");
        }
        if (from.getValor().compareTo(amount) < 0) {
            throw new IllegalStateException("Saldo insuficiente");
        }

        from.setValor(from.getValor().subtract(amount));
        to.setValor(to.getValor().add(amount));

        repository.save(from);
        repository.save(to);
    }
}