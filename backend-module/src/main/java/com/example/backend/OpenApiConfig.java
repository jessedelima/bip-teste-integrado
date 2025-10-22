package com.example.backend;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;

@OpenAPIDefinition(
        info = @Info(
                title = "API de Benefícios",
                version = "v1",
                description = "CRUD de Benefício e operação de transferência"
        )
)
public class OpenApiConfig {
}