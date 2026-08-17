'use strict';

const { buscarTrilhaPorTecnologia, listarTecnologias } = require('./trilha');

const MESES = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
];

/**
 * Formata uma data no padrão "DD de mês por extenso de AAAA".
 * @param {Date} date
 * @returns {string}
 */
function formatarData(date) {
  const d = date.getDate().toString().padStart(2, '0');
  const m = MESES[date.getMonth()];
  const a = date.getFullYear();
  return `${d} de ${m} de ${a}`;
}

/**
 * Gera as iniciais em maiúsculas a partir de um nome completo.
 * @param {string} nome
 * @returns {string}
 */
function gerarIniciais(nome) {
  return nome
    .trim()
    .split(/\s+/)
    .map((p) => p[0].toUpperCase())
    .join('');
}

/**
 * Gera o código único do certificado.
 * @param {object} trilha
 * @param {string} nomeUsuario
 * @param {Date} date
 * @returns {string}
 */
function gerarCodigoCertificado(trilha, nomeUsuario, date) {
  const id = String(trilha.id).padStart(3, '0');
  const iniciais = gerarIniciais(nomeUsuario);
  const ano = date.getFullYear().toString().slice(-4);
  return `DIO-${id}-${iniciais}${ano}`;
}

/**
 * Gera o certificado de conclusão em Markdown para um aluno.
 * @param {string} nomeUsuario
 * @param {string} trilhaNome - tecnologia ou nome da trilha
 * @param {Date} [date] - data de conclusão (padrão: hoje)
 * @returns {{ ok: boolean, conteudo: string }}
 */
function gerarCertificado(nomeUsuario, trilhaNome, date = new Date()) {
  if (!nomeUsuario || typeof nomeUsuario !== 'string' || nomeUsuario.trim() === '') {
    return { ok: false, conteudo: 'Nome do usuário inválido.' };
  }

  const trilha = buscarTrilhaPorTecnologia(trilhaNome);
  if (!trilha) {
    const techs = listarTecnologias().join(', ');
    return {
      ok: false,
      conteudo: `Trilha "${trilhaNome}" não encontrada. Disponíveis: ${techs}`,
    };
  }

  const dataFormatada = formatarData(date);
  const codigo = gerarCodigoCertificado(trilha, nomeUsuario, date);
  const badges = trilha.badges.join(' · ');

  const conteudo = `---

<div align="center">

# 🏆 CERTIFICADO DE CONCLUSÃO

### Digital Innovation One — Programa de Formação

---

## Este certificado é concedido a

# ${nomeUsuario}

pela conclusão da

## ${trilha.nome}

**Tecnologia:** ${trilha.tecnologia}  
**Nível:** ${trilha.nivel}  
**Módulos Concluídos:** ${trilha.modulos} de ${trilha.modulos}  
**XP Conquistado:** ${trilha.xp_total} XP  

---

### 🏅 Badges Conquistadas

${badges}

---

**Data de Conclusão:** ${dataFormatada}  
**Código do Certificado:** ${codigo}

---

> *"O aprendizado contínuo é a chave para o sucesso na era digital."*  
> — Digital Innovation One

---

✅ **Certificado válido** | 🌐 [dio.me](https://dio.me) | 📧 contato@dio.me

</div>

---`;

  return { ok: true, conteudo };
}

module.exports = {
  formatarData,
  gerarIniciais,
  gerarCodigoCertificado,
  gerarCertificado,
  MESES,
};
