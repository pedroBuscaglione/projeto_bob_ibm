---
description: Exibe o plano de estudos formatado de uma trilha da DIO
argument-hint: <tecnologia>
---

O usuário quer ver o plano de estudos da trilha de **$1**.

Consulte o arquivo `dio_explorer/data/trilhas_dio.json` e siga os passos abaixo:

1. Busque na lista `trilhas` a entrada cujo campo `tecnologia` corresponda (de forma case-insensitive e parcial) a "$1".
2. Se não encontrar nenhuma correspondência, liste todas as tecnologias disponíveis no JSON e peça ao usuário para escolher uma.
3. Se encontrar, formate e exiba o plano de estudos com a estrutura abaixo — **não invente dados**, use somente o que estiver no JSON.

---

## Estrutura de saída esperada

```
# 🎓 Trilha: <nome>

**Tecnologia:** <tecnologia>
**Nível:** <nivel>
**Total de Módulos:** <modulos>
**XP Total:** <xp_total> XP

---

## 📚 Módulos da Trilha

Numere cada módulo de 1 até <modulos> com um título descritivo gerado a partir do nome da trilha e do nível (ex.: "Módulo 1 – Introdução e Fundamentos", "Módulo 2 – Conceitos Essenciais", etc.). Crie títulos coerentes e progressivos — do básico ao avançado — de acordo com a tecnologia.

---

## 🎥 Lives ao Vivo

Liste cada item de `lives_ao_vivo` no formato:
- **<titulo>** — ⏱ <duracao_min> min

---

## 🏅 Badges que você vai conquistar

Liste cada badge do campo `badges` com o emoji 🏷️ na frente.

---

## 🚀 Próximos passos

Sugira brevemente (2–3 frases) o que o aluno pode fazer após concluir esta trilha, baseando-se na tecnologia e no nível.
```

Responda sempre em **português brasileiro**.
