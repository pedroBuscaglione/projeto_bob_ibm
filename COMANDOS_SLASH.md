# 🎮 Comandos Slash — Referência Completa

> Referência de uso dos três comandos do DIO Explorer. Para arquitetura, testes e prompts, veja [DOCUMENTACAO_COMPLETA.md](DOCUMENTACAO_COMPLETA.md).

---

## Sumário

- [/trilha](#trilha-tecnologia)
- [/desafio](#desafio-tecnologia-nível)
- [/certificado](#certificado-nome-trilha)
- [Aliases suportados](#aliases-suportados)
- [Variações de nível aceitas](#variações-de-nível-aceitas)

---

## `/trilha <tecnologia>`

Exibe o plano de estudos completo de uma trilha DIO.

**Arquivo de comando:** [`dio_explorer/commands/trilha.md`](dio_explorer/commands/trilha.md)  
**MCP tool equivalente:** `ver-trilha`

### Exemplos de uso

```
/trilha Python
/trilha react
/trilha aws
/trilha node
/trilha machine learning
```

### Saída gerada

```markdown
# 🎓 Trilha: Formação Java Developer

**Tecnologia:** Java
**Nível:** Intermediário
**Total de Módulos:** 10
**XP Total:** 22000 XP

---

## 📚 Módulos da Trilha

  Módulo 1 – Introdução e Fundamentos
  Módulo 2 – Conceitos Essenciais
  ...
  Módulo 10 – Projeto Final

---

## 🎥 Lives ao Vivo

- **POO com Java na Prática** — ⏱ 120 min
- **APIs REST com Spring Boot** — ⏱ 90 min
- **Testes Unitários com JUnit e Mockito** — ⏱ 60 min

---

## 🏅 Badges que você vai conquistar

🏷️ Java Foundations
🏷️ Spring Boot Expert
🏷️ Java Developer
```

### Comportamento quando a tecnologia não é encontrada

O Bob lista todas as tecnologias disponíveis e pede para o usuário escolher.

---

## `/desafio <tecnologia> <nível>`

Gera um desafio de código prático, avaliável e com critérios claros.

**Arquivo de comando:** [`dio_explorer/commands/desafio.md`](dio_explorer/commands/desafio.md)  
**MCP tool equivalente:** `gerar-desafio`

### Exemplos de uso

```
/desafio Java intermediário
/desafio Python easy
/desafio JavaScript avançado
/desafio node medium
/desafio react hard
```

### Saída gerada

```markdown
# ⚡ Desafio Java — Nível Intermediário

## 📋 Descrição
Crie um programa Java que receba o salário bruto de um funcionário
e calcule o salário líquido aplicando desconto do INSS e do IR simplificado.

## 📥 Entrada
Um valor decimal representando o salário bruto. Exemplo: 4500.00

## 📤 Saída esperada
Salário Bruto: R$ 4500,00
Desconto INSS: R$ 405,00
Desconto IR: R$ 337,50
Salário Líquido: R$ 3757,50

## 💡 Dicas
- Use BigDecimal para operações financeiras
- Separe a lógica em métodos privados

## ✅ Critérios de Aceite
- [ ] O código deve produzir a saída esperada para o exemplo dado
- [ ] O código deve tratar ao menos um caso extremo (edge case)
- [ ] Implemente usando POO com pelo menos uma classe de serviço

## ⏱ Tempo sugerido
60 minutos

## 🏆 XP ao concluir
1500 XP
```

### Templates de desafio com enunciado específico

| Tecnologia | Desafio |
|---|---|
| **Java** | Calculadora de Salário Líquido (INSS + IR) |
| **Python** | Analisador de Frequência de Palavras |
| **JavaScript** | Validador de CPF (algoritmo oficial) |
| Demais (30 tech.) | Desafio genérico contextualizado à tecnologia e nível |

---

## `/certificado <nome> <trilha>`

Emite um certificado de conclusão formatado em Markdown com código único.

**Arquivo de comando:** [`dio_explorer/commands/certificado.md`](dio_explorer/commands/certificado.md)  
**MCP tool equivalente:** `gerar-certificado`

### Exemplos de uso

```
/certificado "Carlos Henrique" Java
/certificado "Ana Lima" python
/certificado "Maria Silva" react
/certificado "João Dias" aws
```

### Saída gerada

```markdown
---

<div align="center">

# 🏆 CERTIFICADO DE CONCLUSÃO

### Digital Innovation One — Programa de Formação

---

## Este certificado é concedido a

# Carlos Henrique

pela conclusão da

## Formação Java Developer

**Tecnologia:** Java
**Nível:** Intermediário
**Módulos Concluídos:** 10 de 10
**XP Conquistado:** 22000 XP

---

### 🏅 Badges Conquistadas

Java Foundations · Spring Boot Expert · Java Developer

---

**Data de Conclusão:** 18 de junho de 2025
**Código do Certificado:** DIO-007-CH2025

---

> *"O aprendizado contínuo é a chave para o sucesso na era digital."*
> — Digital Innovation One

---

✅ **Certificado válido** | 🌐 dio.me | 📧 contato@dio.me

</div>

---
```

### Formato do código único

```
DIO - <id da trilha em 3 dígitos> - <iniciais do nome em maiúsculas> <ano>

Exemplos:
  "Carlos Henrique" + Java (id 7)  → DIO-007-CH2025
  "Ana Lima"        + Python (id 1) → DIO-001-AL2025
  "Maria Silva"     + React (id 3)  → DIO-003-MS2025
```

---

## Aliases suportados

Você pode digitar versões abreviadas das tecnologias:

| Digitado | Resolve para |
|---|---|
| `aws` | Amazon Web Services |
| `gcp` | Google Cloud |
| `js` | JavaScript |
| `ts` | TypeScript |
| `k8s` | DevOps |

Além dos aliases, a busca é **case-insensitive** e faz **match parcial**:

| Digitado | Encontra |
|---|---|
| `node` | Node.js |
| `JAVA` | Java |
| `react native` | React Native |
| `machine` | Machine Learning |
| `gen ai` | Generative AI |

---

## Variações de nível aceitas

O comando `/desafio` aceita o nível em português e inglês, com ou sem acento:

| Entrada aceita | Nível canônico | XP | Tempo |
|---|---|---|---|
| `básico` · `basico` · `fácil` · `facil` · `easy` | **Básico** | 500 XP | 30 min |
| `intermediário` · `intermediario` · `médio` · `medio` · `medium` | **Intermediário** | 1500 XP | 60 min |
| `avançado` · `avancado` · `difícil` · `dificil` · `hard` | **Avançado** | 3000 XP | 90 min |

---

## MCP tools disponíveis diretamente no Bob

Além dos comandos slash, você pode pedir ao Bob para usar as tools nativas:

| Pergunta natural | Tool acionada |
|---|---|
| "Liste todas as trilhas disponíveis" | `listar-trilhas` |
| "Mostre a trilha de React" | `ver-trilha` |
| "Gere um desafio de Python avançado" | `gerar-desafio` |
| "Crie meu certificado de Java" | `gerar-certificado` |
| "Quais trilhas são de nível básico?" | `buscar-trilha-por-nivel` |

---

← [README.md](README.md) · [DOCUMENTACAO_COMPLETA.md](DOCUMENTACAO_COMPLETA.md) · [INDICE_VISUAL.md](INDICE_VISUAL.md)
