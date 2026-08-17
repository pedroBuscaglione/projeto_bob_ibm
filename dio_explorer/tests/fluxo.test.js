'use strict';

/**
 * Testes de fluxo (integração) — simula a execução completa dos comandos
 * /trilha, /desafio e /certificado para o aluno "Carlos Henrique" com Java.
 */

const { buscarTrilhaPorTecnologia, formatarPlanoEstudos } = require('../src/trilha');
const { gerarDesafio } = require('../src/desafio');
const { gerarCertificado } = require('../src/certificado');

// ─── Fluxo /trilha Java ───────────────────────────────────────────────────────

describe('FLUXO /trilha Java', () => {
  let trilha;
  let plano;

  beforeAll(() => {
    trilha = buscarTrilhaPorTecnologia('Java');
    plano = formatarPlanoEstudos(trilha);
  });

  test('STEP 1 — trilha de Java deve ser encontrada', () => {
    expect(trilha).not.toBeNull();
    expect(trilha.tecnologia).toBe('Java');
  });

  test('STEP 2 — plano de estudos deve ser gerado com sucesso', () => {
    expect(typeof plano).toBe('string');
    expect(plano.length).toBeGreaterThan(100);
  });

  test('STEP 3 — plano deve conter o nome da formação', () => {
    expect(plano).toContain('Formação Java Developer');
  });

  test('STEP 4 — plano deve conter nível Intermediário', () => {
    expect(plano).toContain('Intermediário');
  });

  test('STEP 5 — plano deve conter 10 módulos', () => {
    expect(plano).toContain('10');
    expect(plano).toContain('Módulo 1');
    expect(plano).toContain('Módulo 10');
  });

  test('STEP 6 — plano deve conter 22000 XP', () => {
    expect(plano).toContain('22000');
  });

  test('STEP 7 — plano deve conter as 3 lives ao vivo de Java', () => {
    expect(plano).toContain('POO com Java na Prática');
    expect(plano).toContain('APIs REST com Spring Boot');
    expect(plano).toContain('Testes Unitários com JUnit e Mockito');
  });

  test('STEP 8 — plano deve conter as 3 badges de Java', () => {
    expect(plano).toContain('Java Foundations');
    expect(plano).toContain('Spring Boot Expert');
    expect(plano).toContain('Java Developer');
  });
});

// ─── Fluxo /desafio Java Intermediário ───────────────────────────────────────

describe('FLUXO /desafio Java intermediário', () => {
  let resultado;

  beforeAll(() => {
    resultado = gerarDesafio('Java', 'intermediario');
  });

  test('STEP 1 — desafio gerado com ok=true', () => {
    expect(resultado.ok).toBe(true);
  });

  test('STEP 2 — título deve mencionar Java e Intermediário', () => {
    expect(resultado.conteudo).toContain('Java');
    expect(resultado.conteudo).toContain('Intermediário');
  });

  test('STEP 3 — desafio deve possuir todas as seções obrigatórias', () => {
    const secoes = [
      '## 📋 Descrição',
      '## 📥 Entrada',
      '## 📤 Saída esperada',
      '## 💡 Dicas',
      '## ✅ Critérios de Aceite',
      '## ⏱ Tempo sugerido',
      '## 🏆 XP ao concluir',
    ];
    secoes.forEach((s) => expect(resultado.conteudo).toContain(s));
  });

  test('STEP 4 — XP deve ser 1500 para Intermediário', () => {
    expect(resultado.conteudo).toContain('1500 XP');
  });

  test('STEP 5 — tempo sugerido deve ser 60 minutos', () => {
    expect(resultado.conteudo).toContain('60 minutos');
  });

  test('STEP 6 — deve conter pelo menos um critério de aceite', () => {
    expect(resultado.conteudo).toMatch(/- \[ \]/);
  });

  test('STEP 7 — deve conter pelo menos uma dica (item de lista)', () => {
    expect(resultado.conteudo).toMatch(/^- .+/m);
  });
});

// ─── Fluxo /certificado Carlos Henrique Java ─────────────────────────────────

