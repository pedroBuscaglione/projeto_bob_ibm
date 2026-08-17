'use strict';

const {
  carregarTrilhas,
  buscarTrilhaPorTecnologia,
  listarTecnologias,
  gerarTitulosModulos,
  formatarPlanoEstudos,
} = require('../src/trilha');

// ─── carregarTrilhas ────────────────────────────────────────────────────────

describe('carregarTrilhas()', () => {
  test('deve retornar um array', () => {
    const trilhas = carregarTrilhas();
    expect(Array.isArray(trilhas)).toBe(true);
  });

  test('deve ter ao menos 30 trilhas carregadas', () => {
    const trilhas = carregarTrilhas();
    expect(trilhas.length).toBeGreaterThanOrEqual(30);
  });

  test('cada trilha deve possuir os campos obrigatórios', () => {
    const campos = ['id', 'nome', 'tecnologia', 'nivel', 'modulos', 'xp_total', 'badges', 'lives_ao_vivo'];
    const trilhas = carregarTrilhas();
    trilhas.forEach((t) => {
      campos.forEach((campo) => {
        expect(t).toHaveProperty(campo);
      });
    });
  });

  test('xp_total deve ser um número positivo', () => {
    carregarTrilhas().forEach((t) => {
      expect(typeof t.xp_total).toBe('number');
      expect(t.xp_total).toBeGreaterThan(0);
    });
  });

  test('badges deve ser um array não vazio', () => {
    carregarTrilhas().forEach((t) => {
      expect(Array.isArray(t.badges)).toBe(true);
      expect(t.badges.length).toBeGreaterThan(0);
    });
  });
});

// ─── buscarTrilhaPorTecnologia ───────────────────────────────────────────────

describe('buscarTrilhaPorTecnologia()', () => {
  test('deve encontrar "Java" com correspondência exata (case-insensitive)', () => {
    const t = buscarTrilhaPorTecnologia('java');
    expect(t).not.toBeNull();
    expect(t.tecnologia).toBe('Java');
  });

  test('deve encontrar "Java" com busca parcial em maiúsculas', () => {
    const t = buscarTrilhaPorTecnologia('JAVA');
    expect(t).not.toBeNull();
    expect(t.tecnologia).toBe('Java');
  });

  test('deve encontrar "Python" com termo parcial', () => {
    const t = buscarTrilhaPorTecnologia('python');
    expect(t).not.toBeNull();
    expect(t.tecnologia).toBe('Python');
  });

  test('deve encontrar "React" corretamente', () => {
    const t = buscarTrilhaPorTecnologia('React');
    expect(t).not.toBeNull();
    expect(t.tecnologia).toBe('React');
  });

  test('deve retornar null para tecnologia inexistente', () => {
    expect(buscarTrilhaPorTecnologia('CobolAncient')).toBeNull();
  });

  test('deve retornar null para string vazia', () => {
    expect(buscarTrilhaPorTecnologia('')).toBeNull();
  });

  test('deve retornar null para input nulo', () => {
    expect(buscarTrilhaPorTecnologia(null)).toBeNull();
  });

  test('deve retornar null para tipo inválido (número)', () => {
    expect(buscarTrilhaPorTecnologia(42)).toBeNull();
  });

  test('deve encontrar "AWS" pelo alias', () => {
    const t = buscarTrilhaPorTecnologia('AWS');
    expect(t).not.toBeNull();
    expect(t.tecnologia.toLowerCase()).toContain('amazon');
  });

  test('deve encontrar Node.js', () => {
    const t = buscarTrilhaPorTecnologia('node');
    expect(t).not.toBeNull();
    expect(t.tecnologia.toLowerCase()).toContain('node');
  });
});

// ─── listarTecnologias ───────────────────────────────────────────────────────

describe('listarTecnologias()', () => {
  test('deve retornar um array de strings', () => {
    const techs = listarTecnologias();
    expect(Array.isArray(techs)).toBe(true);
    techs.forEach((t) => expect(typeof t).toBe('string'));
  });

  test('deve incluir Java na lista', () => {
    expect(listarTecnologias()).toContain('Java');
  });

  test('deve incluir Python na lista', () => {
    expect(listarTecnologias()).toContain('Python');
  });

  test('deve incluir JavaScript na lista', () => {
    expect(listarTecnologias()).toContain('JavaScript');
  });

  test('quantidade de tecnologias deve igualar a de trilhas', () => {
    const trilhas = carregarTrilhas();
    const techs = listarTecnologias();
    expect(techs.length).toBe(trilhas.length);
  });
});

// ─── gerarTitulosModulos ─────────────────────────────────────────────────────

describe('gerarTitulosModulos()', () => {
  test('deve retornar o número correto de módulos para Java (10)', () => {
    const trilha = buscarTrilhaPorTecnologia('java');
    const titulos = gerarTitulosModulos(trilha);
    expect(titulos.length).toBe(trilha.modulos);
  });

  test('cada título deve começar com "Módulo"', () => {
    const trilha = buscarTrilhaPorTecnologia('java');
    gerarTitulosModulos(trilha).forEach((t) => {
      expect(t).toMatch(/^Módulo \d+/);
    });
  });

  test('deve retornar array com comprimento igual a modulos para Python', () => {
    const trilha = buscarTrilhaPorTecnologia('python');
    expect(gerarTitulosModulos(trilha).length).toBe(trilha.modulos);
  });

  test('títulos devem ser únicos', () => {
    const trilha = buscarTrilhaPorTecnologia('java');
    const titulos = gerarTitulosModulos(trilha);
    const unicos = new Set(titulos);
    expect(unicos.size).toBe(titulos.length);
  });
});

// ─── formatarPlanoEstudos ────────────────────────────────────────────────────

describe('formatarPlanoEstudos()', () => {
  let plano;
  let trilhaJava;

  beforeAll(() => {
    trilhaJava = buscarTrilhaPorTecnologia('java');
    plano = formatarPlanoEstudos(trilhaJava);
  });

  test('deve retornar uma string', () => {
    expect(typeof plano).toBe('string');
  });

  test('deve conter o nome da trilha', () => {
    expect(plano).toContain(trilhaJava.nome);
  });

  test('deve conter a tecnologia', () => {
    expect(plano).toContain(trilhaJava.tecnologia);
  });

  test('deve conter o nível', () => {
    expect(plano).toContain(trilhaJava.nivel);
  });

  test('deve conter o XP total', () => {
    expect(plano).toContain(trilhaJava.xp_total.toString());
  });

  test('deve conter as lives ao vivo', () => {
    trilhaJava.lives_ao_vivo.forEach((l) => {
      expect(plano).toContain(l.titulo);
    });
  });

  test('deve conter as badges', () => {
    trilhaJava.badges.forEach((b) => {
      expect(plano).toContain(b);
    });
  });

  test('deve conter a seção de Módulos da Trilha', () => {
    expect(plano).toContain('📚 Módulos da Trilha');
  });

  test('deve conter a seção de Lives ao Vivo', () => {
    expect(plano).toContain('🎥 Lives ao Vivo');
  });

  test('deve conter o número de módulos como texto', () => {
    expect(plano).toContain(`${trilhaJava.modulos}`);
  });
});
