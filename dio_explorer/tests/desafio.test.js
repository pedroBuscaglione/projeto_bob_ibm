'use strict';

const {
  normalizarNivel,
  gerarDesafio,
  XP_MAP,
  TEMPO_MAP,
  NIVEL_MAP,
} = require('../src/desafio');

// ─── normalizarNivel ─────────────────────────────────────────────────────────

describe('normalizarNivel()', () => {
  test('"basico" → Básico', () => expect(normalizarNivel('basico')).toBe('Básico'));
  test('"easy" → Básico', () => expect(normalizarNivel('easy')).toBe('Básico'));
  test('"facil" → Básico', () => expect(normalizarNivel('facil')).toBe('Básico'));
  test('"intermediario" → Intermediário', () => expect(normalizarNivel('intermediario')).toBe('Intermediário'));
  test('"medium" → Intermediário', () => expect(normalizarNivel('medium')).toBe('Intermediário'));
  test('"medio" → Intermediário', () => expect(normalizarNivel('medio')).toBe('Intermediário'));
  test('"avancado" → Avançado', () => expect(normalizarNivel('avancado')).toBe('Avançado'));
  test('"hard" → Avançado', () => expect(normalizarNivel('hard')).toBe('Avançado'));
  test('"dificil" → Avançado', () => expect(normalizarNivel('dificil')).toBe('Avançado'));

  test('deve ser case-insensitive: "BASICO" → Básico', () => {
    expect(normalizarNivel('BASICO')).toBe('Básico');
  });

  test('deve retornar null para nível desconhecido', () => {
    expect(normalizarNivel('ultra')).toBeNull();
  });

  test('deve retornar null para string vazia', () => {
    expect(normalizarNivel('')).toBeNull();
  });

  test('deve retornar null para null', () => {
    expect(normalizarNivel(null)).toBeNull();
  });

  test('deve retornar null para número', () => {
    expect(normalizarNivel(42)).toBeNull();
  });
});

// ─── constantes de mapa ──────────────────────────────────────────────────────

describe('XP_MAP e TEMPO_MAP', () => {
  test('XP de Básico deve ser 500', () => expect(XP_MAP['Básico']).toBe(500));
  test('XP de Intermediário deve ser 1500', () => expect(XP_MAP['Intermediário']).toBe(1500));
  test('XP de Avançado deve ser 3000', () => expect(XP_MAP['Avançado']).toBe(3000));

  test('Tempo de Básico deve ser 30 min', () => expect(TEMPO_MAP['Básico']).toBe(30));
  test('Tempo de Intermediário deve ser 60 min', () => expect(TEMPO_MAP['Intermediário']).toBe(60));
  test('Tempo de Avançado deve ser 90 min', () => expect(TEMPO_MAP['Avançado']).toBe(90));
});

// ─── gerarDesafio — casos de erro ─────────────────────────────────────────────

describe('gerarDesafio() — erros de entrada', () => {
  test('tecnologia inexistente → ok=false', () => {
    const r = gerarDesafio('Cobol1234', 'basico');
    expect(r.ok).toBe(false);
    expect(r.conteudo).toContain('não encontrada');
  });

  test('nível inválido → ok=false', () => {
    const r = gerarDesafio('Java', 'extremo');
    expect(r.ok).toBe(false);
    expect(r.conteudo).toContain('não reconhecido');
  });

  test('tecnologia vazia → ok=false', () => {
    const r = gerarDesafio('', 'basico');
    expect(r.ok).toBe(false);
  });

  test('nivel vazio → ok=false', () => {
    const r = gerarDesafio('Java', '');
    expect(r.ok).toBe(false);
  });
});

// ─── gerarDesafio — Java Intermediário ────────────────────────────────────────

describe('gerarDesafio("Java", "intermediario")', () => {
  let resultado;

  beforeAll(() => {
    resultado = gerarDesafio('Java', 'intermediario');
  });

  test('deve retornar ok=true', () => {
    expect(resultado.ok).toBe(true);
  });

  test('deve conter "Java" no conteúdo', () => {
    expect(resultado.conteudo).toContain('Java');
  });

  test('deve conter "Intermediário" no conteúdo', () => {
    expect(resultado.conteudo).toContain('Intermediário');
  });

  test('deve incluir seção de Descrição', () => {
    expect(resultado.conteudo).toContain('## 📋 Descrição');
  });

  test('deve incluir seção de Entrada', () => {
    expect(resultado.conteudo).toContain('## 📥 Entrada');
  });

  test('deve incluir seção de Saída esperada', () => {
    expect(resultado.conteudo).toContain('## 📤 Saída esperada');
  });

  test('deve incluir seção de Dicas', () => {
    expect(resultado.conteudo).toContain('## 💡 Dicas');
  });

  test('deve incluir seção de Critérios de Aceite', () => {
    expect(resultado.conteudo).toContain('## ✅ Critérios de Aceite');
  });

  test('deve incluir Tempo sugerido', () => {
    expect(resultado.conteudo).toContain('## ⏱ Tempo sugerido');
    expect(resultado.conteudo).toContain('60 minutos');
  });

  test('deve incluir XP de Intermediário (1500 XP)', () => {
    expect(resultado.conteudo).toContain('1500 XP');
  });
});

// ─── gerarDesafio — Java Básico ────────────────────────────────────────────

describe('gerarDesafio("Java", "easy")', () => {
  test('deve retornar ok=true com alias "easy"', () => {
    const r = gerarDesafio('Java', 'easy');
    expect(r.ok).toBe(true);
  });

  test('deve conter 500 XP para nível Básico', () => {
    const r = gerarDesafio('Java', 'easy');
    expect(r.conteudo).toContain('500 XP');
  });

  test('deve conter 30 minutos para nível Básico', () => {
    const r = gerarDesafio('Java', 'easy');
    expect(r.conteudo).toContain('30 minutos');
  });
});

// ─── gerarDesafio — Java Avançado ──────────────────────────────────────────

describe('gerarDesafio("Java", "avancado")', () => {
  test('deve retornar ok=true com nível avançado', () => {
    const r = gerarDesafio('Java', 'avancado');
    expect(r.ok).toBe(true);
  });

  test('deve conter 3000 XP para nível Avançado', () => {
    const r = gerarDesafio('Java', 'avancado');
    expect(r.conteudo).toContain('3000 XP');
  });
});

// ─── gerarDesafio — tecnologias sem template específico ───────────────────

describe('gerarDesafio() — tecnologia sem template dedicado (Node.js)', () => {
  test('deve retornar ok=true mesmo sem template específico', () => {
    const r = gerarDesafio('node', 'intermediario');
    expect(r.ok).toBe(true);
  });

  test('deve incluir a tecnologia no título', () => {
    const r = gerarDesafio('node', 'intermediario');
    expect(r.conteudo).toContain('Node.js');
  });
});
