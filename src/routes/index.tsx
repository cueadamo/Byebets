import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { computeScore, type Answers } from "@/lib/scoring";
import { submitQuizFn } from "@/lib/send-email.server";

export const Route = createFileRoute("/")({
  component: QuizPage,
});

interface Option {
  value: string;
  label: string;
}

interface Question {
  id: string;
  label: string;
  type: "radio" | "text";
  options?: Option[];
  placeholder?: string;
  optional?: boolean;
}

interface Step {
  eyebrow: string;
  title: string;
  description?: string;
  questions: Question[];
}

const STEPS: Step[] = [
  {
    eyebrow: "Etapa 1 de 7",
    title: "Identificação do problema",
    description:
      "Vamos começar entendendo o contexto das suas perdas com apostas online ou cassino.",
    questions: [
      {
        id: "perdeu_dinheiro",
        label: "Você perdeu dinheiro em apostas online ou cassino?",
        type: "radio",
        options: [
          { value: "sim", label: "Sim" },
          { value: "nao", label: "Não" },
        ],
      },
      {
        id: "plataforma",
        label: "Em qual plataforma?",
        type: "text",
        placeholder: "Ex.: Bet365, Betano, Blaze, Sportingbet…",
      },
      {
        id: "valor_perdido",
        label: "Aproximadamente quanto perdeu?",
        type: "radio",
        options: [
          { value: "ate_5k", label: "Até R$ 5.000" },
          { value: "5k_20k", label: "R$ 5.000 a R$ 20.000" },
          { value: "20k_50k", label: "R$ 20.000 a R$ 50.000" },
          { value: "50k_100k", label: "R$ 50.000 a R$ 100.000" },
          { value: "mais_100k", label: "Mais de R$ 100.000" },
        ],
      },
      {
        id: "tempo_perda",
        label: "Em quanto tempo ocorreu essa perda?",
        type: "radio",
        options: [
          { value: "menos_30d", label: "Menos de 30 dias" },
          { value: "1_6m", label: "1 a 6 meses" },
          { value: "6m_1a", label: "6 meses a 1 ano" },
          { value: "mais_1a", label: "Mais de 1 ano" },
        ],
      },
    ],
  },
  {
    eyebrow: "Etapa 2 de 7",
    title: "Indícios de ludopatia",
    description:
      "Esta parte é essencial para o encaminhamento adequado e não substitui avaliação clínica.",
    questions: [
      {
        id: "dificuldade_parar",
        label: "Você sentia dificuldade em parar de apostar?",
        type: "radio",
        options: [
          { value: "sim", label: "Sim" },
          { value: "nao", label: "Não" },
        ],
      },
      {
        id: "apostava_sem_querer",
        label: "Você apostava mesmo quando não queria?",
        type: "radio",
        options: [
          { value: "frequentemente", label: "Frequentemente" },
          { value: "as_vezes", label: "Às vezes" },
          { value: "nunca", label: "Nunca" },
        ],
      },
      {
        id: "emprestimos",
        label: "Já utilizou empréstimos ou cartão de crédito para continuar apostando?",
        type: "radio",
        options: [
          { value: "sim", label: "Sim" },
          { value: "nao", label: "Não" },
        ],
      },
      {
        id: "vendeu_bem",
        label: "Já vendeu algum bem para apostar?",
        type: "radio",
        options: [
          { value: "sim", label: "Sim" },
          { value: "nao", label: "Não" },
        ],
      },
      {
        id: "vida_financeira",
        label: "Sua vida financeira foi prejudicada pelas apostas?",
        type: "radio",
        options: [
          { value: "muito", label: "Muito" },
          { value: "um_pouco", label: "Um pouco" },
          { value: "nao", label: "Não" },
        ],
      },
      {
        id: "relacionamento",
        label: "Seu relacionamento familiar foi afetado?",
        type: "radio",
        options: [
          { value: "sim", label: "Sim" },
          { value: "nao", label: "Não" },
        ],
      },
    ],
  },
  {
    eyebrow: "Etapa 3 de 7",
    title: "Histórico médico",
    questions: [
      {
        id: "diagnostico",
        label: "Você já recebeu diagnóstico de ludopatia ou jogo patológico?",
        type: "radio",
        options: [
          { value: "sim", label: "Sim" },
          { value: "nao", label: "Não" },
        ],
      },
      {
        id: "tratamento",
        label: "Já fez tratamento psicológico ou psiquiátrico?",
        type: "radio",
        options: [
          { value: "sim", label: "Sim" },
          { value: "nao", label: "Não" },
        ],
      },
      {
        id: "laudo",
        label: "Possui laudo ou relatório médico?",
        type: "radio",
        options: [
          { value: "sim", label: "Sim" },
          { value: "andamento", label: "Em andamento" },
          { value: "nao", label: "Não" },
        ],
      },
    ],
  },
  {
    eyebrow: "Etapa 4 de 7",
    title: "Provas e documentação",
    description: "Quanto mais documentos, mais forte é o caso.",
    questions: [
      {
        id: "extratos",
        label: "Você possui extratos bancários mostrando os depósitos?",
        type: "radio",
        options: [
          { value: "sim", label: "Sim" },
          { value: "parcialmente", label: "Parcialmente" },
          { value: "nao", label: "Não" },
        ],
      },
      {
        id: "historico_apostas",
        label: "Possui histórico das apostas?",
        type: "radio",
        options: [
          { value: "sim", label: "Sim" },
          { value: "nao", label: "Não" },
        ],
      },
      {
        id: "pix",
        label: "Possui comprovantes PIX?",
        type: "radio",
        options: [
          { value: "sim", label: "Sim" },
          { value: "nao", label: "Não" },
        ],
      },
      {
        id: "prints",
        label: "Possui prints da plataforma?",
        type: "radio",
        options: [
          { value: "sim", label: "Sim" },
          { value: "nao", label: "Não" },
        ],
      },
    ],
  },
  {
    eyebrow: "Etapa 5 de 7",
    title: "Situação atual",
    questions: [
      {
        id: "conta_ativa",
        label: "Ainda possui conta ativa na plataforma?",
        type: "radio",
        options: [
          { value: "sim", label: "Sim" },
          { value: "nao", label: "Não" },
        ],
      },
      {
        id: "autoexclusao",
        label: "Já solicitou autoexclusão?",
        type: "radio",
        options: [
          { value: "sim", label: "Sim" },
          { value: "nao", label: "Não" },
        ],
      },
      {
        id: "promocoes",
        label: "A plataforma continuou enviando promoções após você pedir para parar?",
        type: "radio",
        options: [
          { value: "sim", label: "Sim" },
          { value: "nao", label: "Não" },
          { value: "nao_sei", label: "Não sei" },
        ],
      },
    ],
  },
  {
    eyebrow: "Etapa 6 de 7",
    title: "Seu objetivo",
    questions: [
      {
        id: "objetivo",
        label: "O que você procura?",
        type: "radio",
        options: [
          { value: "recuperar", label: "Recuperar parte dos valores" },
          { value: "entender", label: "Entender meus direitos" },
          { value: "avaliacao", label: "Avaliação jurídica" },
          { value: "psicologica", label: "Ajuda psicológica" },
          { value: "ambos", label: "Ambos" },
        ],
      },
    ],
  },
  {
    eyebrow: "Etapa 7 de 7",
    title: "Contato",
    description:
      "Preencha seus dados para receber a análise personalizada do seu caso.",
    questions: [
      { id: "nome", label: "Nome completo", type: "text", placeholder: "Seu nome" },
      { id: "telefone", label: "Telefone", type: "text", placeholder: "(11) 99999-9999" },
      { id: "whatsapp", label: "WhatsApp", type: "text", placeholder: "(11) 99999-9999" },
      { id: "cidade", label: "Cidade", type: "text", placeholder: "Sua cidade" },
      { id: "estado", label: "Estado", type: "text", placeholder: "UF" },
      { id: "email", label: "E-mail", type: "text", placeholder: "voce@email.com" },
    ],
  },
];

