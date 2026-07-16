export type Answers = Record<string, string>;

export interface ScoreBreakdown {
  label: string;
  points: number;
}

export interface ScoreResult {
  total: number;
  breakdown: ScoreBreakdown[];
  tier: "informativo" | "analise" | "prioritario";
  tierLabel: string;
  tierDescription: string;
}

export function computeScore(a: Answers): ScoreResult {
  const b: ScoreBreakdown[] = [];
  const add = (label: string, points: number) => {
    if (points > 0) b.push({ label, points });
  };

  // Perdas
  if (a.valor_perdido === "mais_100k") add("Perdas acima de R$ 100 mil", 30);
  else if (a.valor_perdido === "50k_100k") add("Perdas de R$ 50 mil a R$ 100 mil", 20);
  else if (a.valor_perdido === "20k_50k") add("Perdas de R$ 20 mil a R$ 50 mil", 10);

  // Ludopatia
  if (a.dificuldade_parar === "sim") add("Dificuldade em parar de apostar", 15);
  if (a.emprestimos === "sim") add("Uso de empréstimos ou crédito para apostar", 20);
  if (a.vendeu_bem === "sim") add("Venda de bens para apostar", 20);
  if (a.diagnostico === "sim") add("Diagnóstico de ludopatia", 30);
  if (a.laudo === "sim") add("Laudo médico disponível", 30);
  else if (a.laudo === "andamento") add("Laudo médico em andamento", 15);

  // Provas
  if (a.extratos === "sim") add("Extratos bancários completos", 15);
  else if (a.extratos === "parcialmente") add("Extratos bancários parciais", 8);
  if (a.pix === "sim") add("Comprovantes PIX", 10);
  if (a.prints === "sim") add("Prints da plataforma", 10);
  if (a.historico_apostas === "sim") add("Histórico das apostas", 15);

  // Marketing agressivo
  if (a.promocoes === "sim") {
    add("Recebimento de bônus e mensagens promocionais", 10);
    if (a.autoexclusao === "sim") add("Autoexclusão ignorada pela plataforma", 20);
    else add("Mensagens promocionais insistentes", 10);
  }

  const total = b.reduce((s, x) => s + x.points, 0);

  let tier: ScoreResult["tier"];
  let tierLabel: string;
  let tierDescription: string;

  if (total >= 71) {
    tier = "prioritario";
    tierLabel = "Encaminhamento prioritário";
    tierDescription =
      "Seu caso apresenta indícios fortes de responsabilidade civil da plataforma. Um advogado especializado entrará em contato em até 24 horas úteis para uma avaliação jurídica aprofundada.";
  } else if (total >= 31) {
    tier = "analise";
    tierLabel = "Análise inicial por especialista";
    tierDescription =
      "Seu caso reúne elementos relevantes que merecem uma análise mais detalhada. Nossa equipe fará contato para complementar informações antes da avaliação jurídica.";
  } else {
    tier = "informativo";
    tierLabel = "Orientação e conteúdo educativo";
    tierDescription =
      "Com base nas respostas, seu caso está no estágio inicial. Recomendamos que você consulte o material educativo sobre seus direitos e retorne assim que reunir mais documentação.";
  }

  return { total, breakdown: b, tier, tierLabel, tierDescription };
}
