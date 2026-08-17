'use strict';

const { buscarTrilhaPorTecnologia, listarTecnologias } = require('./trilha');

/** Mapeamento de alias de nível para forma canônica */
const NIVEL_MAP = {
  basico: 'Básico',
  básico: 'Básico',
  facil: 'Básico',
  fácil: 'Básico',
  easy: 'Básico',
  intermediario: 'Intermediário',
  intermediário: 'Intermediário',
  medio: 'Intermediário',
  médio: 'Intermediário',
  medium: 'Intermediário',
  avancado: 'Avançado',
  avançado: 'Avançado',
  dificil: 'Avançado',
  difícil: 'Avançado',
  hard: 'Avançado',
};

/** XP por nível */
const XP_MAP = {
  'Básico': 500,
  'Intermediário': 1500,
  'Avançado': 3000,
};

/** Tempo sugerido por nível (minutos) */
const TEMPO_MAP = {
  'Básico': 30,
  'Intermediário': 60,
  'Avançado': 90,
};

/**
 * Normaliza o nível informado pelo usuário para a forma canônica.
 * @param {string} nivel
 * @returns {string|null}
 */
function normalizarNivel(nivel) {
  if (!nivel || typeof nivel !== 'string') return null;
  const chave = nivel.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  // tenta match exato no mapa após remover acentos
  for (const [key, val] of Object.entries(NIVEL_MAP)) {
    const keyNorm = key.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (keyNorm === chave) return val;
  }
  return null;
}

/**
 * Modelos de desafio por tecnologia.
 */
const DESAFIOS = {
  Java: {
    titulo: 'Calculadora de Salário Líquido',
    descricao:
      'Crie um programa Java que receba o salário bruto de um funcionário e calcule o salário líquido aplicando o desconto do INSS (7,5% até R$1.320 e 9% acima disso) e do IR simplificado (0% até R$2.824, 7,5% até R$3.751).',
    entrada: 'Um valor decimal representando o salário bruto. Exemplo: 4500.00',
    saida: 'Salário bruto, descontos e salário líquido formatados. Exemplo:\nSalário Bruto: R$ 4500,00\nDesconto INSS: R$ 405,00\nDesconto IR: R$ 337,50\nSalário Líquido: R$ 3757,50',
    dicas: ['Use BigDecimal para operações financeiras', 'Separe a lógica em métodos privados'],
    criterio: 'Implemente usando POO com pelo menos uma classe de serviço',
  },
  Python: {
    titulo: 'Analisador de Frequência de Palavras',
    descricao:
      'Escreva um script Python que leia um texto qualquer e retorne as 5 palavras mais frequentes, ignorando stopwords básicas (de, a, o, e, que, do, da).',
    entrada: 'Uma string de texto. Exemplo: "Python é uma linguagem e Python é poderosa"',
    saida: "Dicionário com as 5 palavras mais frequentes e suas contagens. Exemplo: {'python': 2, 'linguagem': 1}",
    dicas: ['Use Counter do módulo collections', 'Normalize para lowercase antes de contar'],
    criterio: 'Use list comprehension para filtrar as stopwords',
  },
  JavaScript: {
    titulo: 'Validador de CPF',
    descricao:
      'Implemente uma função JavaScript que valide um CPF brasileiro, verificando o dígito verificador conforme o algoritmo oficial.',
    entrada: 'Uma string com o CPF (com ou sem máscara). Exemplo: "123.456.789-09"',
    saida: 'true ou false. Exemplo: false (CPF inválido)',
    dicas: ['Remova a máscara antes de validar', 'Verifique CPFs com todos os dígitos iguais'],
    criterio: 'Implemente como arrow function pura (sem efeitos colaterais)',
  },
};

/**
 * Gera um desafio para a tecnologia e nível informados.
 * @param {string} tecnologia
 * @param {string} nivel
 * @returns {{ ok: boolean, conteudo: string }}
 */
function gerarDesafio(tecnologia, nivel) {
  const trilha = buscarTrilhaPorTecnologia(tecnologia);
  if (!trilha) {
    const techs = listarTecnologias().join(', ');
    return {
      ok: false,
      conteudo: `Tecnologia "${tecnologia}" não encontrada. Disponíveis: ${techs}`,
    };
  }

  const nivelNorm = normalizarNivel(nivel);
  if (!nivelNorm) {
    return {
      ok: false,
      conteudo: `Nível "${nivel}" não reconhecido. Use: Básico, Intermediário ou Avançado.`,
    };
  }

  const template = DESAFIOS[trilha.tecnologia] || {
    titulo: `Desafio ${trilha.tecnologia}`,
    descricao: `Crie um projeto prático usando ${trilha.tecnologia} explorando os conceitos do nível ${nivelNorm}.`,
    entrada: 'Parâmetros conforme definido no enunciado.',
    saida: 'Saída formatada conforme especificação.',
    dicas: [`Consulte a documentação oficial de ${trilha.tecnologia}`, `Foque nos conceitos de nível ${nivelNorm}`],
    criterio: `O código deve seguir as boas práticas de ${trilha.tecnologia}`,
  };

  const xp = XP_MAP[nivelNorm];
  const tempo = TEMPO_MAP[nivelNorm];

  const conteudo = `# ⚡ Desafio ${trilha.tecnologia} — Nível ${nivelNorm}

## 📋 Descrição
${template.descricao}

## 📥 Entrada
${template.entrada}

## 📤 Saída esperada
${template.saida}

## 💡 Dicas
${template.dicas.map((d) => `- ${d}`).join('\n')}

## ✅ Critérios de Aceite
- [ ] O código deve produzir a saída esperada para o exemplo dado
- [ ] O código deve tratar ao menos um caso extremo (edge case)
- [ ] ${template.criterio}

## ⏱ Tempo sugerido
${tempo} minutos

## 🏆 XP ao concluir
${xp} XP`;

  return { ok: true, conteudo };
}

module.exports = {
  normalizarNivel,
  gerarDesafio,
  NIVEL_MAP,
  XP_MAP,
  TEMPO_MAP,
};
