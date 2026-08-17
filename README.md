# 🤖 DIO Explorer

> Assistente de aprendizado da DIO construído com **IBM Bob AI** no programa **DIO + IBM**.

---

## O que é o DIO Explorer

O **DIO Explorer** é um assistente de aprendizado integrado à plataforma da DIO (Digital Innovation One), desenvolvido com o **IBM Bob AI** como projeto final do programa **DIO + IBM**. Ele permite que qualquer aluno explore trilhas de formação, receba desafios de código práticos, emita certificados de conclusão e agora também se teste com questões de múltipla escolha — tudo dentro de uma conversa com o Bob AI, sem sair do ambiente de desenvolvimento.

O projeto é composto por quatro camadas que trabalham juntas:

1. **Dados** — um catálogo com 33 trilhas DIO em `dio_explorer/data/trilhas_dio.json`
2. **Lógica de negócio** — módulos JavaScript em `dio_explorer/src/` que validam entradas e formatam saídas
3. **Servidor MCP** — um servidor Model Context Protocol em TypeScript (`dio_explorer/mcp/`) que expõe as ferramentas ao Bob AI
4. **Comandos slash** — templates de prompt em `dio_explorer/commands/` que definem o comportamento de cada comando

---

## Como executar o projeto

**Pré-requisitos:** Node.js 18+ e npm instalados.

```bash
# 1. Instalar dependências dos testes
cd dio_explorer
npm install

# 2. Compilar o servidor MCP
cd mcp
npm install
npm run build
```

Após o build, o Bob detecta automaticamente o servidor MCP via [`.bob/mcp.json`](.bob/mcp.json) e os comandos slash ficam disponíveis imediatamente ao abrir o projeto no Bob AI.

---

## Como usar os comandos

O DIO Explorer oferece quatro comandos slash que podem ser usados diretamente no chat do Bob AI:

| Comando | O que faz | Exemplo |
|---|---|---|
| `/trilha <tecnologia>` | Exibe o plano de estudos completo de uma trilha | `/trilha Python` |
| `/desafio <tecnologia> <nível>` | Gera um desafio de código prático e avaliável | `/desafio JavaScript Intermediário` |
| `/certificado <nome> <trilha>` | Emite um certificado de conclusão em Markdown | `/certificado João Silva React` |
| `/teste <tecnologia> <nível>` | Gera 5 questões de múltipla escolha com gabarito | `/teste Java Básico` |

**Níveis aceitos:** Básico · Intermediário · Avançado (e variações em inglês: easy, medium, hard)

---

## Como executar os testes

O projeto conta com uma suíte de 139 testes Jest cobrindo unitários e integração:

```bash
# A partir da raiz do projeto
cd dio_explorer
npm test
```

Para ver o relatório de cobertura de código:

```bash
npm test -- --coverage
```

A cobertura atual é de **98,91%**. Os testes estão organizados em `dio_explorer/tests/` e cobrem validação de entradas, formatação de saídas, busca de trilhas e integração com o servidor MCP.

---

## Melhorias realizadas

Durante o desenvolvimento do projeto, uma melhoria foi incorporada além do escopo inicial:

### Comando `/teste` — Avaliação por múltipla escolha

O comando `/teste <tecnologia> <nível>` foi adicionado como uma quarta funcionalidade ao DIO Explorer. Enquanto o `/desafio` propõe um problema aberto para o aluno resolver, o `/teste` gera **5 questões de múltipla escolha** com 4 alternativas cada, cobrindo aspectos distintos da tecnologia escolhida — e apresenta o gabarito completo com justificativas ao final.

O template está definido em [`dio_explorer/commands/teste.md`](dio_explorer/commands/teste.md) e segue as mesmas regras de validação dos demais comandos: detecta tecnologias não cadastradas, normaliza variações de nível (básico/fácil/easy, etc.) e exige que o Bob solicite esclarecimento quando o nível informado não for reconhecido.

Isso agora permite que o aluno use o DIO Explorer em três momentos diferentes da sua jornada: **explorar** a trilha com `/trilha`, **praticar** com `/desafio`, **avaliar** seu conhecimento com `/teste` e **celebrar** a conclusão com `/certificado`.

---

## O que aprendi durante o desafio

Durante este desafio, aprendi a utilizar o **Bob AI de forma mais eficiente para meus objetivos**: entendi como os modos Agent, Plan e Ask se complementam, como usar os comandos slash para acelerar tarefas repetitivas, e como o servidor MCP permite que o Bob acesse dados externos de forma estruturada e segura.

Além disso, aprendi a **estruturar melhor meus projetos** — separar responsabilidades em camadas (dados, lógica, servidor, comandos), escrever testes com cobertura alta antes de expandir funcionalidades, e documentar decisões de forma que o projeto fale por si mesmo. O processo de construir o DIO Explorer com o Bob como par de programação mostrou que a qualidade do resultado depende diretamente da clareza com que você define o que quer e da disciplina em validar cada etapa antes de avançar.

---

## Estrutura do projeto

```
projeto_final_bob/
├── .bob/mcp.json            ← registra o servidor MCP no Bob
├── .bobignore               ← exclui node_modules, .env e builds do contexto
├── README.md                ← você está aqui
├── COMANDOS_SLASH.md        ← referência completa dos 4 comandos
├── DOCUMENTACAO_COMPLETA.md ← arquitetura, stack, testes e lições aprendidas
├── INDICE_VISUAL.md         ← mapa visual do projeto
└── dio_explorer/
    ├── commands/            ← templates de prompt (/trilha, /desafio, /certificado, /teste)
    ├── data/                ← trilhas_dio.json (33 trilhas)
    ├── src/                 ← lógica de negócio (JS/CommonJS)
    ├── tests/               ← 139 testes unitários e de integração
    └── mcp/                 ← servidor MCP em TypeScript
```

---

## Navegação da documentação

| Arquivo | Conteúdo |
|---|---|
| 📄 **README.md** | Você está aqui — visão geral e navegação |
| 🎮 [**COMANDOS_SLASH.md**](COMANDOS_SLASH.md) | Referência completa dos comandos com exemplos, aliases e formatos de saída |
| 📚 [**DOCUMENTACAO_COMPLETA.md**](DOCUMENTACAO_COMPLETA.md) | Arquitetura, stack, servidor MCP, testes, lições aprendidas e prompts usados |
| 🗺️ [**INDICE_VISUAL.md**](INDICE_VISUAL.md) | Mapa visual do projeto: estrutura de arquivos, fluxos e tabelas de cobertura |

---

## Tecnologias

`IBM Bob AI` · `Model Context Protocol` · `TypeScript` · `Node.js` · `Jest` · `Zod`

---

<div align="center">

Desenvolvido com ❤️ usando **IBM Bob AI** · DIO + IBM · Junho 2025

*"O aprendizado contínuo é a chave para o sucesso na era digital."*

</div>
