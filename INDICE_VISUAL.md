# 🗺️ Índice Visual — DIO Explorer

> Mapa rápido do projeto em diagramas, tabelas e listas. Para detalhes completos, veja [DOCUMENTACAO_COMPLETA.md](DOCUMENTACAO_COMPLETA.md).

---

## Estrutura de arquivos

```
projeto_final_bob/
│
├── .bob/
│   └── mcp.json                  ← Registra o servidor MCP no Bob (não versionar)
│
├── .bobignore                    ← O que o Bob NÃO deve ver
│                                   (node_modules, .env, cache, builds)
│
├── .gitignore                    ← O que o Git NÃO deve versionar
│                                   (node_modules, coverage, .bob, .bobignore)
│
├── README.md                     ← Portal de entrada — visão geral e navegação
├── COMANDOS_SLASH.md             ← Referência dos comandos /trilha /desafio /certificado
├── DOCUMENTACAO_COMPLETA.md      ← Arquitetura, prompts, modos, lições, insights
├── INDICE_VISUAL.md              ← Este arquivo — mapas e tabelas rápidas
│
└── dio_explorer/
    │
    ├── commands/                 ← Prompt templates do Bob
    │   ├── trilha.md             ← /trilha <tecnologia>
    │   ├── desafio.md            ← /desafio <tecnologia> <nivel>
    │   └── certificado.md        ← /certificado <nome> <trilha>
    │
    ├── data/
    │   └── trilhas_dio.json      ← Base de dados — 33 trilhas DIO
    │
    ├── src/                      ← Lógica de negócio (Node.js / CommonJS)
    │   ├── trilha.js             ← carregarTrilhas, buscarTrilhaPorTecnologia,
    │   │                           listarTecnologias, gerarTitulosModulos, formatarPlanoEstudos
    │   ├── desafio.js            ← normalizarNivel, gerarDesafio, NIVEL_MAP, XP_MAP, TEMPO_MAP
    │   └── certificado.js        ← formatarData, gerarIniciais, gerarCodigoCertificado, gerarCertificado
    │
    ├── tests/                    ← Testes Jest
    │   ├── trilha.test.js        ← 35 testes unitários
    │   ├── desafio.test.js       ← 44 testes unitários
    │   ├── certificado.test.js   ← 35 testes unitários
    │   └── fluxo.test.js         ← 25 testes de integração end-to-end
    │
    ├── mcp/                      ← Servidor MCP em TypeScript
    │   ├── src/index.ts          ← 5 tools + McpServer + StdioServerTransport
    │   ├── build/index.js        ← Build compilado (não versionar)
    │   ├── package.json          ← "build": "tsc" | deps: @mcp/sdk, zod
    │   └── tsconfig.json         ← ES2022, Node16, strict, outDir: ./build
    │
    ├── docs/
    │   └── test_results.txt      ← Relatório detalhado dos 139 testes
    └── coverage/
        └── coverage-summary.json ← Cobertura gerada pelo Jest
```

---

## Fluxo de dados — do usuário ao JSON

```
Usuário digita no Bob
        │
        ▼
┌───────────────────────────────────────────────────────┐
│                Duas rotas possíveis                   │
│                                                       │
│  ROTA 1: Prompt Template          ROTA 2: MCP Tool    │
│  Bob lê commands/*.md             Bob chama a tool    │
│  Instrução em linguagem natural   Schema Zod validado │
│  Bob raciocina e formata          Handler executa     │
└──────────────┬────────────────────────────┬───────────┘
               │                            │
               ▼                            ▼
     Bob lê trilhas_dio.json     Servidor lê trilhas_dio.json
               │                            │
               └──────────┬─────────────────┘
                           ▼
                    Resposta Markdown
                    exibida ao usuário
```

---

## Mapa das dependências entre módulos

```
src/desafio.js
    └── require('./trilha')
            └── carregarTrilhas()  ──→  data/trilhas_dio.json
            └── buscarTrilhaPorTecnologia()
            └── listarTecnologias()

src/certificado.js
    └── require('./trilha')
            └── buscarTrilhaPorTecnologia()
            └── listarTecnologias()

tests/fluxo.test.js
    ├── require('../src/trilha')
    ├── require('../src/desafio')
    └── require('../src/certificado')

mcp/src/index.ts  (autônomo — não importa src/)
    └── readFileSync(trilhas_dio.json)
    └── lógica reescrita inline
```

---

## Cobertura de testes

| Arquivo | Stmts | Branch | Funcs | Lines | Status |
|---|---|---|---|---|---|
| `certificado.js` | 100% | 100% | 100% | 100% | ✅ |
| `desafio.js` | 100% | 100% | 100% | 100% | ✅ |
| `trilha.js` | 97,56% | 92,85% | 100% | 100% | ✅ |
| **TOTAL** | **98,91%** | **97,05%** | **100%** | **100%** | ✅ |

Meta configurada: ≥ 70% · **Resultado: superada em todas as dimensões**

---

## Resumo das 139 suítes de teste

