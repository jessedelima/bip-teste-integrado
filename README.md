# Desafio Fullstack Integrado – Passo a Passo e Progresso

Este README acompanha a execução do desafio em camadas (DB, EJB, Backend, Frontend), com correções e entregáveis documentados.

## Checklist de Etapas
- [x] Planejar execução e criar README raiz
- [x] Executar scripts DB (`db/schema.sql` e `db/seed.sql`) via auto-init do backend (H2)
- [x] Corrigir bug no EJB (validação, rollback, locking pessimista)
- [x] Implementar Backend CRUD + transferência
- [x] Documentar com Swagger (UI em `/swagger-ui.html`)
- [x] Desenvolver Frontend Angular consumindo Backend
- [x] Implementar testes (unitários de serviço)
- [x] Submeter via fork + PR

## Estrutura do Projeto
- `db/`: scripts de schema e seed
- `ejb-module/`: serviço EJB com bug corrigido
- `backend-module/`: backend Spring Boot (CRUD e transferência)
- `frontend/`: app Angular (lista, detalhe, criar/editar, excluir e transferência; toast de mensagens; interceptor global de erros)
- `docs/`: instruções do desafio
- `.github/workflows/`: CI

## Como rodar localmente
### Backend
1. Pré-requisitos: Java 17, Maven.
2. Configuração de banco: H2 em memória com auto-init dos scripts:
   - `backend-module/src/main/resources/schema.sql`
   - `backend-module/src/main/resources/data.sql`
   - Codificação: `spring.sql.init.encoding=UTF-8` definida em `application.properties` para acentuação correta.
3. Executar o backend no diretório `backend-module/`:
   - `mvn spring-boot:run`
4. Swagger UI: `http://localhost:8080/swagger-ui.html`

### Frontend
1. Pré-requisitos: Node 18+ / npm.
2. No diretório `frontend/`:
   - Instalar deps: `npm install`
   - Rodar: `npm start` (porta `http://localhost:4200`)
3. CORS já habilitado no backend para `http://localhost:4200`.

## EJB – Correção aplicada
- Validações: parâmetros, valor positivo, benefícios ativos, saldo suficiente.
- Locking: `PESSIMISTIC_WRITE` em ambos os registros, ordenando IDs para evitar deadlock.
- Rollback: exceções checked/unchecked causam rollback pela transação EJB.
- Arquivo alterado: `ejb-module/src/main/java/com/example/ejb/BeneficioEjbService.java`.
- Entidade criada: `ejb-module/src/main/java/com/example/ejb/Beneficio.java` com `@Version`.

## Backend – CRUD + Transferência
- Entidade: `backend-module/src/main/java/com/example/backend/Beneficio.java`
- Repositório: `backend-module/src/main/java/com/example/backend/BeneficioRepository.java`
- Serviço: `backend-module/src/main/java/com/example/backend/BeneficioService.java` (transferência segura)
- Controller: `backend-module/src/main/java/com/example/backend/BeneficioController.java`
  - Endpoints:
    - `GET /api/v1/beneficios`
    - `GET /api/v1/beneficios/{id}`
    - `POST /api/v1/beneficios`
    - `PUT /api/v1/beneficios/{id}`
    - `DELETE /api/v1/beneficios/{id}`
    - `POST /api/v1/beneficios/transfer` (body: `{ fromId, toId, amount }`)
- CORS: habilitado para `http://localhost:4200` no controller.

## Testes
- `backend-module/src/test/java/com/example/backend/BeneficioServiceTest.java`
  - Lista dados iniciais.
  - Transfere com sucesso.
  - Valida erro de saldo insuficiente.

## Frontend (Angular)
- Implementado: listar benefícios, detalhe, criar/editar, excluir e realizar transferência.
- Tratamento global de erros via `HttpInterceptor` com mensagens amigáveis (ToastService).
- Notificações centralizadas (sucesso/erro/info) com componente `ToastComponent` embutido no `AppComponent`.
- Integração via HTTP com o backend (`/api/v1/beneficios`).

## Próximos passos
1. Criar o projeto Angular na pasta `frontend/` e consumir o backend.
2. Ajustar CI para build/test.
3. Submeter via fork + PR.