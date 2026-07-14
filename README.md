# Tech Challenge - Blog API

![Node.js](https://img.shields.io/badge/Node.js-24.x-339933?logo=node.js&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-11-E0234E?logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-4169E1?logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-blue)

API REST desenvolvida durante o **Tech Challenge da Pós-Tech FIAP**.

A aplicação implementa uma plataforma de blogging voltada ao ambiente
educacional, permitindo o gerenciamento de usuários, disciplinas e
postagens. O projeto foi desenvolvido com foco em boas práticas de
arquitetura, autenticação, documentação, testes automatizados e
conteinerização.

---

## Objetivo

Disponibilizar uma API REST para gerenciamento de um blog educacional,
oferecendo:

- Autenticação via JWT;
- CRUD de usuários;
- CRUD de disciplinas;
- CRUD de postagens;
- Associação automática do autor ao post através do usuário
  autenticado;
- Pesquisa por palavras-chave;
- Paginação;
- Documentação via Swagger;
- Testes automatizados.

---

## Tecnologias

### Backend

- Node.js
- NestJS
- TypeScript

### Banco de Dados

- PostgreSQL
- TypeORM

### Qualidade

- Jest
- ESLint
- Prettier

### Infraestrutura

- Docker
- Docker Compose
- GitHub Actions

---

## Arquitetura

A aplicação segue arquitetura em camadas.

```text
HTTP Request
     │
Validation Pipe
     |     
Controllers
     │
Services
     │
Repositories
     │
PostgreSQL
```

Estrutura principal:

```text
src
├── auth
├── user
├── post
├── discipline
├── common
├── config
└── database
```

---

# Estrutura da API

A aplicação está organizada em módulos independentes, cada um com uma responsabilidade específica.

| Módulo | Responsabilidade |
|--------|------------------|
| **Auth** | Autenticação de usuários e geração de tokens JWT. |
| **User** | Cadastro, consulta, atualização e exclusão de usuários. |
| **Post** | Gerenciamento de postagens, busca por palavras-chave, paginação e associação automática do autor autenticado. |
| **Discipline** | Gerenciamento das disciplinas utilizadas pelas postagens. |
| **Common** | Componentes compartilhados, como DTOs e serviços reutilizáveis. |
| **Config** | Configurações da aplicação, banco de dados e autenticação. |
| **Database** | Migrations, seeds e configuração do TypeORM. |

---

## Funcionalidades

### Autenticação
- [x] Login com JWT
- [x] Rotas protegidas

### Usuários
- [x] CRUD de usuários

### Postagens
- [x] CRUD de postagens
- [x] Exclusão lógica (Soft Delete)
- [x] Busca por palavra-chave
- [x] Paginação
- [x] Apenas o autor pode editar ou excluir sua postagem
- [x] Autor obtido automaticamente a partir do token JWT
- [x] Associação obrigatória a uma disciplina

### Disciplinas
- [x] Listagem de disciplinas

---

# Regras de Negócio

A API implementa as seguintes regras de negócio:

- Apenas usuários autenticados podem criar postagens.
- O autor da postagem é definido automaticamente com base no usuário autenticado via JWT.
- Apenas o autor da postagem pode editá-la ou excluí-la.
- Toda postagem deve estar associada a uma disciplina válida.
- Usuários e postagens utilizam exclusão lógica (Soft Delete), preservando o histórico de dados.
- Não é permitido cadastrar usuários com e-mails duplicados.
- Não é permitido cadastrar ou atualizar postagens com títulos duplicados.

---

## Modelo do Banco

```text
User (1) ──────────────── (N) Post (N) ──────────────── (1) Discipline
```

Cada postagem pertence a um usuário e a uma disciplina.

O autor é definido automaticamente pelo usuário autenticado via JWT.

---

## Instalação

Clone o projeto:

```bash
git clone https://github.com/Victoria-Panzenhagen/post-api.git
cd post-api
```

Instale as dependências:

```bash
npm install
```

---

## Variáveis de Ambiente

Copie o arquivo de exemplo:

```bash
cp .env.example .env
```

Ajuste os valores conforme seu ambiente.

## Configuração do `.env`

### Executando localmente

```env
DB_HOST=localhost
```

### Executando com Docker Compose

```env
DB_HOST=postgres
```

O valor de `DB_HOST` depende do ambiente de execução:

- `localhost`: quando a API é executada diretamente na máquina host.
- `postgres`: quando a API é executada em um container Docker, utilizando a rede do Docker Compose.

---

# Executando com Docker

A aplicação pode ser executada utilizando Docker Compose, que inicializa automaticamente os containers da API e do PostgreSQL.

Subir os containers:

```bash
docker compose up --build
```

Executar em segundo plano:

```bash
docker compose up -d
```

Parar os containers:

```bash
docker compose down
```

Remover containers, redes e volumes:

```bash
docker compose down -v
```

Após a inicialização:

| Serviço | URL |
|---------|-----|
| API | http://localhost:3000 |
| Swagger | http://localhost:3000/docs |
| PostgreSQL | localhost:5432 |
| pgAdmin | http://localhost:5050 |

### Acesso ao pgAdmin

Utilize as credenciais definidas no arquivo `.env`:

```env
PGADMIN_EMAIL=...
PGADMIN_PASSWORD=...
```

> **Observações:**
>
> - Na primeira execução, aguarde a inicialização do banco de dados antes de utilizar a API.
> - Ao executar a aplicação com Docker Compose, configure `DB_HOST=postgres`, pois os containers se comunicam pelo nome do serviço definido no `docker-compose.yml`.

---

## Executando Localmente

```bash
npm run start:dev
```

---

## Banco de Dados

Executar migrations:

```bash
npm run migration:run
```

Executar seeds:

```bash
npm run seed
```

As migrations criam a estrutura do banco e as seeds inserem os dados
iniciais da aplicação, como as disciplinas.

------------------------------------------------------------------------

# Primeiros Passos

Após iniciar a aplicação, siga o fluxo abaixo para utilizar os endpoints protegidos.

## 1. Criar um usuário

Utilize o endpoint:

```http
POST /users
```

Exemplo de requisição:

```json
{
  "name": "Maria Silva",
  "email": "maria.silva@email.com",
  "password": "senha123"
}
```

## 2. Realizar o login

Utilize o endpoint:

```http
POST /auth/login
```

Exemplo de requisição:

```json
{
  "email": "maria.silva@email.com",
  "password": "senha123"
}
```

A resposta retornará um token JWT:

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

## 3. Autorizar as requisições

No Swagger, clique em **Authorize** e informe o token no seguinte formato:

```text
Bearer <seu_token>
```

Após a autenticação, todos os endpoints protegidos poderão ser utilizados.

> **Observação:** ao criar uma postagem, o autor é associado automaticamente ao usuário autenticado. Não é necessário informar o autor na requisição.

---

## Documentação

Após iniciar a aplicação:

``` text
http://localhost:3000/docs
````

A documentação Swagger contém:

- Endpoints
- DTOs
- Exemplos de requisição
- Exemplos de resposta
- Códigos HTTP

---

## Autenticação

Fluxo de autenticação:

```text
Cadastro de usuário
          │
          ▼
     POST /users
          │
          ▼
     POST /auth/login
          │
          ▼
     Access Token (JWT)
          │
          ▼
Authorization: Bearer <token>
          │
          ▼
Usuário autenticado
          │
          ▼
Autor definido automaticamente
```

---

## Endpoints

### Auth

Método Endpoint

---

POST /auth/login

### Usuários

Método Endpoint

---

POST /users
GET /users
GET /users/:id
PUT /users/:id
DELETE /users/:id

### Disciplinas

Método Endpoint

---

POST /disciplines
GET /disciplines
GET /disciplines/:id
PUT /disciplines/:id
DELETE /disciplines/:id

### Posts

Método Endpoint

---

POST /posts
GET /posts
GET /posts/:id
PUT /posts/:id
DELETE /posts/:id

---

## Testes

```bash
npm test
npm run test:cov
```

Cobertura atual aproximada:

- Statements: 66%
- Branches: 68%
- Lines: 67%

---

## CI/CD

A pipeline do GitHub Actions executa automaticamente:

```text
Install
   ↓
Lint
   ↓
Tests
   ↓
Build
```

Nenhuma alteração é integrada caso alguma dessas etapas falhe.

---

## Boas Práticas

- Arquitetura em camadas
- DTOs e validação
- JWT
- Soft Delete
- Repository Pattern
- Dependency Injection
- Swagger
- Docker
- GitHub Actions
- ESLint
- Prettier
- Testes Unitários

---

# Experiência e Desafios

Durante o desenvolvimento deste projeto, alguns desafios contribuíram significativamente para o aprendizado e evolução técnica.

### Testes Unitários

A implementação dos testes exigiu a adaptação da suíte de testes à evolução da aplicação, principalmente após a inclusão da autenticação JWT e das regras de autorização.

Entre os principais desafios estiveram:

- Atualização dos mocks dos repositórios e serviços;
- Simulação do usuário autenticado através do `JwtPayload`;
- Testes de regras de autorização, garantindo que apenas o autor da postagem possa atualizá-la ou removê-la;
- Adequação dos testes ao uso do `QueryBuilder` do TypeORM;
- Manutenção da cobertura de testes acima do mínimo exigido.

### Integração Contínua (GitHub Actions)

Outro desafio foi configurar a pipeline de integração contínua para validar automaticamente a qualidade do projeto.

A pipeline foi configurada para executar:

- Instalação das dependências;
- Verificação de formatação com Prettier;
- Análise estática com ESLint;
- Execução dos testes unitários;
- Build da aplicação.

Durante essa etapa foram corrigidos diversos problemas relacionados à tipagem do TypeScript, regras do ESLint e configuração dos testes, garantindo que todas as validações fossem executadas com sucesso em cada push realizado ao repositório.

Esses desafios contribuíram para uma melhor compreensão das boas práticas de desenvolvimento, qualidade de código, automação e manutenção de aplicações backend utilizando NestJS.

---

## Melhorias Futuras

- Refresh Token
- RBAC
- Upload de imagens
- Cache com Redis
- Rate Limiting
- Observabilidade
- Logs estruturados

---

## Desenvolvido por

**Victoria Panzenhagen**

Backend Developer

- GitHub: https://github.com/Victoria-Panzenhagen
- LinkedIn: https://linkedin.com/in/victoria-panzenhagen-a5ab69196

---

## Licença

Este projeto está licenciado sob a licença MIT.