| Suíte | Qtd | Grupos de describe |
|---|---|---|
| `trilha.test.js` | 35 | `carregarTrilhas` · `buscarTrilhaPorTecnologia` · `listarTecnologias` · `gerarTitulosModulos` · `formatarPlanoEstudos` |
| `desafio.test.js` | 44 | `normalizarNivel` · `XP_MAP e TEMPO_MAP` · `erros de entrada` · `Java intermediario` · `Java easy` · `Java avancado` · `Node.js sem template` |
| `certificado.test.js` | 35 | `formatarData` · `gerarIniciais` · `gerarCodigoCertificado` · `erros de entrada` · `Java` · `Python` |
| `fluxo.test.js` | 25 | `/trilha Java` · `/desafio Java intermediário` · `/certificado Carlos Henrique Java` · `tecnologia inválida` · `fluxo completo encadeado` |

---

## Trilhas por nível

| Nível | Quantidade | Tecnologias |
|---|---|---|
| **Básico** | 5 | Python · JavaScript · SQL · Design (UI/UX) · Power BI |
| **Intermediário** | 17 | React · Node.js · Angular · Vue.js · Java · C# · AWS · Azure · Flutter · React Native · Kotlin · NoSQL · Cybersecurity · QA · GraphQL · Go · MongoDB |
| **Avançado** | 11 | TypeScript · Google Cloud · DevOps · Machine Learning · Generative AI · Data Engineering · Swift · Next.js · Rust · Blockchain · Microsserviços |

---

## MCP tools registradas

| Tool | Parâmetros | Nível de uso |
|---|---|---|
| `listar-trilhas` | — | Descoberta de trilhas |
| `ver-trilha` | `tecnologia` | Plano de estudos |
| `gerar-desafio` | `tecnologia` + `nivel` | Prática de código |
| `gerar-certificado` | `nome_usuario` + `trilha` | Conclusão |
| `buscar-trilha-por-nivel` | `nivel` | Filtro por dificuldade |

---

## Modos do Bob — quando usar cada um

| Modo | Cor | Usar quando | Exemplos de prompt |
|---|---|---|---|
| **Ask** | 🔵 | Tirar dúvida, ler arquivo, entender conceito | `"Como funciona o MCP?"` |
| **Agent** | 🟢 | Criar arquivo, rodar comando, escrever código | `"Crie src/desafio.js com..."` |
| **Plan** | 🟣 | Planejar arquitetura, decompor problema | `"Como estruturo este projeto?"` |

---

## Aliases de tecnologia aceitos

| Digitado | Resolve para | Trilha encontrada |
|---|---|---|
| `aws` | Amazon Web Services | Formação Cloud AWS |
| `gcp` | Google Cloud | Formação Google Cloud Platform |
| `js` | JavaScript | Formação JavaScript Developer |
| `ts` | TypeScript | Formação TypeScript Fullstack |
| `k8s` | DevOps | Formação Docker e Kubernetes |
| `node` | Node.js (match parcial) | Formação Node.js Developer |
| `JAVA` | Java (case-insensitive) | Formação Java Developer |
| `machine` | Machine Learning (parcial) | Formação Machine Learning com Python |

---

## Variações de nível aceitas no /desafio

| Entrada | → | Nível canônico | XP | Tempo sugerido |
|---|---|---|---|---|
| `basico` · `básico` · `facil` · `fácil` · `easy` | → | **Básico** | 500 XP | 30 min |
| `intermediario` · `intermediário` · `medio` · `médio` · `medium` | → | **Intermediário** | 1500 XP | 60 min |
| `avancado` · `avançado` · `dificil` · `difícil` · `hard` | → | **Avançado** | 3000 XP | 90 min |

---

## Formato do código de certificado

```
DIO - <id trilha 3 dígitos> - <iniciais nome> <ano>

Exemplos:
  Carlos Henrique + Java (id 7)    → DIO-007-CH2025
  Ana Lima        + Python (id 1)  → DIO-001-AL2025
  Maria Silva     + React (id 3)   → DIO-003-MS2025
  João Dias       + AWS (id 10)    → DIO-010-JD2025
```

---

## Checklist de próximos passos

- [ ] Templates de desafio para as 30 tecnologias restantes (hoje: Java, Python, JS)
- [ ] Comando `/progresso` com rastreamento de trilhas concluídas por aluno
- [ ] Persistência com SQLite ou JSON de progresso por aluno
- [ ] SKILL.md do Bob que detecta intenção de aprendizado automaticamente
- [ ] Tool MCP `buscar-por-xp` com range de XP
- [ ] Publicar servidor MCP no npm
- [ ] Modo personalizado `custom_modes.yaml` especializado em DIO Explorer
- [ ] Substituir path absoluto no `mcp.json` por variável de ambiente

---

← [README.md](README.md) · [COMANDOS_SLASH.md](COMANDOS_SLASH.md) · [DOCUMENTACAO_COMPLETA.md](DOCUMENTACAO_COMPLETA.md)
