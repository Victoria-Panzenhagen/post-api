# Tech Challenge - Blog API

![Node.js](https://img.shields.io/badge/Node.js-24.x-339933?logo=node.js&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-11-E0234E?logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-4169E1?logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-blue)

API REST desenvolvida durante o **Tech Challenge da Pós-Tech FIAP**.

O projeto consiste em uma plataforma de blogging voltada ao ambiente educacional, permitindo que professores publiquem conteúdos e que alunos consultem as postagens.

A aplicação foi desenvolvida utilizando **NestJS**, seguindo boas práticas de arquitetura, documentação, testes automatizados e conteinerização.

---

# Sumário

- [Objetivo](#objetivo)
- [Tecnologias](#tecnologias)
- [Arquitetura](#arquitetura)
- [Funcionalidades](#funcionalidades)
- [Modelo do Banco](#modelo-do-banco)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Instalação](#instalação)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Executando com Docker](#executando-com-docker)
- [Executando Localmente](#executando-localmente)
- [Documentação da API](#documentação-da-api)
- [Autenticação](#autenticação)
- [Endpoints](#endpoints)
- [Testes](#testes)
- [CI/CD](#cicd)
- [Boas Práticas](#boas-práticas)
- [Melhorias Futuras](#melhorias-futuras)

---

# Objetivo

Construir uma API REST capaz de gerenciar postagens de um blog educacional.

A API oferece recursos para:

- autenticação de usuários;
- criação de postagens;
- edição;
- exclusão lógica;
- pesquisa por palavras-chave;
- documentação via Swagger.

---

# Tecnologias

## Backend

- Node.js
- NestJS
- TypeScript

## Banco de dados

- PostgreSQL
- TypeORM

## Documentação

- Swagger

## Qualidade

- Jest
- ESLint
- Prettier

## Infraestrutura

- Docker
- Docker Compose
- GitHub Actions

---

# Arquitetura

A aplicação segue uma arquitetura em camadas.

```text
                HTTP Request
                      │
              PostsController
                      │
                PostsService
                      │
             PostsRepository
                      │
                 PostgreSQL
```

Cada módulo possui responsabilidade única.

```text
src
├── auth
├── users
├── posts
├── common
├── config
└── database
```

---

# Funcionalidades

## Usuários

- Cadastro
- Login
- Autenticação JWT

## Posts

- Criar postagem
- Atualizar postagem
- Excluir postagem (Soft Delete)
- Buscar postagem por ID
- Listar postagens
- Buscar por palavra-chave

---

# Modelo do Banco

```text
User
----
id
name
email
password
createdAt
updatedAt

          1
          │
          │
          │
          N

Post
----
id
title
content
createdAt
updatedAt
deletedAt
authorId
```

Cada postagem pertence a um único usuário.

O autor é obtido automaticamente através do usuário autenticado via JWT.

---

# Estrutura do Projeto

```text
src
│
├── auth
│
├── users
│
├── posts
│   ├── dto
│   ├── entities
│   ├── repositories
│   ├── services
│   ├── controllers
│   └── tests
│
├── common
│
├── config
│
├── database
│
└── main.ts
```

---

# Instalação

Clone o projeto

```bash
git clone https://github.com/Victoria-Panzenhagen/post-api.git
```

Entre na pasta

```bash
cd blog-api
```

Instale as dependências

```bash
npm install
```

---

# Variáveis de Ambiente

Crie um arquivo:

```text
.env
```

Exemplo:

```env
APP_PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=blog
DB_SCHEMA=blog
DB_USERNAME=postgres
DB_PASSWORD=postgres

JWT_SECRET=your-secret
JWT_EXPIRES_IN=1d
```

---

# Executando com Docker

Subir containers

```bash
docker compose up --build
```

Parar containers

```bash
docker compose down
```

---

# Executando Localmente

Modo desenvolvimento

```bash
npm run start:dev
```

Build

```bash
npm run build
```

Produção

```bash
npm run start:prod
```

---

# Banco de Dados

Executar migrations

```bash
npm run migration:run
```

Executar seeds

```bash
npm run seed
```

---

# Documentação da API

Após iniciar a aplicação:

```
http://localhost:3000/docs
```

A documentação é gerada automaticamente utilizando Swagger.

Ela contém:

- endpoints;
- DTOs;
- exemplos de requisição;
- exemplos de resposta;
- códigos HTTP.

---

# Autenticação

A API utiliza JWT.

Fluxo:

```text
Login
     │
     ▼
JWT
     │
     ▼
Authorization: Bearer <token>
     │
     ▼
Usuário autenticado
     │
     ▼
Autor da postagem
```

O cliente **não informa o autor da postagem**.

O usuário autenticado é automaticamente associado ao post criado.

---

# Endpoints

## Posts

| Método | Endpoint      | Descrição                |
| ------ | ------------- | ------------------------ |
| GET    | /posts        | Lista todos os posts     |
| GET    | /posts/:id    | Busca um post            |
| POST   | /posts        | Cria um post             |
| PUT    | /posts/:id    | Atualiza um post         |
| DELETE | /posts/:id    | Remove um post           |
| GET    | /posts/search | Busca por palavras-chave |

---

# Testes

Executar testes

```bash
npm run test
```

Cobertura

```bash
npm run test:cov
```

O projeto possui testes unitários para os principais casos de uso da aplicação.

---

# CI/CD

O projeto utiliza GitHub Actions para automatizar:

- instalação das dependências;
- execução do lint;
- execução dos testes;
- build da aplicação.

Fluxo:

```text
Push

 ↓

Install

 ↓

Lint

 ↓

Tests

 ↓

Build
```

---

# Boas Práticas

- Arquitetura em camadas
- DTOs
- Validação com class-validator
- Soft Delete
- Injeção de Dependência
- Repository Pattern
- Swagger
- Docker
- ESLint
- Prettier
- Variáveis de ambiente
- JWT
- Testes Unitários

---

# Melhorias Futuras

- Refresh Token
- Controle de permissões (RBAC)
- Upload de imagens
- Paginação
- Filtros avançados
- Cache com Redis
- Observabilidade
- Rate Limiting

---

# Desenvolvido por

Victoria Panzenhagen

Backend Developer

GitHub:
https://github.com/Victoria-Panzenhagen

LinkedIn:
https://linkedin.com/in/victoria-panzenhagen-a5ab69196

---

# Licença

Este projeto está licenciado sob a licença MIT.
