#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, resolve, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ─── Caminho para o JSON de trilhas (relativo ao build/) ──────────────────
// build/ fica dentro de mcp/, e data/ fica em dio_explorer/
const DATA_PATH = resolve(__dirname, "../../data/trilhas_dio.json");

// ─── Tipos ────────────────────────────────────────────────────────────────
interface Live {
  titulo: string;
  duracao_min: number;
}

interface Trilha {
  id: number;
  nome: string;
  tecnologia: string;
  nivel: string;
  modulos: number;
  xp_total: number;
  badges: string[];
  lives_ao_vivo: Live[];
}

// ─── Utilitários ──────────────────────────────────────────────────────────
function carregarTrilhas(): Trilha[] {
  const raw = readFileSync(DATA_PATH, "utf-8");
  return (JSON.parse(raw) as { trilhas: Trilha[] }).trilhas;
}

const ALIASES: Record<string, string> = {
  aws: "amazon web services",
  gcp: "google cloud",
  js: "javascript",
  ts: "typescript",
  k8s: "devops",
};

function buscarTrilha(tecnologia: string): Trilha | null {
  const trilhas = carregarTrilhas();
  const raw = tecnologia.toLowerCase().trim();
  const termo = ALIASES[raw] ?? raw;

  return (
    trilhas.find((t) => t.tecnologia.toLowerCase() === termo) ??
    trilhas.find((t) => t.tecnologia.toLowerCase().startsWith(termo)) ??
    trilhas.find((t) => t.tecnologia.toLowerCase().includes(termo)) ??
    trilhas.find((t) => termo.includes(t.tecnologia.toLowerCase())) ??
    null
  );
}

function listarTecnologias(): string[] {
  return carregarTrilhas().map((t) => t.tecnologia);
}

const PREFIXOS_MODULOS = [
  "Introdução e Fundamentos",
  "Conceitos Essenciais",
  "Configuração do Ambiente",
  "Estruturas e Sintaxe",
  "Boas Práticas e Padrões",
  "Projetos Práticos",
  "Integração e APIs",
  "Testes e Qualidade",
  "Performance e Otimização",
  "Deploy e Produção",
  "Arquitetura Avançada",
  "Projeto Final",
];

function gerarModulos(trilha: Trilha): string {
  const count = Math.min(trilha.modulos, PREFIXOS_MODULOS.length);
  return Array.from(
    { length: count },
    (_, i) => `  Módulo ${i + 1} – ${PREFIXOS_MODULOS[i]}`
  ).join("\n");
}

// ─── Nível ────────────────────────────────────────────────────────────────
const NIVEL_MAP: Record<string, string> = {
  basico: "Básico",
  básico: "Básico",
  facil: "Básico",
  fácil: "Básico",
  easy: "Básico",
  intermediario: "Intermediário",
  intermediário: "Intermediário",
  medio: "Intermediário",
  médio: "Intermediário",
  medium: "Intermediário",
  avancado: "Avançado",
  avançado: "Avançado",
  dificil: "Avançado",
  difícil: "Avançado",
  hard: "Avançado",
};

const XP_MAP: Record<string, number> = {
  Básico: 500,
  Intermediário: 1500,
  Avançado: 3000,
};

const TEMPO_MAP: Record<string, number> = {
  Básico: 30,
  Intermediário: 60,
  Avançado: 90,
};

function normalizarNivel(nivel: string): string | null {
  const chave = nivel
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  for (const [key, val] of Object.entries(NIVEL_MAP)) {
    const keyNorm = key.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (keyNorm === chave) return val;
  }
  return null;
}

// ─── Desafios template ────────────────────────────────────────────────────
interface DesafioTemplate {
  titulo: string;
  descricao: string;
  entrada: string;
  saida: string;
  dicas: string[];
  criterio: string;
}

const DESAFIOS: Record<string, DesafioTemplate> = {
  Java: {
    titulo: "Calculadora de Salário Líquido",
    descricao:
      "Crie um programa Java que receba o salário bruto de um funcionário e calcule o salário líquido aplicando o desconto do INSS (7,5% até R$1.320 e 9% acima disso) e do IR simplificado (0% até R$2.824, 7,5% até R$3.751).",
    entrada: "Um valor decimal representando o salário bruto. Exemplo: 4500.00",
    saida:
      "Salário bruto, descontos e salário líquido formatados.\nExemplo:\nSalário Bruto: R$ 4500,00\nDesconto INSS: R$ 405,00\nDesconto IR: R$ 337,50\nSalário Líquido: R$ 3757,50",
    dicas: ["Use BigDecimal para operações financeiras", "Separe a lógica em métodos privados"],
    criterio: "Implemente usando POO com pelo menos uma classe de serviço",
  },
  Python: {
    titulo: "Analisador de Frequência de Palavras",
    descricao:
      "Escreva um script Python que leia um texto qualquer e retorne as 5 palavras mais frequentes, ignorando stopwords básicas (de, a, o, e, que, do, da).",
    entrada: 'Uma string de texto. Exemplo: "Python é uma linguagem e Python é poderosa"',
    saida: "Dicionário com as 5 palavras mais frequentes e suas contagens.\nExemplo: {'python': 2, 'linguagem': 1}",
    dicas: ["Use Counter do módulo collections", "Normalize para lowercase antes de contar"],
    criterio: "Use list comprehension para filtrar as stopwords",
  },
  JavaScript: {
    titulo: "Validador de CPF",
    descricao:
      "Implemente uma função JavaScript que valide um CPF brasileiro, verificando o dígito verificador conforme o algoritmo oficial.",
    entrada: 'Uma string com o CPF (com ou sem máscara). Exemplo: "123.456.789-09"',
    saida: "true ou false. Exemplo: false (CPF inválido)",
    dicas: ["Remova a máscara antes de validar", "Verifique CPFs com todos os dígitos iguais"],
    criterio: "Implemente como arrow function pura (sem efeitos colaterais)",
  },
};

