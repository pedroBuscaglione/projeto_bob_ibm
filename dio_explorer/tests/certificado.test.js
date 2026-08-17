'use strict';

const {
  formatarData,
  gerarIniciais,
  gerarCodigoCertificado,
  gerarCertificado,
  MESES,
} = require('../src/certificado');
const { buscarTrilhaPorTecnologia } = require('../src/trilha');

// ─── formatarData ────────────────────────────────────────────────────────────

describe('formatarData()', () => {
  test('deve formatar corretamente 01/01/2024', () => {
    expect(formatarData(new Date(2024, 0, 1))).toBe('01 de janeiro de 2024');
  });

  test('deve formatar corretamente 15/06/2025', () => {
    expect(formatarData(new Date(2025, 5, 15))).toBe('15 de junho de 2025');
  });

  test('deve formatar corretamente 31/12/2023', () => {
    expect(formatarData(new Date(2023, 11, 31))).toBe('31 de dezembro de 2023');
  });

  test('deve usar zero à esquerda para dias < 10', () => {
    expect(formatarData(new Date(2024, 2, 5))).toBe('05 de março de 2024');
  });

  test('MESES deve ter 12 elementos', () => {
    expect(MESES.length).toBe(12);
  });

  test('MESES[0] deve ser "janeiro"', () => {
    expect(MESES[0]).toBe('janeiro');
  });

  test('MESES[11] deve ser "dezembro"', () => {
    expect(MESES[11]).toBe('dezembro');
  });
});

// ─── gerarIniciais ───────────────────────────────────────────────────────────

describe('gerarIniciais()', () => {
  test('deve retornar "JD" para "João Dias"', () => {
    expect(gerarIniciais('João Dias')).toBe('JD');
  });

  test('deve retornar "MSO" para "Maria Silva Oliveira"', () => {
    expect(gerarIniciais('Maria Silva Oliveira')).toBe('MSO');
  });

  test('deve retornar "A" para nome único "Ana"', () => {
    expect(gerarIniciais('Ana')).toBe('A');
  });

  test('deve lidar com espaços extras', () => {
    expect(gerarIniciais('  Pedro  Alves  ')).toBe('PA');
  });
});

// ─── gerarCodigoCertificado ──────────────────────────────────────────────────

describe('gerarCodigoCertificado()', () => {
  let trilhaJava;

  beforeAll(() => {
    trilhaJava = buscarTrilhaPorTecnologia('java');
  });

  test('deve seguir o padrão DIO-XXX-IIAAAA', () => {
    const codigo = gerarCodigoCertificado(trilhaJava, 'João Dias', new Date(2025, 5, 15));
    expect(codigo).toMatch(/^DIO-\d{3}-[A-Z]+\d{4}$/);
  });

  test('deve ter id de Java com zeros à esquerda (DIO-007)', () => {
    const codigo = gerarCodigoCertificado(trilhaJava, 'Ana Lima', new Date(2025, 5, 1));
    expect(codigo).toContain('DIO-007');
  });

  test('deve conter as iniciais do usuário', () => {
    const codigo = gerarCodigoCertificado(trilhaJava, 'Carlos Mendes', new Date(2025, 5, 1));
    expect(codigo).toContain('CM');
  });

  test('deve conter o ano na parte final', () => {
    const codigo = gerarCodigoCertificado(trilhaJava, 'Ana Lima', new Date(2025, 5, 1));
    expect(codigo).toContain('2025');
  });
});

// ─── gerarCertificado — erros de entrada ─────────────────────────────────────

describe('gerarCertificado() — erros de entrada', () => {
  test('nome vazio → ok=false', () => {
    const r = gerarCertificado('', 'Java');
    expect(r.ok).toBe(false);
    expect(r.conteudo).toContain('inválido');
  });

  test('nome null → ok=false', () => {
    const r = gerarCertificado(null, 'Java');
    expect(r.ok).toBe(false);
  });

  test('trilha inexistente → ok=false', () => {
    const r = gerarCertificado('João', 'CobolAntigo');
    expect(r.ok).toBe(false);
    expect(r.conteudo).toContain('não encontrada');
  });

  test('deve listar tecnologias disponíveis quando trilha não encontrada', () => {
    const r = gerarCertificado('João', 'LinguagemFalsa');
    expect(r.ok).toBe(false);
    expect(r.conteudo).toContain('Java');
  });
});

// ─── gerarCertificado — Java ─────────────────────────────────────────────────

describe('gerarCertificado("Carlos Henrique", "Java")', () => {
  let resultado;
  const dataFixa = new Date(2025, 5, 18); // 18 de junho de 2025

  beforeAll(() => {
    resultado = gerarCertificado('Carlos Henrique', 'Java', dataFixa);
  });

  test('deve retornar ok=true', () => {
    expect(resultado.ok).toBe(true);
  });

  test('deve conter o nome do aluno', () => {
    expect(resultado.conteudo).toContain('Carlos Henrique');
  });

  test('deve conter o nome completo da trilha Java', () => {
    expect(resultado.conteudo).toContain('Formação Java Developer');
  });

  test('deve conter a tecnologia Java', () => {
    expect(resultado.conteudo).toContain('Java');
  });

  test('deve conter o nível Intermediário', () => {
    expect(resultado.conteudo).toContain('Intermediário');
  });

  test('deve conter o XP total (22000)', () => {
    expect(resultado.conteudo).toContain('22000');
  });

  test('deve conter os módulos (10 de 10)', () => {
    expect(resultado.conteudo).toContain('10 de 10');
  });

  test('deve conter as badges', () => {
    expect(resultado.conteudo).toContain('Java Foundations');
    expect(resultado.conteudo).toContain('Spring Boot Expert');
    expect(resultado.conteudo).toContain('Java Developer');
  });

  test('deve conter a data formatada (18 de junho de 2025)', () => {
    expect(resultado.conteudo).toContain('18 de junho de 2025');
  });

  test('deve conter o código do certificado com prefixo DIO-007', () => {
    expect(resultado.conteudo).toContain('DIO-007');
  });

  test('deve conter a assinatura da DIO', () => {
    expect(resultado.conteudo).toContain('Digital Innovation One');
  });

  test('deve conter link para dio.me', () => {
    expect(resultado.conteudo).toContain('dio.me');
  });

  test('deve conter o cabeçalho CERTIFICADO DE CONCLUSÃO', () => {
    expect(resultado.conteudo).toContain('CERTIFICADO DE CONCLUSÃO');
  });
});

// ─── gerarCertificado — Python ────────────────────────────────────────────────

describe('gerarCertificado("Ana Lima", "Python")', () => {
  test('deve retornar ok=true para Python', () => {
    const r = gerarCertificado('Ana Lima', 'Python');
    expect(r.ok).toBe(true);
  });

  test('deve conter "Ana Lima" no certificado', () => {
    const r = gerarCertificado('Ana Lima', 'Python');
    expect(r.conteudo).toContain('Ana Lima');
  });

  test('deve conter "Formação Python Developer"', () => {
    const r = gerarCertificado('Ana Lima', 'Python');
    expect(r.conteudo).toContain('Formação Python Developer');
  });
});
