---
description: Gera 5 questões de múltipla escolha sobre a tecnologia e nível informados
argument-hint: <tecnologia> <nivel>
---

O usuário quer um teste com 5 questões sobre a tecnologia **$1** no nível **$2**.

Siga as regras abaixo para gerar as questões:

### Regras gerais
- **Tecnologia:** $1
- **Nível:** $2 (aceite variações como: básico/fácil/easy, intermediário/médio/medium, avançado/difícil/hard)
- Se o nível informado não for reconhecido, pergunte ao usuário qual nível deseja: Básico, Intermediário ou Avançado.
- Se a tecnologia não for reconhecida, informe que não há trilha para ela e sugira tecnologias do arquivo `dio_explorer/data/trilhas_dio.json`.
- Gere **exatamente 5 questões** de múltipla escolha, numeradas de 1 a 5.
- Cada questão deve ter **4 alternativas** (A, B, C, D), com apenas **uma correta**.
- As questões devem cobrir aspectos diferentes da tecnologia — não repita o mesmo tópico.
- O nível de dificuldade deve ser compatível com **$2**:
  - **Básico:** conceitos fundamentais, sintaxe, definições.
  - **Intermediário:** boas práticas, padrões de uso, comportamento esperado.
  - **Avançado:** otimização, edge cases, arquitetura, funcionamento interno.
- Ao final, exiba o gabarito em uma seção separada.

### Formato de saída obrigatório

```
# 📝 Teste — $1 · Nível $2

> 5 questões de múltipla escolha. Responda antes de conferir o gabarito!

---

**Questão 1 — <Tópico>**

<Enunciado claro e objetivo da questão>

A) <alternativa A>
B) <alternativa B>
C) <alternativa C>
D) <alternativa D>

---

**Questão 2 — <Tópico>**

<Enunciado>

A) <alternativa A>
B) <alternativa B>
C) <alternativa C>
D) <alternativa D>

---

**Questão 3 — <Tópico>**

<Enunciado>

A) <alternativa A>
B) <alternativa B>
C) <alternativa C>
D) <alternativa D>

---

**Questão 4 — <Tópico>**

<Enunciado>

A) <alternativa A>
B) <alternativa B>
C) <alternativa C>
D) <alternativa D>

---

**Questão 5 — <Tópico>**

<Enunciado>

A) <alternativa A>
B) <alternativa B>
C) <alternativa C>
D) <alternativa D>

---

## ✅ Gabarito

| Questão | Resposta | Justificativa |
|---------|----------|---------------|
| 1 | <letra> | <explicação breve do porquê esta é a resposta correta> |
| 2 | <letra> | <explicação breve> |
| 3 | <letra> | <explicação breve> |
| 4 | <letra> | <explicação breve> |
| 5 | <letra> | <explicação breve> |

---

🏆 **Pontuação máxima:** 100 pontos (20 pontos por questão)
```

Responda sempre em **português brasileiro** e certifique-se de que todas as questões sejam tecnicamente corretas e adequadas ao nível informado.
