import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/")({
  component: QuizPage,
});

type Answers = Record<string, string>;

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

  const goNext = () => {
    if (!canAdvance) return;
    if (stepIndex < totalSteps - 1) {
      setStepIndex((i) => i + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
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
      <header className="sticky top-0 z-40 border-b border-line bg-[rgba(255,255,255,0.88)] backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-navy-950 font-serifDisplay text-sm font-semibold text-white ring-2 ring-gold ring-offset-2 ring-offset-white">
              DA
            </div>
            <div className="font-serifDisplay text-[15px] leading-tight">
              <div className="font-semibold text-navy-950">Direitos do Apostador</div>
              <div className="text-xs font-medium text-ink-soft">
                Avaliação Jurídica Gratuita
              </div>
            </div>
          </div>
          <div className="hidden text-xs font-semibold uppercase tracking-wider text-ink-soft sm:block">
            Sigilo garantido · LGPD
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
              <span className="text-gold-deep">{step.eyebrow}</span>
              <span className="text-ink-faint">
                {Math.round(progress)}% concluído
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-tint-deep">
              <div
                className="h-full rounded-full bg-navy-900 transition-all duration-500"
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

            <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
              <button
                onClick={goBack}
                disabled={stepIndex === 0}
                className="rounded-full border-[1.5px] border-line bg-transparent px-6 py-3 text-sm font-semibold text-navy-900 transition-all hover:-translate-y-0.5 hover:border-navy-500 hover:bg-tint disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:border-line disabled:hover:bg-transparent"
              >
                ← Voltar
              </button>
              <button
                onClick={goNext}
                disabled={!canAdvance}
                className="rounded-full border-[1.5px] border-transparent bg-navy-900 px-7 py-3 text-sm font-semibold text-white shadow-[var(--shadow-soft)] transition-all hover:-translate-y-0.5 hover:bg-navy-700 hover:shadow-[var(--shadow-elevated)] disabled:cursor-not-allowed disabled:bg-ink-faint disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {stepIndex === totalSteps - 1 ? "Enviar avaliação" : "Continuar →"}
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
        <div className="mx-auto max-w-4xl px-6 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-tint-deep px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-navy-700">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
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
              className="rounded-full bg-navy-900 px-8 py-4 text-[15.5px] font-semibold text-white shadow-[var(--shadow-elevated)] transition-all hover:-translate-y-0.5 hover:bg-navy-700"
            >
              Iniciar avaliação gratuita →
            </button>
            <div className="text-xs text-ink-faint">
              Leva cerca de 3 minutos · 100% confidencial
            </div>
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
  const qualified =
    answers.perdeu_dinheiro === "sim" &&
    !["ate_5k"].includes(answers.valor_perdido ?? "") &&
    (answers.extratos === "sim" || answers.extratos === "parcialmente" || answers.pix === "sim");

  return (
    <main className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
      <div className="rounded-[22px] border border-line bg-white p-10 text-center shadow-[0_28px_64px_-24px_rgba(16,43,76,0.18)] sm:p-14">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-tint">
          <span className="text-2xl text-emerald">✓</span>
        </div>
        <h1 className="mt-6 font-serifDisplay text-[34px] font-semibold text-ink sm:text-[42px]">
          {qualified ? "Seu caso foi pré-qualificado" : "Recebemos sua avaliação"}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-[16.5px] text-ink-soft">
          {qualified
            ? "Com base nas suas respostas, seu caso apresenta indícios relevantes para responsabilização civil da plataforma. Um advogado especializado entrará em contato em até 24 horas úteis."
            : "Analisaremos as informações enviadas com atenção. Caso identifiquemos base para atuação jurídica, nossa equipe entrará em contato em breve."}
        </p>

        <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-emerald-tint px-4 py-2 text-sm font-semibold text-emerald">
          Confirmação enviada para {answers.email || "seu e-mail"}
        </div>

        <div className="mt-10 border-t border-line pt-8 text-left">
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
              Aguarde nosso contato pelo WhatsApp ou telefone informado.
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
