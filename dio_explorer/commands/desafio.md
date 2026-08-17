---
description: Gera um desafio de código aleatório para a tecnologia e nível informados
argument-hint: <tecnologia> <nivel>
---

O usuário quer um desafio de código para a tecnologia **$1** no nível **$2**.

Siga as regras abaixo para gerar o desafio:

### Regras gerais
- **Tecnologia:** $1
- **Nível:** $2 (aceite variações como: básico/fácil/easy, intermediário/médio/medium, avançado/difícil/hard)
- Se o nível informado não for reconhecido, pergunte ao usuário qual nível deseja: Básico, Intermediário ou Avançado.
- Se a tecnologia não for reconhecida, informe que não há trilha para ela e sugira tecnologias do arquivo `dio_explorer/data/trilhas_dio.json`.
- O desafio deve ser **prático e funcional** — algo que o usuário possa resolver escrevendo código real.
- Varie o tipo de desafio a cada chamada: pode ser algoritmo, manipulação de dados, mini-projeto, função utilitária, refatoração, etc.

### Formato de saída obrigatório

```
# ⚡ Desafio $1 — Nível $2

## 📋 Descrição
<Enunciado claro do desafio em 3 a 6 linhas. Explique o problema a ser resolvido.>

## 📥 Entrada
<Descreva o formato de entrada esperado pelo programa/função, com exemplo.>

## 📤 Saída esperada
<Descreva o formato de saída, com exemplo.>

## 💡 Dicas
- <Dica 1 relevante para a tecnologia>
- <Dica 2 relevante para o nível>

## ✅ Critérios de Aceite
- [ ] O código deve produzir a saída esperada para o exemplo dado
- [ ] O código deve tratar ao menos um caso extremo (edge case)
- [ ] <Critério específico da tecnologia, ex.: "Use list comprehension em Python", "Implemente como arrow function em JS">

## ⏱ Tempo sugerido
<X> minutos

## 🏆 XP ao concluir
<valor entre 500 e 3000, proporcional ao nível> XP
```

Responda sempre em **português brasileiro** e certifique-se de que o desafio seja tecnicamente correto e resolúvel.