// ─── Certificado helpers ──────────────────────────────────────────────────
const MESES = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];

function formatarData(date: Date): string {
  const d = date.getDate().toString().padStart(2, "0");
  const m = MESES[date.getMonth()];
  const a = date.getFullYear();
  return `${d} de ${m} de ${a}`;
}

function gerarIniciais(nome: string): string {
  return nome
    .trim()
    .split(/\s+/)
    .map((p) => p[0].toUpperCase())
    .join("");
}

// ─── MCP Server ───────────────────────────────────────────────────────────
const server = new McpServer({
  name: "dio-explorer-mcp",
  version: "1.0.0",
});

// ── Tool 1: listar-trilhas ────────────────────────────────────────────────
server.tool(
  "listar-trilhas",
  "Lista todas as trilhas de formação disponíveis na DIO com id, nome, tecnologia, nível e XP total.",
  {},
  async () => {
    try {
      const trilhas = carregarTrilhas();
      const linhas = trilhas.map(
        (t) =>
          `[${t.id}] ${t.nome} | ${t.tecnologia} | Nível: ${t.nivel} | XP: ${t.xp_total}`
      );
      return {
        content: [
          {
            type: "text",
            text: `# 📚 Trilhas DIO Disponíveis (${trilhas.length} trilhas)\n\n${linhas.join("\n")}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Erro ao carregar trilhas: ${String(error)}` }],
        isError: true,
      };
    }
  }
);

// ── Tool 2: ver-trilha ────────────────────────────────────────────────────
server.tool(
  "ver-trilha",
  "Exibe o plano de estudos completo de uma trilha DIO, incluindo módulos, lives ao vivo e badges.",
  {
    tecnologia: z.string().describe("Nome da tecnologia ou trilha. Ex: Python, React, AWS, Node.js"),
  },
  async ({ tecnologia }) => {
    try {
      const trilha = buscarTrilha(tecnologia);
      if (!trilha) {
        const disponiveis = listarTecnologias().join(", ");
        return {
          content: [
            {
              type: "text",
              text: `Trilha para "${tecnologia}" não encontrada.\n\nTecnologias disponíveis: ${disponiveis}`,
            },
          ],
          isError: true,
        };
      }

      const modulos = gerarModulos(trilha);
      const lives = trilha.lives_ao_vivo
        .map((l) => `- **${l.titulo}** — ⏱ ${l.duracao_min} min`)
        .join("\n");
      const badges = trilha.badges.map((b) => `🏷️ ${b}`).join("\n");

      const texto = `# 🎓 Trilha: ${trilha.nome}

**Tecnologia:** ${trilha.tecnologia}
**Nível:** ${trilha.nivel}
**Total de Módulos:** ${trilha.modulos}
**XP Total:** ${trilha.xp_total} XP

---

## 📚 Módulos da Trilha

${modulos}

---

## 🎥 Lives ao Vivo

${lives}

---

## 🏅 Badges que você vai conquistar

${badges}`;

      return { content: [{ type: "text", text: texto }] };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Erro ao buscar trilha: ${String(error)}` }],
        isError: true,
      };
    }
  }
);

// ── Tool 3: gerar-desafio ─────────────────────────────────────────────────
server.tool(
  "gerar-desafio",
  "Gera um desafio de código prático para uma tecnologia e nível específicos.",
  {
    tecnologia: z.string().describe("Tecnologia do desafio. Ex: Python, JavaScript, Java"),
    nivel: z
      .string()
      .describe("Nível de dificuldade: Básico, Intermediário ou Avançado (aceita variações em pt/en)"),
  },
  async ({ tecnologia, nivel }) => {
    try {
      const trilha = buscarTrilha(tecnologia);
      if (!trilha) {
        const disponiveis = listarTecnologias().join(", ");
        return {
          content: [
            {
              type: "text",
              text: `Tecnologia "${tecnologia}" não encontrada.\n\nDisponíveis: ${disponiveis}`,
            },
          ],
          isError: true,
        };
      }

      const nivelNorm = normalizarNivel(nivel);
      if (!nivelNorm) {
        return {
          content: [
            {
              type: "text",
              text: `Nível "${nivel}" não reconhecido. Use: Básico, Intermediário ou Avançado.`,
            },
          ],
          isError: true,
        };
      }

      const template: DesafioTemplate = DESAFIOS[trilha.tecnologia] ?? {
        titulo: `Desafio ${trilha.tecnologia}`,
        descricao: `Crie um projeto prático usando ${trilha.tecnologia} explorando os conceitos do nível ${nivelNorm}.`,
        entrada: "Parâmetros conforme definido no enunciado.",
        saida: "Saída formatada conforme especificação.",
        dicas: [
          `Consulte a documentação oficial de ${trilha.tecnologia}`,
          `Foque nos conceitos de nível ${nivelNorm}`,
        ],
        criterio: `O código deve seguir as boas práticas de ${trilha.tecnologia}`,
      };

      const xp = XP_MAP[nivelNorm];
      const tempo = TEMPO_MAP[nivelNorm];

      const texto = `# ⚡ Desafio ${trilha.tecnologia} — Nível ${nivelNorm}

## 📋 Descrição
${template.descricao}

## 📥 Entrada
${template.entrada}

## 📤 Saída esperada
${template.saida}

## 💡 Dicas
${template.dicas.map((d) => `- ${d}`).join("\n")}

## ✅ Critérios de Aceite
- [ ] O código deve produzir a saída esperada para o exemplo dado
- [ ] O código deve tratar ao menos um caso extremo (edge case)
- [ ] ${template.criterio}

## ⏱ Tempo sugerido
${tempo} minutos

## 🏆 XP ao concluir
${xp} XP`;

      return { content: [{ type: "text", text: texto }] };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Erro ao gerar desafio: ${String(error)}` }],
        isError: true,
      };
    }
  }
);