function QuizPage() {
  const [started, setStarted] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const step = STEPS[stepIndex];
  const totalSteps = STEPS.length;
  const progress = ((stepIndex + (submitted ? 1 : 0)) / totalSteps) * 100;

  const canAdvance = useMemo(() => {
    if (!step) return false;
    return step.questions.every((q) => {
      if (q.optional) return true;
      const v = answers[q.id];
      return typeof v === "string" && v.trim().length > 0;
    });
  }, [step, answers]);

  const setAnswer = (id: string, value: string) =>
    setAnswers((prev) => ({ ...prev, [id]: value }));

  const goNext = async () => {
    if (!canAdvance || submitting) return;
    if (stepIndex < totalSteps - 1) {
      setStepIndex((i) => i + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setSubmitting(true);
      setSubmitError(null);
      try {
        const score = computeScore(answers);
        const res = await submitQuizFn({
          data: { answers, score: score.total, tier: score.tier },
        });
        if (res && !res.ok) {
          throw new Error(res.error || "Erro no envio do e-mail");
        }
      } catch (err) {
        console.error("Erro ao enviar:", err);
        setSubmitError(err instanceof Error ? err.message : "Não foi possível enviar. Tente novamente.");
        setSubmitting(false);
        return;
      }
      setSubmitting(false);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goBack = () => {
    if (stepIndex > 0) {
      setStepIndex((i) => i - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-line bg-[rgba(255,255,255,0.92)] backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <a href="/" className="flex items-center no-underline">
            <img
              src="/logo.png"
              alt="ByeBets — Escolhas hoje. Liberdade sempre."
              className="h-14 w-auto"
            />
          </a>
          <div className="hidden text-xs font-semibold uppercase tracking-wider text-ink-soft sm:flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-electric" />
            Sigilo garantido · LGPD (Lei nº 13.709/2018)
          </div>
        </div>
      </header>

      {!started ? (
        <Landing onStart={() => setStarted(true)} />
      ) : submitted ? (
        <ThankYou answers={answers} />
      ) : (
        <main className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
          <div className="mb-8">
            <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-wider">
              <span className="text-blue-electric">{step.eyebrow}</span>
              <span className="text-ink-faint">
                {Math.round(progress)}% concluído
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-tint-deep">
              <div
                className="h-full rounded-full bg-gradient-to-r from-navy-900 to-blue-electric transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="rounded-[22px] border border-line bg-white p-7 shadow-[0_28px_64px_-24px_rgba(16,43,76,0.18)] sm:p-10">
            <h1 className="font-serifDisplay text-3xl font-semibold text-ink sm:text-[38px]">
              {step.title}
            </h1>
            {step.description && (
              <p className="mt-3 text-[15.5px] text-ink-soft">{step.description}</p>
            )}

            <div className="mt-8 space-y-8">
              {step.questions.map((q) => (
                <QuestionField
                  key={q.id}
                  question={q}
                  value={answers[q.id] ?? ""}
                  onChange={(v) => setAnswer(q.id, v)}
                />
              ))}
            </div>

            {submitError && (
              <p className="mt-4 text-center text-sm font-medium text-destructive">
                {submitError}
              </p>
            )}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
              <button
                onClick={goBack}
                disabled={stepIndex === 0 || submitting}
                className="rounded-full border-[1.5px] border-line bg-transparent px-6 py-3 text-sm font-semibold text-navy-900 transition-all hover:-translate-y-0.5 hover:border-navy-500 hover:bg-tint disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:border-line disabled:hover:bg-transparent"
              >
                ← Voltar
              </button>
              <button
                onClick={goNext}
                disabled={!canAdvance || submitting}
                className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-transparent bg-blue-electric px-7 py-3 text-sm font-semibold text-white shadow-[var(--shadow-blue)] transition-all hover:-translate-y-0.5 hover:bg-navy-700 hover:shadow-[var(--shadow-elevated)] disabled:cursor-not-allowed disabled:bg-ink-faint disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {submitting ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Enviando...
                  </>
                ) : stepIndex === totalSteps - 1 ? "Enviar avaliação" : "Continuar →"}
              </button>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-ink-faint">
            Suas respostas são confidenciais e usadas exclusivamente para avaliar seu caso.
          </p>
        </main>
      )}

      <footer className="border-t border-line bg-tint px-6 py-10">
        <div className="mx-auto max-w-6xl text-[13px] leading-relaxed text-ink-soft">
          <strong className="font-semibold text-ink">Aviso legal:</strong> Este
          formulário não substitui consulta médica ou avaliação clínica. A responsabilidade
          civil das plataformas de apostas é analisada caso a caso à luz do CDC, do Código
          Civil e da Lei nº 14.790/2023. Sigilo profissional preservado.
        </div>
      </footer>
    </div>
  );
}

function QuestionField({
  question,
  value,
  onChange,
}: {
  question: Question;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block font-serifDisplay text-[19px] font-semibold text-ink">
        {question.label}
      </label>

      {question.type === "text" ? (
        <input
          type="text"
          value={value}
          placeholder={question.placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="mt-3 w-full rounded-[8px] border-[1.5px] border-line bg-tint px-4 py-3 text-[15px] text-ink transition-colors focus:border-navy-500 focus:bg-white focus:outline-none"
        />
      ) : (
        <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
          {question.options?.map((opt) => {
            const selected = value === opt.value;
            return (
              <button
                type="button"
                key={opt.value}
                onClick={() => onChange(opt.value)}
                className={`group relative flex items-center gap-3 rounded-[10px] border-[1.5px] px-4 py-3.5 text-left text-[15px] font-medium transition-all ${
                  selected
                    ? "border-navy-900 bg-navy-900 text-white shadow-[var(--shadow-elevated)]"
                    : "border-line bg-white text-ink hover:border-navy-500 hover:bg-tint"
                }`}
              >
                <span
                  className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 ${
                    selected ? "border-gold bg-gold" : "border-line bg-white"
                  }`}
                >
                  {selected && (
                    <span className="h-2 w-2 rounded-full bg-navy-950" />
                  )}
                </span>
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Landing({ onStart }: { onStart: () => void }) {
  return (
    <main>
      <section className="relative overflow-hidden bg-gradient-to-b from-tint to-white pb-20 pt-16 sm:pt-24">
        {/* Decorative glow matching logo electric blue */}
        <div className="pointer-events-none absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-electric opacity-[0.06] blur-3xl" />
        <div className="mx-auto max-w-4xl px-6 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-tint-deep px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-navy-700">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-electric" />
            Avaliação gratuita e sigilosa
          </span>
          <h1 className="mt-6 font-serifDisplay text-[40px] font-semibold leading-[1.08] tracking-tight text-ink sm:text-[58px]">
            Você perdeu dinheiro em{" "}
            <em className="bg-gradient-to-b from-transparent from-[62%] to-tint-deep to-[62%] font-normal italic text-navy-700">
              apostas online?
            </em>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-[18px] text-ink-soft sm:text-[19px]">
            Responda a 7 etapas rápidas para descobrir se o seu caso tem base jurídica para
            responsabilizar civilmente a plataforma e buscar a reparação dos valores perdidos.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onStart}
              className="rounded-full bg-blue-electric px-8 py-4 text-[15.5px] font-semibold text-white shadow-[var(--shadow-blue)] transition-all hover:-translate-y-0.5 hover:bg-navy-700"
            >
              Iniciar avaliação gratuita →
            </button>
            <Link
              to="/direitos"
              className="rounded-full border-[1.5px] border-line bg-white px-7 py-3.5 text-[15px] font-semibold text-navy-900 no-underline transition-all hover:-translate-y-0.5 hover:border-blue-electric hover:bg-tint"
            >
              Conhecer meus direitos
            </Link>
          </div>
          <div className="mt-4 text-xs text-ink-faint">
            Leva cerca de 3 minutos · 100% confidencial
          </div>

          <div className="mt-16 grid gap-4 sm:grid-cols-3">
            {[
              {
                num: "01",
                title: "Responsabilidade civil",
                text: "Análise à luz do CDC e da Lei nº 14.790/2023.",
              },
              {
                num: "02",
                title: "Sigilo profissional",
                text: "Suas informações protegidas pela LGPD.",
              },
              {
                num: "03",
                title: "Sem compromisso",
                text: "Você só avança se quiser avaliar seu caso.",
              },
            ].map((item) => (
              <div
                key={item.num}
                className="rounded-[14px] border border-line bg-tint p-6 text-left transition-all hover:-translate-y-1 hover:border-navy-500 hover:bg-white hover:shadow-[var(--shadow-elevated)]"
              >
                <div className="text-xs font-bold uppercase tracking-wider text-navy-700">
                  {item.num}
                </div>
                <h3 className="mt-2 font-serifDisplay text-[19px] font-semibold text-ink">
                  {item.title}
                </h3>
                <p className="mt-2 text-[14.5px] text-ink-soft">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function ThankYou({ answers }: { answers: Answers }) {
  const score = useMemo(() => computeScore(answers), [answers]);

  const tierStyles: Record<
    typeof score.tier,
    { badge: string; ring: string; icon: string; iconBg: string; barFrom: string; barTo: string }
  > = {
    prioritario: {
      badge: "bg-navy-900 text-white",
      ring: "ring-navy-900",
      icon: "★",
      iconBg: "bg-navy-900 text-gold",
      barFrom: "from-gold",
      barTo: "to-navy-900",
    },
    analise: {
      badge: "bg-gold-deep text-white",
      ring: "ring-gold-deep",
      icon: "◆",
      iconBg: "bg-gold-deep text-white",
      barFrom: "from-tint-deep",
      barTo: "to-gold-deep",
    },
    informativo: {
      badge: "bg-tint-deep text-navy-900",
      ring: "ring-navy-500",
      icon: "i",
      iconBg: "bg-navy-500 text-white",
      barFrom: "from-tint-deep",
      barTo: "to-navy-500",
    },
  };

  const s = tierStyles[score.tier];
  const pct = Math.min(100, Math.round((score.total / 150) * 100));

  return (
    <main className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
      <div
        className={`overflow-hidden rounded-[22px] border border-line bg-white shadow-[0_28px_64px_-24px_rgba(16,43,76,0.18)]`}
      >
        <div className="border-b border-line px-8 py-10 text-center sm:px-14 sm:py-12">
          <div
            className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full font-serifDisplay text-2xl font-semibold ring-4 ring-white ${s.iconBg}`}
          >
            {s.icon}
          </div>
          <div
            className={`mt-5 inline-block rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider ${s.badge}`}
          >
            {score.tierLabel}
          </div>
          <h1 className="mt-4 font-serifDisplay text-[32px] font-semibold leading-tight text-ink sm:text-[40px]">
            Sua pontuação: {score.total} pts
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[16px] text-ink-soft">
            {score.tierDescription}
          </p>

          <div className="mx-auto mt-8 max-w-md">
            <div className="mb-2 flex justify-between text-xs font-semibold text-ink-faint">
              <span>0</span>
              <span>30</span>
              <span>70</span>
              <span>150</span>
            </div>
            <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-tint-deep">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${s.barFrom} ${s.barTo} transition-all duration-1000`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="mt-2 flex justify-between text-[11px] text-ink-faint">
              <span>Orientação</span>
              <span>Análise</span>
              <span>Prioritário</span>
            </div>
          </div>

          <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-tint px-4 py-2 text-sm font-semibold text-emerald">
            Confirmação enviada para {answers.email || "seu e-mail"}
          </div>
        </div>

        {score.breakdown.length > 0 && (
          <div className="border-b border-line bg-tint px-8 py-8 sm:px-14">
            <h3 className="font-serifDisplay text-lg font-semibold text-ink">
              Como sua pontuação foi calculada
            </h3>
            <ul className="mt-4 divide-y divide-line">
              {score.breakdown.map((item) => (
                <li
                  key={item.label}
                  className="flex items-center justify-between gap-4 py-3 text-[14.5px]"
                >
                  <span className="text-ink">{item.label}</span>
                  <span className="whitespace-nowrap rounded-full bg-white px-3 py-1 text-xs font-bold text-navy-900 ring-1 ring-line">
                    +{item.points} pts
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="px-8 py-8 sm:px-14">
          <h3 className="font-serifDisplay text-lg font-semibold text-ink">
            Próximos passos
          </h3>
          <ul className="mt-4 space-y-3 text-[15px] text-ink-soft">
            <li className="flex gap-3">
              <span className="font-semibold text-navy-700">1.</span>
              Separe seus extratos bancários, comprovantes PIX e prints das apostas.
            </li>
            <li className="flex gap-3">
              <span className="font-semibold text-navy-700">2.</span>
              Se possível, reúna laudos médicos ou relatórios psicológicos.
            </li>
            <li className="flex gap-3">
              <span className="font-semibold text-navy-700">3.</span>
              {score.tier === "prioritario"
                ? "Aguarde nosso contato pelo WhatsApp ou telefone em até 24h úteis."
                : score.tier === "analise"
                  ? "Um especialista revisará seu caso e retornará em até 48h úteis."
                  : "Consulte o material educativo abaixo e retorne quando reunir mais documentação."}
            </li>
          </ul>

          <div className="mt-8 flex flex-wrap gap-3 border-t border-line pt-6">
            <Link
              to="/direitos"
              className="rounded-full bg-blue-electric px-6 py-3 text-sm font-semibold text-white no-underline shadow-[var(--shadow-blue)] transition-all hover:-translate-y-0.5 hover:bg-navy-700"
            >
              Conhecer meus direitos em detalhe →
            </Link>
            <a
              href="/direitos#casos"
              className="rounded-full border-[1.5px] border-line bg-white px-6 py-3 text-sm font-semibold text-navy-900 no-underline transition-all hover:-translate-y-0.5 hover:border-blue-electric hover:bg-tint"
            >
              Ver hipóteses de indenização
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
