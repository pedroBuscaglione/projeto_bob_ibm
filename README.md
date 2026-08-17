# 🤖 DIO Explorer

> Assistente de aprendizado da DIO construído com **IBM Bob AI** no programa **DIO + IBM**.

---

## O que é este projeto

O **DIO Explorer** permite que qualquer aluno da DIO explore trilhas de formação, receba desafios de código e emita certificados de conclusão — tudo dentro de uma conversa com o Bob AI.

| Comando | O que faz |
|---|---|
| `/trilha <tecnologia>` | Exibe o plano de estudos completo de uma trilha |
| `/desafio <tecnologia> <nível>` | Gera um desafio de código prático e avaliável |
| `/certificado <nome> <trilha>` | Emite um certificado de conclusão em Markdown |

---

## Navegação da documentação

| Arquivo | Conteúdo |
|---|---|
| 📄 **README.md** | Você está aqui — visão geral e navegação |
| 🎮 [**COMANDOS_SLASH.md**](COMANDOS_SLASH.md) | Referência completa dos comandos `/trilha`, `/desafio` e `/certificado` com exemplos, aliases e formatos de saída |
| 📚 [**DOCUMENTACAO_COMPLETA.md**](DOCUMENTACAO_COMPLETA.md) | Arquitetura, stack, servidor MCP, testes, lições aprendidas, insights e prompts usados |
| 🗺️ [**INDICE_VISUAL.md**](INDICE_VISUAL.md) | Mapa visual do projeto: estrutura de arquivos, fluxos, tabelas de cobertura e próximos passos |

---

## Início rápido

```bash
# 1. Instalar dependências dos testes
cd dio_explorer
npm install

# 2. Rodar os 139 testes
npm test

# 3. Compilar o servidor MCP
cd mcp && npm install && npm run build
```

Após o build, o Bob detecta automaticamente o servidor MCP via [`.bob/mcp.json`](.bob/mcp.json).

---

## Números do projeto

| | |
|---|---|
| **33** trilhas DIO cadastradas | **139** testes Jest aprovados |
| **5** MCP tools registradas | **98,91%** de cobertura de código |
| **3** modos do Bob utilizados | **3** camadas de implementação |

---

## Estrutura em 30 segundos

```
projeto_final_bob/
├── .bob/mcp.json           ← registra o servidor MCP no Bob
├── .bobignore              ← exclui node_modules, .env e builds do contexto
├── README.md               ← você está aqui
├── COMANDOS_SLASH.md       ← referência dos 3 comandos
├── DOCUMENTACAO_COMPLETA.md ← tudo sobre o projeto
├── INDICE_VISUAL.md        ← mapa visual
└── dio_explorer/
    ├── commands/           ← prompt templates do Bob
    ├── data/               ← trilhas_dio.json (33 trilhas)
    ├── src/                ← lógica de negócio (JS/CommonJS)
    ├── tests/              ← testes unitários e de integração
    └── mcp/                ← servidor MCP em TypeScript
```

---

## Tecnologias

`IBM Bob AI` · `Model Context Protocol` · `TypeScript` · `Node.js` · `Jest` · `Zod`

---

<div align="center">

Desenvolvido com ❤️ usando **IBM Bob AI** · DIO + IBM · Junho 2025

*"O aprendizado contínuo é a chave para o sucesso na era digital."*

</div>
