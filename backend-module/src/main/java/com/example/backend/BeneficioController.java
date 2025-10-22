package com.example.backend;

import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/v1/beneficios")
public class BeneficioController {

    private final BeneficioService service;

    public BeneficioController(BeneficioService service) {
        this.service = service;
    }

    @GetMapping
    public List<Beneficio> list() {
        return service.list();
    }

    @GetMapping("/{id}")
    public Beneficio get(@PathVariable Long id) {
        return service.get(id).orElseThrow(() -> new IllegalArgumentException("Benefício não encontrado"));
    }

    @PostMapping
    public Beneficio create(@RequestBody Beneficio b) {
        return service.create(b);
    }

    @PutMapping("/{id}")
    public Beneficio update(@PathVariable Long id, @RequestBody Beneficio b) {
        return service.update(id, b);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    public static class TransferRequest {
        public Long fromId;
        public Long toId;
        public java.math.BigDecimal amount;
    }

    @PostMapping("/transfer")
    public void transfer(@RequestBody TransferRequest req) {
        service.transfer(req.fromId, req.toId, req.amount);
    }
}
