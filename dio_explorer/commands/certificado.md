---
description: Gera um certificado fictício em Markdown para o usuário que concluiu uma trilha
argument-hint: <nome_do_usuario> <trilha_concluida>
---

O usuário quer gerar um certificado de conclusão para **$1** que concluiu a trilha de **$2**.

Consulte o arquivo `dio_explorer/data/trilhas_dio.json` para buscar a trilha correspondente a "$2" (correspondência case-insensitive e parcial no campo `tecnologia` ou `nome`).

Se a trilha não for encontrada, informe o usuário e liste as tecnologias disponíveis.

Se encontrada, gere um certificado fictício usando **exatamente** o formato abaixo — sem omitir nenhuma seção:

---

```markdown
---

<div align="center">

# 🏆 CERTIFICADO DE CONCLUSÃO

### Digital Innovation One — Programa de Formação

---

## Este certificado é concedido a

# $1

pela conclusão da

## <nome completo da trilha encontrada no JSON>

**Tecnologia:** <tecnologia>  
**Nível:** <nivel>  
**Módulos Concluídos:** <modulos> de <modulos>  
**XP Conquistado:** <xp_total> XP  

---

### 🏅 Badges Conquistadas

<liste cada badge do campo `badges` separado por ` · `>

---

**Data de Conclusão:** <data atual no formato DD de mês por extenso de AAAA>  
**Código do Certificado:** DIO-<id da trilha em 3 dígitos com zeros à esquerda>-<iniciais do nome do usuário em maiúsculas><últimos 4 dígitos do ano>

---

> *"O aprendizado contínuo é a chave para o sucesso na era digital."*  
> — Digital Innovation One

---

✅ **Certificado válido** | 🌐 [dio.me](https://dio.me) | 📧 contato@dio.me

</div>

---
```

Após exibir o certificado, adicione uma linha de parabenização calorosa e curta (1–2 frases) em **português brasileiro** celebrando a conquista de **$1**.