// ── Tool 4: gerar-certificado ─────────────────────────────────────────────
server.tool(
  "gerar-certificado",
  "Gera um certificado de conclusão em Markdown para um aluno que concluiu uma trilha DIO.",
  {
    nome_usuario: z.string().describe("Nome completo do aluno. Ex: João Silva"),
    trilha: z.string().describe("Tecnologia ou nome da trilha concluída. Ex: Python, React"),
  },
  async ({ nome_usuario, trilha: trilhaNome }) => {
    try {
      if (!nome_usuario.trim()) {
        return {
          content: [{ type: "text", text: "Nome do usuário não pode ser vazio." }],
          isError: true,
        };
      }

      const trilha = buscarTrilha(trilhaNome);
      if (!trilha) {
        const disponiveis = listarTecnologias().join(", ");
        return {
          content: [
            {
              type: "text",
              text: `Trilha "${trilhaNome}" não encontrada.\n\nDisponíveis: ${disponiveis}`,
            },
          ],
          isError: true,
        };
      }

      const hoje = new Date();
      const dataFormatada = formatarData(hoje);
      const id = String(trilha.id).padStart(3, "0");
      const iniciais = gerarIniciais(nome_usuario);
      const ano = hoje.getFullYear().toString();
      const codigo = `DIO-${id}-${iniciais}${ano}`;
      const badges = trilha.badges.join(" · ");

      const texto = `---

<div align="center">

# 🏆 CERTIFICADO DE CONCLUSÃO

### Digital Innovation One — Programa de Formação

---

## Este certificado é concedido a

# ${nome_usuario}

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

      return { content: [{ type: "text", text: texto }] };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Erro ao gerar certificado: ${String(error)}` }],
        isError: true,
      };
    }
  }
);

// ── Tool 5: buscar-trilha-por-nivel ───────────────────────────────────────
server.tool(
  "buscar-trilha-por-nivel",
  "Lista todas as trilhas DIO filtradas por nível: Básico, Intermediário ou Avançado.",
  {
    nivel: z
      .string()
      .describe("Nível desejado: Básico, Intermediário ou Avançado (aceita variações em pt/en)"),
  },
  async ({ nivel }) => {
    try {
      const nivelNorm = normalizarNivel(nivel);
      if (!nivelNorm) {
        return {
          content: [
            {
              type: "text",
              text: `Nível "${nivel}" não reconhecido. Use: Básico, Intermediário ou Avançado.`,
            },
          ],
          isError: true,
        };
      }

      const trilhas = carregarTrilhas().filter((t) => t.nivel === nivelNorm);
      if (trilhas.length === 0) {
        return {
          content: [{ type: "text", text: `Nenhuma trilha encontrada para o nível "${nivelNorm}".` }],
        };
      }

      const linhas = trilhas.map(
        (t) => `- **${t.nome}** (${t.tecnologia}) — ${t.modulos} módulos | ${t.xp_total} XP`
      );

      return {
        content: [
          {
            type: "text",
            text: `# 🎯 Trilhas de Nível ${nivelNorm} (${trilhas.length} encontradas)\n\n${linhas.join("\n")}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Erro ao filtrar trilhas: ${String(error)}` }],
        isError: true,
      };
    }
  }
);

// ─── Inicialização ────────────────────────────────────────────────────────
async function main(): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("dio-explorer-mcp running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
