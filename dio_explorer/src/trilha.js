'use strict';

const fs = require('fs');
const path = require('path');

/**
 * Carrega e retorna os dados brutos do JSON de trilhas.
 */
function carregarTrilhas() {
  const filePath = path.resolve(__dirname, '../data/trilhas_dio.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw).trilhas;
}

/**
 * Busca uma trilha pelo nome da tecnologia (case-insensitive, match parcial).
 * @param {string} tecnologia
 * @returns {object|null}
 */
/** Mapa de abreviações para correspondência auxiliar */
const ALIASES = {
  aws: 'amazon web services',
  gcp: 'google cloud',
  js: 'javascript',
  ts: 'typescript',
  k8s: 'devops',
};

function buscarTrilhaPorTecnologia(tecnologia) {
  if (!tecnologia || typeof tecnologia !== 'string') return null;
  const trilhas = carregarTrilhas();
  const raw = tecnologia.toLowerCase().trim();
  // Resolve alias before matching
  const termo = ALIASES[raw] || raw;

  // 1. Exact match (case-insensitive)
  const exato = trilhas.find((t) => t.tecnologia.toLowerCase() === termo);
  if (exato) return exato;

  // 2. Tecnologia starts with the search term
  const prefixo = trilhas.find((t) => t.tecnologia.toLowerCase().startsWith(termo));
  if (prefixo) return prefixo;

  // 3. Search term is contained inside the tecnologia field
  const parcial = trilhas.find((t) => t.tecnologia.toLowerCase().includes(termo));
  if (parcial) return parcial;

  // 4. Tecnologia is contained inside the search term (e.g. "node" inside "node.js")
  const inverso = trilhas.find((t) => termo.includes(t.tecnologia.toLowerCase()));
  return inverso || null;
}

/**
 * Lista todas as tecnologias disponíveis.
 * @returns {string[]}
 */
function listarTecnologias() {
  return carregarTrilhas().map((t) => t.tecnologia);
}

/**
 * Gera títulos progressivos de módulos baseados na trilha.
 * @param {object} trilha
 * @returns {string[]}
 */
function gerarTitulosModulos(trilha) {
  const prefixos = [
    'Introdução e Fundamentos',
    'Conceitos Essenciais',
    'Configuração do Ambiente',
    'Estruturas e Sintaxe',
    'Boas Práticas e Padrões',
    'Projetos Práticos',
    'Integração e APIs',
    'Testes e Qualidade',
    'Performance e Otimização',
    'Deploy e Produção',
    'Arquitetura Avançada',
    'Projeto Final',
  ];
  const count = Math.min(trilha.modulos, prefixos.length);
  return Array.from({ length: count }, (_, i) => `Módulo ${i + 1} – ${prefixos[i]}`);
}

/**
 * Formata o plano de estudos de uma trilha como texto Markdown.
 * @param {object} trilha
 * @returns {string}
 */
function formatarPlanoEstudos(trilha) {
  const modulos = gerarTitulosModulos(trilha);
  const linhasModulos = modulos.map((m) => `  ${m}`).join('\n');
  const linhasLives = trilha.lives_ao_vivo
    .map((l) => `- **${l.titulo}** — ⏱ ${l.duracao_min} min`)
    .join('\n');
  const linhasBadges = trilha.badges.map((b) => `🏷️ ${b}`).join('\n');

  return `# 🎓 Trilha: ${trilha.nome}

**Tecnologia:** ${trilha.tecnologia}
**Nível:** ${trilha.nivel}
**Total de Módulos:** ${trilha.modulos}
**XP Total:** ${trilha.xp_total} XP

---

## 📚 Módulos da Trilha

${linhasModulos}

---

## 🎥 Lives ao Vivo

${linhasLives}

---

## 🏅 Badges que você vai conquistar

${linhasBadges}
`;
}

module.exports = {
  carregarTrilhas,
  buscarTrilhaPorTecnologia,
  listarTecnologias,
  gerarTitulosModulos,
  formatarPlanoEstudos,
};