describe('FLUXO /certificado "Carlos Henrique" Java', () => {
  let resultado;
  const dataFixa = new Date(2025, 5, 18); // 18 de junho de 2025

  beforeAll(() => {
    resultado = gerarCertificado('Carlos Henrique', 'Java', dataFixa);
  });

  test('STEP 1 — certificado gerado com ok=true', () => {
    expect(resultado.ok).toBe(true);
  });

  test('STEP 2 — certificado deve conter o nome do aluno', () => {
    expect(resultado.conteudo).toContain('Carlos Henrique');
  });

  test('STEP 3 — certificado deve conter a trilha correta', () => {
    expect(resultado.conteudo).toContain('Formação Java Developer');
  });

  test('STEP 4 — certificado deve conter XP conquistado', () => {
    expect(resultado.conteudo).toContain('22000 XP');
  });

  test('STEP 5 — certificado deve conter todos os módulos concluídos', () => {
    expect(resultado.conteudo).toContain('10 de 10');
  });

  test('STEP 6 — certificado deve conter as badges conquistadas', () => {
    expect(resultado.conteudo).toContain('Java Foundations · Spring Boot Expert · Java Developer');
  });

  test('STEP 7 — certificado deve conter a data de conclusão correta', () => {
    expect(resultado.conteudo).toContain('18 de junho de 2025');
  });

  test('STEP 8 — certificado deve conter código único com DIO-007', () => {
    expect(resultado.conteudo).toContain('DIO-007');
    expect(resultado.conteudo).toContain('CH2025');
  });

  test('STEP 9 — certificado deve conter assinatura e link DIO', () => {
    expect(resultado.conteudo).toContain('Digital Innovation One');
    expect(resultado.conteudo).toContain('dio.me');
  });

  test('STEP 10 — certificado deve conter citação motivacional', () => {
    expect(resultado.conteudo).toContain('aprendizado contínuo');
  });
});

// ─── Fluxo de erro: tecnologia não encontrada ─────────────────────────────────

describe('FLUXO de erro — tecnologia inválida em todos os comandos', () => {
  test('/trilha com tecnologia inexistente → null', () => {
    const t = buscarTrilhaPorTecnologia('COBOL_ANCIENT_2099');
    expect(t).toBeNull();
  });

  test('/desafio com tecnologia inexistente → ok=false', () => {
    const r = gerarDesafio('COBOL_ANCIENT_2099', 'basico');
    expect(r.ok).toBe(false);
    expect(r.conteudo).toContain('não encontrada');
  });

  test('/certificado com trilha inexistente → ok=false', () => {
    const r = gerarCertificado('João', 'COBOL_ANCIENT_2099');
    expect(r.ok).toBe(false);
    expect(r.conteudo).toContain('não encontrada');
  });
});

// ─── Fluxo completo encadeado: trilha → desafio → certificado ─────────────────

describe('FLUXO COMPLETO — trilha → desafio → certificado para Java', () => {
  const ALUNO = 'Carlos Henrique';
  const TECNOLOGIA = 'Java';
  const DATA = new Date(2025, 5, 18);

  test('O aluno pode consultar a trilha, gerar desafio e receber certificado em sequência', () => {
    // 1. Consultar trilha
    const trilha = buscarTrilhaPorTecnologia(TECNOLOGIA);
    expect(trilha).not.toBeNull();

    // 2. Gerar o plano de estudos
    const plano = formatarPlanoEstudos(trilha);
    expect(plano).toContain(trilha.nome);

    // 3. Gerar desafio compatível com o nível da trilha
    const desafio = gerarDesafio(TECNOLOGIA, trilha.nivel);
    expect(desafio.ok).toBe(true);
    expect(desafio.conteudo).toContain(TECNOLOGIA);

    // 4. Gerar certificado de conclusão
    const certificado = gerarCertificado(ALUNO, TECNOLOGIA, DATA);
    expect(certificado.ok).toBe(true);
    expect(certificado.conteudo).toContain(ALUNO);
    expect(certificado.conteudo).toContain(trilha.nome);
  });
});
