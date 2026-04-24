# Habit Tracker API

API RESTful para registro de hábitos e acompanhamento de execuções diárias. Permite criar usuários, definir hábitos com frequência diária ou semanal, e registrar logs de execução por data.

## Pré-requisitos

- [Node.js](https://nodejs.org/) v18+
- [PostgreSQL](https://www.postgresql.org/) 14+
- npm

## Instalação e execução

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env
# Edite o .env com sua DATABASE_URL e JWT_SECRET

# 3. Criar as tabelas no banco de dados
npx prisma migrate dev --name init

# 4. Popular o banco com dados de exemplo
npm run seed

# 5. Iniciar o servidor em modo desenvolvimento
npm run dev
```

A API estará disponível em `http://localhost:3000`.  
A documentação Swagger estará em `http://localhost:3000/api-docs`.

## Variáveis de ambiente

| Variável         | Descrição                                      | Exemplo                                          |
|------------------|------------------------------------------------|--------------------------------------------------|
| `DATABASE_URL`   | String de conexão com o PostgreSQL             | `postgresql://user:pass@localhost:5432/habittracker` |
| `JWT_SECRET`     | Chave secreta para assinar tokens JWT          | `uma_string_longa_e_aleatoria`                   |
| `JWT_EXPIRES_IN` | Tempo de expiração do token JWT                | `7d`                                             |
| `PORT`           | Porta em que o servidor irá escutar            | `3000`                                           |

## Tabela de rotas

### Auth (público)

| Método | Rota             | Descrição                            | Auth |
|--------|------------------|--------------------------------------|------|
| POST   | `/auth/register` | Registra um novo usuário             | Não  |
| POST   | `/auth/login`    | Autentica e retorna um JWT           | Não  |

### Habits (requer JWT)

| Método | Rota           | Descrição                                        | Auth |
|--------|----------------|--------------------------------------------------|------|
| GET    | `/habits`      | Lista todos os hábitos do usuário autenticado    | Sim  |
| POST   | `/habits`      | Cria um novo hábito                              | Sim  |
| GET    | `/habits/:id`  | Retorna um hábito por ID                         | Sim  |
| PUT    | `/habits/:id`  | Atualiza título, descrição ou frequência         | Sim  |
| DELETE | `/habits/:id`  | Remove o hábito e todos os seus logs em cascata  | Sim  |

### HabitLogs (requer JWT)

| Método | Rota                          | Descrição                          | Auth |
|--------|-------------------------------|------------------------------------|------|
| GET    | `/habits/:id/logs`            | Lista todos os logs do hábito      | Sim  |
| POST   | `/habits/:id/logs`            | Registra execução do hábito        | Sim  |
| DELETE | `/habits/:id/logs/:logId`     | Remove um log específico           | Sim  |

## Seed de dados

O comando `npm run seed` cria:
- 2 usuários: `alice@exemplo.com` e `bob@exemplo.com` (senha: `senha123`)
- 3 hábitos por usuário
- 7 logs de execução por hábito (últimos 7 dias)

## Códigos de resposta

| Código | Significado                              |
|--------|------------------------------------------|
| 200    | Sucesso                                  |
| 201    | Recurso criado                           |
| 204    | Removido com sucesso (sem body)          |
| 400    | Dados inválidos ou ausentes              |
| 401    | Token ausente ou inválido                |
| 403    | Recurso não pertence ao usuário          |
| 404    | Recurso não encontrado                   |
| 409    | Conflito (ex: log duplicado na mesma data) |
| 500    | Erro interno do servidor                 |

---

## Testes e Validação

### Ferramenta utilizada

**Thunder Client** — extensão leve de cliente REST integrada ao Visual Studio Code. Permite criar e executar requisições HTTP diretamente no editor, organizar endpoints em coleções, definir variáveis de ambiente (ex.: `baseUrl`, `token`) e visualizar respostas formatadas em JSON. Alternativa direta ao Postman sem necessidade de instalar aplicação separada.

---

### Evidências de Teste

#### POST /auth/register — Registrar usuário

Register faltando informações
![Register faltando informações](docs/prints/register_faltando_info.png)

Register com sucesso
![Register com sucesso](docs/prints/register_success.png)

---

#### POST /auth/login — Login e obtenção do JWT

Login com dados inválidos
![Login com dados inválidos](docs/prints/login_invalido.png)

Login com sucesso retornando token
![Login com sucesso](docs/prints/login_success.png)

---

#### GET /habits — Listar hábitos

Read do hábito sem token de autenticação
![Listar hábitos sem token](docs/prints/habits_sem_token.png)

Read dos hábitos com token correto
![Listar hábitos com token](docs/prints/read_habits.png)

---

#### POST /habits — Criar hábito

Criando hábito
![Criar hábito](docs/prints/create_habit.png)

---

#### GET /habits/:id — Buscar hábito por ID

Read do hábito pelo ID
![Buscar hábito por ID](docs/prints/read_pelo_id.png)

---

#### PUT /habits/:id — Atualizar hábito

Update do hábito pelo id mudando parcialmente as informações
![Atualizar hábito](docs/prints/update_habit.png)

---

#### DELETE /habits/:id — Remover hábito

Delete do hábito
![Remover hábito](docs/prints/delete_habit.png)

---

## Pesquisa e Contextualização da Pilha Tecnológica

Esta seção discute as escolhas tecnológicas do projeto, situando-as no ecossistema atual de desenvolvimento de APIs e relacionando-as com alternativas estudadas na disciplina.

### Runtime: Node.js

Node.js é o runtime JavaScript server-side mais adotado no mercado, com modelo de I/O assíncrono e não-bloqueante baseado em event loop — arquitetura bem adequada para servidores HTTP que lidam com muitas conexões simultâneas de baixa intensidade de CPU, como é o caso de APIs REST.

**Node.js** ecossistema maduro, ampla disponibilidade de pacotes (npm), familiaridade e ótima integração com as ferramentas escolhidas (Prisma, Express, JWT).

---

### Framework HTTP: Express.js

Express.js é o framework web mais utilizado no ecossistema Node.js. Sua filosofia minimalista — sem opinião sobre estrutura de pastas, ORM ou autenticação — exige que o desenvolvedor tome decisões de arquitetura explicitamente, o que é pedagogicamente valioso. O padrão de middleware em cadeia (`req → middleware → middleware → handler → res`) é diretamente mapeável ao modelo de processamento de requisições HTTP.

**Express:** maturidade, documentação abundante, baixa curva de entrada e transparência no fluxo de middleware — facilita compreender o que acontece a cada requisição.

---

### ORM: Prisma

Prisma é um ORM de nova geração para Node.js/TypeScript. Em vez de mapear objetos para tabelas de forma imperativa, o desenvolvedor declara o schema em um arquivo `.prisma` e o Prisma gera um cliente fortemente tipado. Isso elimina uma classe inteira de erros de digitação em queries e torna as migrações rastreáveis como código.

**Prisma** schema declarativo versionado com migrações automáticas, client gerado com tipos precisos e excelente DX (Developer Experience) para projetos em JavaScript puro.

---

### Banco de Dados: PostgreSQL

PostgreSQL é um banco de dados relacional objeto-relacional de código aberto, reconhecido por sua conformidade com o padrão SQL, robustez transacional (ACID) e suporte a tipos avançados (JSON nativo, arrays, tipos geométricos). É a escolha padrão para novos projetos que precisam de consistência e integridade referencial.

**PostgreSQL:** o domínio tem relacionamentos claros (Usuário → Hábito → Log) e restrições de integridade importantes (ex.: constraint `UNIQUE(habitId, date)`), o que favorece um banco relacional.

---

### Autenticação: JWT (JSON Web Token)

JWT é um padrão aberto (RFC 7519) para transmitir informações entre partes como um objeto JSON assinado digitalmente. No contexto de APIs REST, ele é usado para autenticação stateless: o servidor não armazena estado de sessão — a identidade do usuário está codificada no próprio token enviado pelo cliente a cada requisição.

O fluxo implementado segue o padrão Bearer Token: o cliente obtém o token via `POST /auth/login` e o envia no header `Authorization: Bearer <token>` nas requisições subsequentes. O middleware valida a assinatura e extrai o `sub` (user ID) sem consultar o banco.

**JWT:** mantém a API verdadeiramente stateless (alinhado com os princípios REST de Fielding), escala horizontalmente sem necessidade de armazenamento centralizado de sessões e é amplamente suportado por bibliotecas e ferramentas de teste.

---

### Documentação: OpenAPI 3.0 (Swagger)

A especificação OpenAPI é o padrão de mercado para descrever APIs REST de forma independente de linguagem. A documentação serve como contrato público da interface: clientes sabem exatamente quais endpoints existem, quais parâmetros esperam, quais schemas retornam e quais códigos de erro podem ocorrer — sem precisar ler o código-fonte.

Neste projeto, a documentação é gerada via **swagger-jsdoc** (que extrai anotações `@openapi` dos arquivos de rota) e servida interativamente pelo **swagger-ui-express** em `/api-docs`. Isso garante que a documentação evolui junto com o código, reduzindo o risco de desatualização.

---

A pilha Node.js + Express + Prisma + PostgreSQL representa hoje um dos padrões mais estabelecidos para APIs REST em JavaScript, com vasta documentação, comunidade ativa e amplo suporte em plataformas de hospedagem (Railway, Render, Heroku, AWS, etc.). A escolha do Prisma sobre ORMs mais antigos como Sequelize reflete uma tendência recente de preferência por ferramentas com melhor DX e integração nativa com TypeScript, mesmo em projetos JavaScript puro.
