# 📚 Documentação Completa — DIO Explorer

> Tudo sobre como este projeto foi construído: arquitetura, stack, servidor MCP, testes, prompts usados com o Bob, modos utilizados, lições aprendidas e insights para futuros profissionais.

---

## Índice

1. [Arquitetura geral](#1-arquitetura-geral)
2. [Stack e tecnologias](#2-stack-e-tecnologias)
3. [Como executar o projeto](#3-como-executar-o-projeto)
4. [O servidor MCP](#4-o-servidor-mcp)
5. [Testes e cobertura](#5-testes-e-cobertura)
6. [Modos do Bob usados](#6-modos-do-bob-usados)
7. [Prompts utilizados com o Bob](#7-prompts-utilizados-com-o-bob)
8. [Dicas de uso do Bob](#8-dicas-de-uso-do-bob)
9. [Insights para futuros profissionais](#9-insights-para-futuros-profissionais)
10. [Lições aprendidas](#10-lições-aprendidas)
11. [Próximos passos](#11-próximos-passos)
12. [Referências](#12-referências)

---

## 1. Arquitetura geral

O projeto tem três camadas complementares que entregam as mesmas funcionalidades de formas diferentes:

```
┌──────────────────────────────────────────────────────────┐
│                       BOB AI (IBM)                       │
│                                                          │
│  ┌─────────────┐   ┌──────────────┐   ┌──────────────┐  │
│  │  Ask Mode   │   │  Agent Mode  │   │  Plan Mode   │  │
│  │  (consulta) │   │  (código)    │   │  (design)    │  │
│  └──────┬──────┘   └──────┬───────┘   └──────┬───────┘  │
│         └─────────────────┴──────────────────┘           │
│                           │                              │
│               ┌───────────▼──────────┐                   │
│               │   MCP Tool Registry  │                   │
│               │  (.bob/mcp.json)     │                   │
│               └───────────┬──────────┘                   │
└───────────────────────────┼──────────────────────────────┘
                            │ stdio transport
            ┌───────────────▼──────────────────┐
            │     dio-explorer-mcp server       │
            │     (mcp/build/index.js)          │
            │                                  │
            │  Tools:  listar-trilhas           │
            │          ver-trilha               │
            │          gerar-desafio            │
            │          gerar-certificado        │
            │          buscar-trilha-por-nivel  │
            └───────────────┬──────────────────┘
                            │ readFileSync
            ┌───────────────▼──────────────────┐
            │   dio_explorer/data/             │
            │   trilhas_dio.json               │
            │   (33 trilhas cadastradas)       │
            └──────────────────────────────────┘
```

### Três formas de entregar a mesma funcionalidade

| Camada | Arquivo | Como o Bob usa | Testável com Jest |
|---|---|---|---|
| Prompt template | `commands/*.md` | Bob lê o template e gera resposta em linguagem natural | Não |
| Lógica de negócio | `src/*.js` | Importado diretamente pelos testes de integração | **Sim** |
| Servidor MCP | `mcp/src/index.ts` | Bob chama a tool via protocolo MCP/stdio | Não (indireto) |

---

## 2. Stack e tecnologias

| Camada | Tecnologia | Versão | Propósito |
|---|---|---|---|
| AI Agent | IBM Bob | — | Orquestração, geração de código, execução |
| MCP Protocol | `@modelcontextprotocol/sdk` | ^1.12.1 | Comunicação Bob ↔ Servidor de tools |
| Validação MCP | `zod` | ^3.25.42 | Tipagem e validação dos parâmetros das tools |
| Lógica | Node.js / JavaScript | CJS | Módulos de negócio reutilizáveis e testáveis |
| MCP Server | TypeScript | ^5.8.3 | Servidor MCP compilado para Node16/ES2022 |
| Testes | Jest | ^29.7.0 | Testes unitários e de integração com cobertura |
| Dados | JSON | — | Base de trilhas DIO (`trilhas_dio.json`) |
| Transporte MCP | stdio | — | Comunicação entre Bob e o servidor MCP |

---

## 3. Como executar o projeto

### Pré-requisitos

- Node.js 18+
- npm 9+

### Instalar dependências

```bash
# Lógica de negócio + testes (Jest)
cd dio_explorer
npm install

# Servidor MCP
cd dio_explorer/mcp
npm install
```

### Rodar os testes

```bash
cd dio_explorer

# Resumido (com cobertura)
npm test

# Detalhado (verbose + cobertura)
npm run test:verbose
```

### Compilar o servidor MCP

```bash
cd dio_explorer/mcp
npm run build       # TypeScript → build/index.js
```

Após compilar, o arquivo `.bob/mcp.json` já aponta para o build. O Bob detecta o servidor automaticamente na próxima sessão:

```json
{
  "mcpServers": {
    "dio-explorer-mcp": {
      "command": "node",
      "args": ["<caminho_absoluto>/dio_explorer/mcp/build/index.js"]
    }
  }
}
```

> ⚠️ O path deve ser **absoluto**. O `.bob/` está no `.gitignore` pois contém caminhos específicos de cada máquina.

---

## 4. O servidor MCP

O **Model Context Protocol (MCP)** é o padrão open-source que permite ao Bob usar ferramentas externas como se fossem capacidades nativas suas.

### Ciclo de uma chamada

```
Bob recebe: "listar as trilhas de nível Avançado"
     ↓
Bob identifica a tool: buscar-trilha-por-nivel
     ↓
Bob chama via stdio: { nivel: "Avançado" }
     ↓
Servidor MCP (index.js) recebe o chamado
     ↓
Lê trilhas_dio.json e filtra por nivel === "Avançado"
     ↓
Retorna conteúdo Markdown formatado
     ↓
Bob exibe a resposta ao usuário
```

### Tools registradas

| Tool | Parâmetros | Descrição |
|---|---|---|
| `listar-trilhas` | — | Lista todas as 33 trilhas com id, nível e XP |
| `ver-trilha` | `tecnologia: string` | Plano completo com módulos, lives e badges |
| `gerar-desafio` | `tecnologia: string`, `nivel: string` | Desafio prático com XP e critérios |
| `gerar-certificado` | `nome_usuario: string`, `trilha: string` | Certificado Markdown com código único |
| `buscar-trilha-por-nivel` | `nivel: string` | Filtra trilhas por Básico/Intermediário/Avançado |

### Estrutura do servidor (`mcp/src/index.ts`)

```typescript
const server = new McpServer({ name: "dio-explorer-mcp", version: "1.0.0" });

server.tool("ver-trilha", "Descrição da tool", {
  tecnologia: z.string().describe("Ex: Python, React, AWS")
}, async ({ tecnologia }) => {
  // lógica...
  return { content: [{ type: "text", text: resultado }] };
});

const transport = new StdioServerTransport();
await server.connect(transport);
```

---

## 5. Testes e cobertura

### Cobertura final

| Arquivo | Statements | Branches | Functions | Lines |
|---|---|---|---|---|
| `certificado.js` | 100% | 100% | 100% | 100% |
| `desafio.js` | 100% | 100% | 100% | 100% |
| `trilha.js` | 97,56% | 92,85% | 100% | 100% |
| **TOTAL** | **98,91%** | **97,05%** | **100%** | **100%** |

**Meta configurada no `package.json`:** ≥ 70% em todas as dimensões ✅

### Suítes de teste

| Suíte | Testes | O que cobre |
|---|---|---|
| `trilha.test.js` | 35 | `carregarTrilhas`, `buscarTrilhaPorTecnologia`, `listarTecnologias`, `gerarTitulosModulos`, `formatarPlanoEstudos` |
| `desafio.test.js` | 44 | `normalizarNivel` (todos os aliases PT/EN), `gerarDesafio` (templates Java/Python/JS, fallback genérico), XP e tempo por nível |
| `certificado.test.js` | 35 | `formatarData`, `gerarIniciais`, `gerarCodigoCertificado`, `gerarCertificado` com Java e Python |
| `fluxo.test.js` | 25 | Integração end-to-end: trilha → desafio → certificado para o aluno "Carlos Henrique" com Java |
| **Total** | **139** | **100% aprovados** |

### Estratégia de testes adotada

1. **Estrutura de dados** — o JSON tem todos os campos obrigatórios em todas as 33 trilhas
2. **Casos de sucesso** — saída esperada para inputs válidos, verificando o conteúdo (não só se roda)
3. **Edge cases** — `null`, string vazia, tipo numérico, tecnologia inexistente, nível desconhecido
4. **Aliases** — `aws`, `js`, `k8s`, `easy`, `hard`, `medium` funcionam corretamente
5. **Integração** — fluxo real step-by-step simulando a jornada de um aluno completo

---

## 6. Modos do Bob usados

### 🔵 Ask Mode — Consulta e explicação

**Quando usar:** Entender conceitos, explorar arquivos, tirar dúvidas sem alterar código.

**Usado neste projeto para:**
- Entender como o protocolo MCP funciona
- Verificar se uma implementação estava correta antes de alterar
- Ler e analisar arquivos existentes
- Tirar dúvidas sobre Jest, TypeScript, Node.js

**Exemplo:**
```
Como o Bob detecta e usa um servidor MCP registrado no mcp.json?
```

---

### 🟢 Agent Mode — Implementação e criação

**Quando usar:** Criar arquivos, escrever código, rodar comandos, instalar dependências.

**Usado neste projeto para:**
- Criar todos os arquivos `.js`, `.ts`, `.json`, `.md`
- Rodar `npm install`, `npm test`, `tsc`
- Escrever e iterar sobre os testes Jest
- Compilar o servidor MCP

> ⚡ O Agent Mode usa `apply_diff` para edições cirúrgicas e `write_file` para criações — apenas o necessário é alterado.

**Exemplo:**
```
Crie src/desafio.js com suporte a aliases de nível em PT e EN.
A função gerarDesafio deve retornar { ok: boolean, conteudo: string }.
```

---

### 🟣 Plan Mode — Design e estratégia

**Quando usar:** Decompor problemas complexos, desenhar arquitetura, planejar antes de implementar.

**Usado neste projeto para:**
- Definir a estrutura de diretórios antes de criar os arquivos
- Planejar a separação entre prompt templates, lógica JS e servidor MCP
- Decidir a estratégia de testes

**Exemplo:**
```
Quero que o DIO Explorer funcione como prompt template E como servidor MCP.
Como estruturo o projeto para suportar os dois sem duplicar a lógica?
```

---

## 7. Prompts utilizados com o Bob

### Planejamento (Ask / Plan Mode)

```
Como funciona o protocolo MCP e como posso criar um servidor
que o Bob AI consiga usar como ferramenta nativa?
```

```
Quero construir um sistema de trilhas de aprendizado para a DIO
com 3 comandos: /trilha, /desafio e /certificado.
Como devo estruturar o projeto?
```

```
Qual é a diferença entre usar prompt templates (commands/*.md)
e um servidor MCP para expor funcionalidades ao Bob?
```

---

### Base de dados (Agent Mode)

```
Crie trilhas_dio.json com pelo menos 30 trilhas de formação da DIO cobrindo
as principais tecnologias do mercado. Cada trilha deve ter:
id, nome, tecnologia, nivel, modulos, xp_total, badges e lives_ao_vivo.
```

```
Adicione mais 3 trilhas ao trilhas_dio.json: Rust, Blockchain e GraphQL,
seguindo exatamente o mesmo formato das trilhas existentes.
```

---

### Lógica de negócio (Agent Mode)

```
Crie dio_explorer/src/trilha.js com as funções:
- carregarTrilhas(): lê o JSON e retorna o array
- buscarTrilhaPorTecnologia(tecnologia): busca case-insensitive com match parcial
- listarTecnologias(): retorna array de strings
- gerarTitulosModulos(trilha): gera títulos progressivos para os módulos
- formatarPlanoEstudos(trilha): formata tudo em Markdown
Use CommonJS (require/module.exports) e boas práticas.
```

```
Implemente src/desafio.js com suporte a aliases de nível em PT e EN.
A função gerarDesafio deve retornar { ok: boolean, conteudo: string }.
Inclua templates específicos para Java, Python e JavaScript.
```

```
Crie src/certificado.js que gera um certificado Markdown com código único
no formato DIO-<id_3dígitos>-<iniciais_maiúsculas><ano>.
A função principal deve aceitar uma data opcional para facilitar os testes.
```

---

### Prompt templates (Agent Mode)

```
Crie commands/trilha.md como prompt template do Bob.
Instrua o Bob a buscar a trilha no JSON e formatar em Markdown
com módulos progressivos, lives e badges. Use $1 para a tecnologia.
```

```
Crie commands/desafio.md aceitando variações de nível em PT e EN.
Formato exato de saída: Descrição, Entrada, Saída esperada, Dicas,
Critérios de Aceite, Tempo e XP.
```

```
Crie commands/certificado.md que gere um certificado Markdown bonito
com todas as informações da trilha, data por extenso e código único.
Adicione uma mensagem de parabenização ao final.
```

---

### Testes (Agent Mode)

```
Crie tests/trilha.test.js com Jest cobrindo todas as funções de src/trilha.js.
Cubra: sucesso, edge cases (null, string vazia, tipo errado),
aliases "aws" e "k8s", e estrutura do JSON. Meta: cobertura ≥ 70%.
```

```
Crie tests/desafio.test.js cobrindo: todos os aliases PT/EN,
casos de erro, os 3 templates específicos (Java/Python/JS),
tecnologias sem template dedicado (Node.js) e XP/tempo por nível.
```

```
Crie tests/fluxo.test.js com integração que simule o fluxo completo:
aluno consulta trilha Java, gera desafio, recebe certificado.
Use step-by-step com beforeAll e fluxo encadeado.
```

```
A cobertura de branches em trilha.js está em 92,85%.
Qual branch não está coberta? Como adiciono um teste para cobri-la?
```

---

### Servidor MCP (Agent Mode)

```
Crie mcp/src/index.ts com 5 tools usando @modelcontextprotocol/sdk e zod:
listar-trilhas, ver-trilha, gerar-desafio, gerar-certificado, buscar-trilha-por-nivel.
Use ES Modules (type: module) e transporte stdio.
O servidor deve ler o JSON diretamente sem depender dos módulos src/.
```

```
Configure tsconfig.json para ES2022, Node16 module resolution,
strict mode e output em ./build. Crie o package.json com "build": "tsc".
```

```
Registre o servidor MCP no .bob/mcp.json usando path absoluto
para build/index.js. Como o Bob vai descobrir e usar este servidor?
```

---

### Infraestrutura (Agent Mode)

```
Crie .bobignore excluindo: node_modules/, .env,
data/cache-progresso/, docs/certificados-emitidos/ e *.tmp.
Explique por que cada exclusão é importante.
```

```
Configure .gitignore para não versionar: node_modules/, coverage/,
.bob/ e .bobignore. Por que .bob/ não deve ir para o repositório?
```

```
Configure package.json com Jest para cobertura mínima de 70%
em statements, branches, functions e lines.
Scripts: test, test:verbose e test:report.
```

---

### Documentação (Agent Mode)

```
Bob, documente todo o projeto com todos os prompts usados,
modos de uso, dicas e insights para futuros profissionais.
```

```
Separe o README.md em COMANDOS_SLASH.md, DOCUMENTACAO_COMPLETA.md,
INDICE_VISUAL.md e README.md para deixar o projeto mais claro e visual.
```

---

## 8. Dicas de uso do Bob

### Seja específico nos prompts

❌ `"Crie os testes"`

✅ `"Crie tests/trilha.test.js com Jest para todas as funções de src/trilha.js. Cubra casos de sucesso, edge cases com null e string vazia, e aliases como 'aws'. Use describe/test e beforeAll onde fizer sentido."`

---

### Use o modo certo para cada tarefa

| Tarefa | Modo |
|---|---|
| Tirar dúvida técnica | Ask |
| Ler um arquivo | Ask |
| Planejar arquitetura | Plan |
| Criar ou editar arquivo | Agent |
| Rodar `npm test` / `tsc` | Agent |
| Debugar erro de teste | Agent |

---

### Use o `.bobignore` estrategicamente

O `.bobignore` controla o que o Bob "vê" no projeto. Exclua:
- `node_modules/` — nunca deve ir para o contexto
- `.env` — segurança: chaves e secrets fora do contexto
- Arquivos de build gerados automaticamente
- Diretórios de cache e arquivos temporários

---

### Aproveite o histórico da conversa

O Bob mantém o contexto. Você pode:
- `"Agora adicione tratamento de erro para o caso onde o JSON não é encontrado"`
- `"Na função que você criou, adicione suporte ao alias 'k8s'"`
- `"Os testes de trilha.test.js passaram, agora crie os de desafio.test.js no mesmo padrão"`

---

### Peça ao Bob para explicar antes de implementar

```
Antes de implementar, explica as vantagens e desvantagens de usar
um servidor MCP TypeScript vs prompt templates .md para expor
as funcionalidades do DIO Explorer ao Bob.
```

---

### Crie e teste na mesma conversa

```
Crie tests/certificado.test.js com todos os testes para src/certificado.js
e em seguida rode npm test para validar que todos passam.
```

---

## 9. Insights para futuros profissionais

### IA como copiloto — não como substituto

> **O Bob não substitui o programador — ele amplifica o programador.**

O Bob foi usado para gerar boilerplate, escrever 139 testes rapidamente, manter consistência de estilo e refatorar sem quebrar funcionalidades. O profissional foi essencial para definir requisitos, revisar o código, decidir o escopo e entender o que estava sendo construído.

---

### O protocolo MCP é o futuro da integração com IA

Saber criar, registrar e chamar um servidor MCP é uma habilidade de **fronteira** em 2025. O ciclo completo — schema zod → tool handler → stdio transport → resposta Markdown — diferencia profissionais que apenas usam IA de profissionais que **integram IA** em sistemas reais.

---

### Testes com IA são mais eficazes quando você controla o contrato

1. Defina primeiro o que a função recebe e retorna
2. Peça ao Bob para gerar testes cobrindo edge cases
3. Analise a cobertura e itere com prompts específicos
4. Revise os testes para garantir que testam **comportamento**, não só que o código roda

> **Antipadrão:** testes que apenas verificam que o código não lança exceção, sem checar o conteúdo da saída.

---

### Separação de responsabilidades ainda importa

Mesmo com IA, a separação em camadas (prompt template / lógica JS / servidor MCP) garante testabilidade, manutenibilidade e flexibilidade. Código gerado por IA sem estrutura vira dívida técnica tão rápido quanto código humano.

---

### Documente progressivamente — não ao final

A documentação feita **junto com o código** é mais fiel, mais rápida e mais útil. Use:
```
Adicione uma seção no README documentando o que acabamos de implementar.
```

---

## 10. Lições aprendidas

### O que funcionou muito bem

1. **Começar com o JSON de dados** — ter `trilhas_dio.json` definido cedo permitiu que toda a lógica fosse construída em cima de dados reais.
2. **Testes desde o início** — escrever testes junto com o código garantiu que as refatorações do servidor MCP não quebraram a lógica de negócio.
3. **Separar lógica JS do servidor MCP** — `src/*.js` é testável com Jest; `mcp/src/index.ts` usa a mesma lógica reescrita em TypeScript. A duplicação foi intencional e vale a pena.
4. **`.bobignore` bem configurado** — manter `node_modules/` fora do contexto acelerou todas as interações.
5. **Nomear bem as tools MCP** — nomes como `buscar-trilha-por-nivel` tornam as respostas do Bob mais precisas.

### O que pode ser melhorado

1. **Templates de desafio para apenas 3 tecnologias** — Java, Python e JavaScript têm templates específicos; as outras 30 usam fallback genérico.
2. **Path absoluto no `mcp.json`** — o arquivo não pode ser versionado porque depende do caminho local.
3. **Dados estáticos** — o `trilhas_dio.json` é estático; uma API tornaria o projeto verdadeiramente dinâmico.

---

## 11. Próximos passos

- [ ] Adicionar templates de desafio para todas as 33 tecnologias
- [ ] Criar o comando `/progresso` para rastrear trilhas concluídas por aluno
- [ ] Implementar persistência com SQLite ou arquivo JSON de progresso
- [ ] Criar uma SKILL.md do Bob que detecta intenção de aprendizado e usa as tools automaticamente
- [ ] Adicionar tool MCP `buscar-por-xp` com range de XP mínimo e máximo
- [ ] Publicar o servidor MCP no npm para uso em outros projetos Bob
- [ ] Criar um modo personalizado (`custom_modes.yaml`) especializado em DIO Explorer
- [ ] Substituir o path absoluto no `mcp.json` por variável de ambiente

---

## 12. Referências

- [DIO — Digital Innovation One](https://dio.me)
- [IBM Bob AI](https://www.ibm.com)
- [Model Context Protocol](https://modelcontextprotocol.io)
- [@modelcontextprotocol/sdk — npm](https://www.npmjs.com/package/@modelcontextprotocol/sdk)
- [Zod — TypeScript-first schema validation](https://zod.dev)
- [Jest — JavaScript Testing Framework](https://jestjs.io)

---

← [README.md](README.md) · [COMANDOS_SLASH.md](COMANDOS_SLASH.md) · [INDICE_VISUAL.md](INDICE_VISUAL.md)
