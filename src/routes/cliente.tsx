import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { submitDetailedFormFn } from "@/lib/send-email.server";

const TITLE = "ByeBets — Formulário do Cliente (Levantamento Aprofundado)";
const DESCRIPTION =
  "Levantamento detalhado de informações e documentos para fundamentação e análise jurídica do caso.";

export const Route = createFileRoute("/cliente")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: ClienteFormPage,
});

function ClienteFormPage() {
  const [currentStep, setCurrentStep] = useState(0);

  // Initial Triage / Client Info State
  const [info, setInfo] = useState({
    nome: "Fabio Duran",
    telefone: "11930074841",
    email: "fabioduran1503@gmail.com",
    cidadeUf: "São Bernardo do Campo / SP",
    plataforma: "Esportes da Sorte",
    valorPerdido: "R$ 50.000 a R$ 100.000",
    tempoPerda: "1 a 6 meses",
    diagnostico: "Não",
    tratamento: "Não",
    autoexclusao: "Não",
  });

  // Detailed Questions State
  const [q1, setQ1] = useState("");
  const [q2a, setQ2a] = useState("");
  const [q2b, setQ2b] = useState("");
  const [q3Radio, setQ3Radio] = useState("");
  const [q3Note, setQ3Note] = useState("");
  const [q4a, setQ4a] = useState("");
  const [q4b, setQ4b] = useState("");
  const [q4c, setQ4c] = useState("");
  const [q5, setQ5] = useState("");

  const [q6, setQ6] = useState("");
  const [q7, setQ7] = useState("");
  const [q8, setQ8] = useState("");
  const [q9, setQ9] = useState("");
  const [q10Opts, setQ10Opts] = useState<string[]>([]);
  const [q10Note, setQ10Note] = useState("");
  const [q11, setQ11] = useState("");

  const [q12, setQ12] = useState("");
  const [q13, setQ13] = useState("");
  const [q14, setQ14] = useState("");
  const [q15, setQ15] = useState("");
  const [q16, setQ16] = useState("");
  const [q17Opts, setQ17Opts] = useState<string[]>([]);
  const [q18Opts, setQ18Opts] = useState<string[]>([]);
  const [q19Radio, setQ19Radio] = useState("");

  const [q20Radio, setQ20Radio] = useState("");
  const [q21Opts, setQ21Opts] = useState<string[]>([]);
  const [qCpf, setQCpf] = useState("");
  const [qEnd, setQEnd] = useState("");

  // Copy / Download / Send States
  const [copied, setCopied] = useState(false);
  const [sending, setSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const toggleCheckbox = (list: string[], setList: (v: string[]) => void, item: string) => {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  // Generate Review Text Summary
  const summaryText = useMemo(() => {
    const lines = [];
    lines.push("FORMULÁRIO DO CLIENTE — LEVANTAMENTO APROFUNDADO");
    lines.push(`${info.nome || "-"} · ${info.telefone || "-"} · ${info.email || "-"}`);
    lines.push(`${info.cidadeUf || "-"}`);
    lines.push(`Plataforma principal: ${info.plataforma || "-"}`);
    lines.push("");
    lines.push("— TRIAGEM INICIAL —");
    lines.push(`• Valor aproximado perdido: ${info.valorPerdido || "-"}`);
    lines.push(`• Tempo de perda: ${info.tempoPerda || "-"}`);
    lines.push(`• Diagnóstico de ludopatia: ${info.diagnostico || "-"}`);
    lines.push(`• Em tratamento: ${info.tratamento || "-"}`);
    lines.push(`• Pediu autoexclusão formal: ${info.autoexclusao || "-"}`);
    lines.push("");
    lines.push("— PERÍODO E VALORES —");
    lines.push(`1. Criação da conta: ${q1 || "-"}`);
    lines.push(`2. Primeiro depósito: ${q2a || "-"} | Última aposta: ${q2b || "-"}`);
    lines.push(`3. Perdas somente nesta plataforma: ${q3Radio || "-"}${q3Note ? " — " + q3Note : ""}`);
    lines.push(`4. Total depositado: ${q4a || "-"} | Total sacado: ${q4b || "-"} | Perda líquida: ${q4c || "-"}`);
    lines.push(`5. Padrão das perdas: ${q5 || "-"}`);
    lines.push("");
    lines.push("— FORMA DAS APOSTAS —");
    lines.push(`6. Dificuldade para parar: ${q6 || "-"}`);
    lines.push(`7. Aumentava apostas após perder: ${q7 || "-"}`);
    lines.push(`8. Vários depósitos/PIX seguidos: ${q8 || "-"}`);
    lines.push(`9. Horas seguidas apostando: ${q9 || "-"}`);
    lines.push(`10. Meios usados para continuar apostando: ${q10Opts.join(", ") || "-"}${q10Note ? " — " + q10Note : ""}`);
    lines.push(`11. Renda mensal na época: ${q11 || "-"}`);
    lines.push("");
    lines.push("— LIMITES, ALERTAS E SAÚDE —");
    lines.push(`12. Avaliação médica/psiquiátrica: ${q12 || "-"}`);
    lines.push(`13. Limites definidos: ${q13 || "-"}`);
    lines.push(`14. Alteração de limites: ${q14 || "-"}`);
    lines.push(`15. Continuou apostando após limite: ${q15 || "-"}`);
    lines.push(`16. Alertas de jogo responsável recebidos: ${q16 || "-"}`);
    lines.push(`17. Ações da plataforma: ${q17Opts.join(", ") || "-"}`);
    lines.push(`18. Ofertas recebidas durante perdas: ${q18Opts.join(", ") || "-"}`);
    lines.push(`19. Contato informal com suporte: ${q19Radio || "-"}`);
    lines.push("");
    lines.push("— DOCUMENTOS E DADOS —");
    lines.push(`20. Consegue baixar histórico de apostas: ${q20Radio || "-"}`);
    lines.push(`21. Documentos disponíveis: ${q21Opts.join(", ") || "-"}`);
    lines.push(`CPF: ${qCpf || "-"}`);
    lines.push(`Endereço completo: ${qEnd || "-"}`);
    return lines.join("\n");
  }, [
    info,
    q1,
    q2a,
    q2b,
    q3Radio,
    q3Note,
    q4a,
    q4b,
    q4c,
    q5,
    q6,
    q7,
    q8,
    q9,
    q10Opts,
    q10Note,
    q11,
    q12,
    q13,
    q14,
    q15,
    q16,
    q17Opts,
    q18Opts,
    q19Radio,
    q20Radio,
    q21Opts,
    qCpf,
    qEnd,
  ]);

  const handleCopy = () => {
    navigator.clipboard.writeText(summaryText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 4000);
    });
  };

  const handleDownload = () => {
    const blob = new Blob([summaryText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const safeName = (info.nome || "cliente").toLowerCase().replace(/\s+/g, "_");
    a.download = `formulario_${safeName}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSendEmail = async () => {
    if (sending || sentSuccess) return;
    setSending(true);
    setSendError(null);

    try {
      const parts = info.cidadeUf.split("/");
      const cidade = parts[0]?.trim() || info.cidadeUf;
      const estado = parts[1]?.trim() || "";

      const res = await submitDetailedFormFn({
        data: {
          summaryText,
          clientData: {
            nome: info.nome,
            email: info.email,
            telefone: info.telefone,
            cidade,
            estado,
            plataforma: info.plataforma,
          },
        },
      });

      if (res && !res.ok) {
        throw new Error(res.error || "Erro no envio do formulário.");
      }

      setSentSuccess(true);
    } catch (err) {
      console.error("Erro no envio:", err);
      setSendError(
        err instanceof Error ? err.message : "Não foi possível enviar. Tente novamente."
      );
    } finally {
      setSending(false);
    }
  };

  const tabLabels = ["Início", "Período", "Apostas", "Limites", "Documentos", "Revisão"];

  return (
    <div className="min-h-screen bg-[#F6F3EC] text-[#22201B] font-sans">
      {/* Top Header */}
      <header className="sticky top-0 z-40 border-b border-[#E4DFD3] bg-gradient-to-r from-[#0B2340] to-[#14335C] text-white">
        <div className="mx-auto max-w-2xl px-6 py-5">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center no-underline">
              <img
                src="/logo.png"
                alt="ByeBets"
                className="h-10 w-auto brightness-0 invert"
              />
            </Link>
            <span className="text-[11px] font-semibold uppercase tracking-widest text-[#B98B3E]">
              Formulário do Cliente
            </span>
          </div>

          <h1 className="mt-3 font-serifDisplay text-xl font-semibold leading-snug sm:text-2xl">
            Levantamento de informações — {info.plataforma || "Caso de Apostas"}
          </h1>
          <p className="mt-1 text-xs opacity-85 sm:text-sm">
            Preencha abaixo para darmos sequência à fundamentação e análise do seu caso.
          </p>

          {/* Stepper Tabs */}
          <div className="mt-4 flex gap-1.5 overflow-x-auto pb-1">
            {tabLabels.map((label, idx) => {
              const active = idx === currentStep;
              const done = idx < currentStep;
              return (
                <button
                  key={label}
                  onClick={() => setCurrentStep(idx)}
                  className={`flex-1 min-w-[64px] rounded-t-md px-2 py-1.5 text-center text-xs transition-colors whitespace-nowrap ${
                    active
                      ? "bg-[#F6F3EC] font-semibold text-[#0B2340]"
                      : done
                        ? "bg-white/10 text-[#B98B3E]"
                        : "bg-white/5 text-white/55 hover:bg-white/10"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Form Content */}
      <main className="mx-auto max-w-2xl px-6 py-8 pb-28">
        {/* STEP 0: INÍCIO */}
        {currentStep === 0 && (
          <div className="space-y-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#B98B3E]">Início</p>
              <h2 className="font-serifDisplay text-2xl font-semibold text-[#0B2340]">O que já sabemos</h2>
            </div>

            <div className="rounded-xl border border-[#E4CFA0] bg-[#F2E6CC] p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-[#7A5A1E] mb-3">
                RESUMO DA TRIAGEM INICIAL (site ByeBets)
              </p>
              <div className="space-y-2 text-xs sm:text-sm">
                <div className="flex flex-wrap justify-between border-b border-black/5 pb-1.5">
                  <span className="text-[#7A5A1E]">Nome completo</span>
                  <input
                    type="text"
                    value={info.nome}
                    onChange={(e) => setInfo({ ...info, nome: e.target.value })}
                    className="font-medium text-right bg-transparent border-none focus:outline-none focus:bg-white/50 rounded px-1"
                  />
                </div>
                <div className="flex flex-wrap justify-between border-b border-black/5 pb-1.5">
                  <span className="text-[#7A5A1E]">Telefone / WhatsApp</span>
                  <input
                    type="text"
                    value={info.telefone}
                    onChange={(e) => setInfo({ ...info, telefone: e.target.value })}
                    className="font-medium text-right bg-transparent border-none focus:outline-none focus:bg-white/50 rounded px-1"
                  />
                </div>
                <div className="flex flex-wrap justify-between border-b border-black/5 pb-1.5">
                  <span className="text-[#7A5A1E]">E-mail</span>
                  <input
                    type="text"
                    value={info.email}
                    onChange={(e) => setInfo({ ...info, email: e.target.value })}
                    className="font-medium text-right bg-transparent border-none focus:outline-none focus:bg-white/50 rounded px-1"
                  />
                </div>
                <div className="flex flex-wrap justify-between border-b border-black/5 pb-1.5">
                  <span className="text-[#7A5A1E]">Cidade / UF</span>
                  <input
                    type="text"
                    value={info.cidadeUf}
                    onChange={(e) => setInfo({ ...info, cidadeUf: e.target.value })}
                    className="font-medium text-right bg-transparent border-none focus:outline-none focus:bg-white/50 rounded px-1"
                  />
                </div>
                <div className="flex flex-wrap justify-between border-b border-black/5 pb-1.5">
                  <span className="text-[#7A5A1E]">Plataforma</span>
                  <input
                    type="text"
                    value={info.plataforma}
                    onChange={(e) => setInfo({ ...info, plataforma: e.target.value })}
                    className="font-medium text-right bg-transparent border-none focus:outline-none focus:bg-white/50 rounded px-1 font-semibold"
                  />
                </div>
                <div className="flex flex-wrap justify-between border-b border-black/5 pb-1.5">
                  <span className="text-[#7A5A1E]">Valor aproximado perdido</span>
                  <input
                    type="text"
                    value={info.valorPerdido}
                    onChange={(e) => setInfo({ ...info, valorPerdido: e.target.value })}
                    className="font-medium text-right bg-transparent border-none focus:outline-none focus:bg-white/50 rounded px-1"
                  />
                </div>
                <div className="flex flex-wrap justify-between border-b border-black/5 pb-1.5">
                  <span className="text-[#7A5A1E]">Tempo de perda</span>
                  <input
                    type="text"
                    value={info.tempoPerda}
                    onChange={(e) => setInfo({ ...info, tempoPerda: e.target.value })}
                    className="font-medium text-right bg-transparent border-none focus:outline-none focus:bg-white/50 rounded px-1"
                  />
                </div>
                <div className="flex flex-wrap justify-between border-b border-black/5 pb-1.5">
                  <span className="text-[#7A5A1E]">Diagnóstico de ludopatia</span>
                  <input
                    type="text"
                    value={info.diagnostico}
                    onChange={(e) => setInfo({ ...info, diagnostico: e.target.value })}
                    className="font-medium text-right bg-transparent border-none focus:outline-none focus:bg-white/50 rounded px-1"
                  />
                </div>
                <div className="flex flex-wrap justify-between border-b border-black/5 pb-1.5">
                  <span className="text-[#7A5A1E]">Em tratamento</span>
                  <input
                    type="text"
                    value={info.tratamento}
                    onChange={(e) => setInfo({ ...info, tratamento: e.target.value })}
                    className="font-medium text-right bg-transparent border-none focus:outline-none focus:bg-white/50 rounded px-1"
                  />
                </div>
                <div className="flex flex-wrap justify-between">
                  <span className="text-[#7A5A1E]">Pediu autoexclusão</span>
                  <input
                    type="text"
                    value={info.autoexclusao}
                    onChange={(e) => setInfo({ ...info, autoexclusao: e.target.value })}
                    className="font-medium text-right bg-transparent border-none focus:outline-none focus:bg-white/50 rounded px-1"
                  />
                </div>
              </div>
            </div>

            <p className="text-sm text-[#6B6558] leading-relaxed">
              Nas próximas telas vamos aprofundar esses pontos. Sempre que uma pergunta pedir print, comprovante ou conversa, tenha o arquivo em mãos para nos enviar separadamente após preencher o formulário.
            </p>
          </div>
        )}

        {/* STEP 1: PERÍODO E VALORES */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#B98B3E]">Etapa 1 de 4</p>
              <h2 className="font-serifDisplay text-2xl font-semibold text-[#0B2340]">Período e valores</h2>
            </div>

            {/* Q1 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                <span className="font-bold text-[#B98B3E] mr-1">1.</span>
                Em que mês/ano você criou sua conta na {info.plataforma || "plataforma"}?
              </label>
              <p className="text-xs text-[#6B6558] italic">
                <strong className="text-[#7A5A1E]">Já informado no site:</strong> período de perdas de aproximadamente {info.tempoPerda}. Confirme a data exata.
              </p>
              <input
                type="text"
                placeholder="ex.: março de 2025"
                value={q1}
                onChange={(e) => setQ1(e.target.value)}
                className="w-full rounded-lg border border-[#E4DFD3] bg-[#FCFBF8] p-3 text-sm focus:border-[#B98B3E] focus:bg-white focus:outline-none"
              />
            </div>

            {/* Q2 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                <span className="font-bold text-[#B98B3E] mr-1">2.</span>
                Data aproximada do primeiro depósito e da última aposta
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  type="text"
                  placeholder="Primeiro depósito (ex: 15/03/2025)"
                  value={q2a}
                  onChange={(e) => setQ2a(e.target.value)}
                  className="w-full rounded-lg border border-[#E4DFD3] bg-[#FCFBF8] p-3 text-sm focus:border-[#B98B3E] focus:bg-white focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Última aposta (ex: 10/05/2025)"
                  value={q2b}
                  onChange={(e) => setQ2b(e.target.value)}
                  className="w-full rounded-lg border border-[#E4DFD3] bg-[#FCFBF8] p-3 text-sm focus:border-[#B98B3E] focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            {/* Q3 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                <span className="font-bold text-[#B98B3E] mr-1">3.</span>
                As perdas foram somente na {info.plataforma || "plataforma"}?
              </label>
              <p className="text-xs text-[#6B6558] italic">
                <strong className="text-[#7A5A1E]">Já informado no site:</strong> faixa de perda de {info.valorPerdido}.
              </p>
              <div className="space-y-2">
                {[
                  "Sim, somente nesta plataforma",
                  "Não — houve perdas em outras plataformas também",
                ].map((opt) => (
                  <label
                    key={opt}
                    onClick={() => setQ3Radio(opt)}
                    className={`flex items-center gap-3 rounded-lg border p-3 text-sm cursor-pointer transition-colors ${
                      q3Radio === opt
                        ? "border-[#B98B3E] bg-[#FFFCF5]"
                        : "border-[#E4DFD3] bg-[#FCFBF8] hover:bg-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name="q3"
                      checked={q3Radio === opt}
                      onChange={() => setQ3Radio(opt)}
                      className="accent-[#0B2340]"
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
              <textarea
                placeholder="Se marcou 'Não', especifique quais plataformas e valores aproximados"
                value={q3Note}
                onChange={(e) => setQ3Note(e.target.value)}
                className="w-full min-h-[64px] rounded-lg border border-[#E4DFD3] bg-[#FCFBF8] p-3 text-sm focus:border-[#B98B3E] focus:bg-white focus:outline-none"
              />
            </div>

            {/* Q4 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                <span className="font-bold text-[#B98B3E] mr-1">4.</span>
                Ainda que aproximadamente, informe os totais da conta:
              </label>
              <div className="grid gap-3 sm:grid-cols-3">
                <input
                  type="text"
                  placeholder="Total depositado (R$)"
                  value={q4a}
                  onChange={(e) => setQ4a(e.target.value)}
                  className="w-full rounded-lg border border-[#E4DFD3] bg-[#FCFBF8] p-3 text-sm focus:border-[#B98B3E] focus:bg-white focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Total sacado (R$)"
                  value={q4b}
                  onChange={(e) => setQ4b(e.target.value)}
                  className="w-full rounded-lg border border-[#E4DFD3] bg-[#FCFBF8] p-3 text-sm focus:border-[#B98B3E] focus:bg-white focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Perda líquida (R$)"
                  value={q4c}
                  onChange={(e) => setQ4c(e.target.value)}
                  className="w-full rounded-lg border border-[#E4DFD3] bg-[#FCFBF8] p-3 text-sm focus:border-[#B98B3E] focus:bg-white focus:outline-none font-semibold text-[#0B2340]"
                />
              </div>
            </div>

            {/* Q5 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                <span className="font-bold text-[#B98B3E] mr-1">5.</span>
                As perdas foram graduais ou houve salto abrupto nos valores apostados?
              </label>
              <textarea
                placeholder="ex.: comecei apostando R$ 100–500 e depois passei a apostar milhares de reais em poucos dias..."
                value={q5}
                onChange={(e) => setQ5(e.target.value)}
                className="w-full min-h-[72px] rounded-lg border border-[#E4DFD3] bg-[#FCFBF8] p-3 text-sm focus:border-[#B98B3E] focus:bg-white focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* STEP 2: FORMA DAS APOSTAS */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#B98B3E]">Etapa 2 de 4</p>
              <h2 className="font-serifDisplay text-2xl font-semibold text-[#0B2340]">Forma como as apostas ocorreram</h2>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">
                <span className="font-bold text-[#B98B3E] mr-1">6.</span>
                Você sentiu dificuldade para parar de apostar mesmo querendo parar?
              </label>
              <textarea
                value={q6}
                onChange={(e) => setQ6(e.target.value)}
                className="w-full min-h-[64px] rounded-lg border border-[#E4DFD3] bg-[#FCFBF8] p-3 text-sm focus:border-[#B98B3E] focus:bg-white focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">
                <span className="font-bold text-[#B98B3E] mr-1">7.</span>
                Depois de perder, costumava apostar mais ou depositar de novo tentando recuperar o prejuízo?
              </label>
              <textarea
                value={q7}
                onChange={(e) => setQ7(e.target.value)}
                className="w-full min-h-[64px] rounded-lg border border-[#E4DFD3] bg-[#FCFBF8] p-3 text-sm focus:border-[#B98B3E] focus:bg-white focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">
                <span className="font-bold text-[#B98B3E] mr-1">8.</span>
                Houve dias com vários depósitos ou PIX seguidos? Quantos e de quais valores, aproximadamente?
              </label>
              <textarea
                value={q8}
                onChange={(e) => setQ8(e.target.value)}
                className="w-full min-h-[64px] rounded-lg border border-[#E4DFD3] bg-[#FCFBF8] p-3 text-sm focus:border-[#B98B3E] focus:bg-white focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">
                <span className="font-bold text-[#B98B3E] mr-1">9.</span>
                Chegou a apostar por muitas horas seguidas, inclusive de madrugada? Com que frequência?
              </label>
              <textarea
                value={q9}
                onChange={(e) => setQ9(e.target.value)}
                className="w-full min-h-[64px] rounded-lg border border-[#E4DFD3] bg-[#FCFBF8] p-3 text-sm focus:border-[#B98B3E] focus:bg-white focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">
                <span className="font-bold text-[#B98B3E] mr-1">10.</span>
                Para continuar apostando, você chegou a utilizar:
              </label>
              <div className="space-y-2">
                {[
                  "Cartão ou limite bancário",
                  "Cheque especial",
                  "Empréstimo",
                  "Dinheiro reservado para despesas",
                  "Venda de algum bem",
                ].map((opt) => {
                  const checked = q10Opts.includes(opt);
                  return (
                    <label
                      key={opt}
                      onClick={() => toggleCheckbox(q10Opts, setQ10Opts, opt)}
                      className={`flex items-center gap-3 rounded-lg border p-3 text-sm cursor-pointer transition-colors ${
                        checked
                          ? "border-[#B98B3E] bg-[#FFFCF5]"
                          : "border-[#E4DFD3] bg-[#FCFBF8] hover:bg-white"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleCheckbox(q10Opts, setQ10Opts, opt)}
                        className="accent-[#0B2340]"
                      />
                      <span>{opt}</span>
                    </label>
                  );
                })}
              </div>
              <textarea
                placeholder="Se marcou alguma opção, explique resumidamente..."
                value={q10Note}
                onChange={(e) => setQ10Note(e.target.value)}
                className="w-full min-h-[64px] rounded-lg border border-[#E4DFD3] bg-[#FCFBF8] p-3 text-sm focus:border-[#B98B3E] focus:bg-white focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">
                <span className="font-bold text-[#B98B3E] mr-1">11.</span>
                Qual era, aproximadamente, sua renda mensal na época das perdas?
              </label>
              <input
                type="text"
                placeholder="ex.: R$ 8.000 / mês"
                value={q11}
                onChange={(e) => setQ11(e.target.value)}
                className="w-full rounded-lg border border-[#E4DFD3] bg-[#FCFBF8] p-3 text-sm focus:border-[#B98B3E] focus:bg-white focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* STEP 3: LIMITES, ALERTAS E SAÚDE */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#B98B3E]">Etapa 3 de 4</p>
              <h2 className="font-serifDisplay text-2xl font-semibold text-[#0B2340]">Limites, alertas e saúde</h2>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">
                <span className="font-bold text-[#B98B3E] mr-1">12.</span>
                Já passou por avaliação médica/psiquiátrica relacionada ao jogo, mesmo informal? Tem interesse em ser encaminhado para uma avaliação?
              </label>
              <p className="text-xs text-[#6B6558] italic">
                <strong className="text-[#7A5A1E]">Já informado no site:</strong> {info.diagnostico === "Sim" ? "Possui diagnóstico" : "sem diagnóstico formal"} e {info.tratamento === "Sim" ? "em tratamento" : "sem tratamento"} até o momento.
              </p>
              <textarea
                value={q12}
                onChange={(e) => setQ12(e.target.value)}
                className="w-full min-h-[64px] rounded-lg border border-[#E4DFD3] bg-[#FCFBF8] p-3 text-sm focus:border-[#B98B3E] focus:bg-white focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">
                <span className="font-bold text-[#B98B3E] mr-1">13.</span>
                A plataforma pediu para você definir limite de perda, depósito, aposta ou tempo de uso? Quais limites, e ainda consegue comprová-los?
              </label>
              <textarea
                value={q13}
                onChange={(e) => setQ13(e.target.value)}
                className="w-full min-h-[64px] rounded-lg border border-[#E4DFD3] bg-[#FCFBF8] p-3 text-sm focus:border-[#B98B3E] focus:bg-white focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">
                <span className="font-bold text-[#B98B3E] mr-1">14.</span>
                Chegou a alterar/aumentar algum limite? A mudança foi imediata ou teve carência?
              </label>
              <textarea
                value={q14}
                onChange={(e) => setQ14(e.target.value)}
                className="w-full min-h-[64px] rounded-lg border border-[#E4DFD3] bg-[#FCFBF8] p-3 text-sm focus:border-[#B98B3E] focus:bg-white focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">
                <span className="font-bold text-[#B98B3E] mr-1">15.</span>
                A plataforma permitiu continuar apostando mesmo após atingir o limite definido?
              </label>
              <textarea
                value={q15}
                onChange={(e) => setQ15(e.target.value)}
                className="w-full min-h-[64px] rounded-lg border border-[#E4DFD3] bg-[#FCFBF8] p-3 text-sm focus:border-[#B98B3E] focus:bg-white focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">
                <span className="font-bold text-[#B98B3E] mr-1">16.</span>
                Recebeu algum alerta de jogo responsável, aviso de excesso/perdas ou sugestão de pausa? Quando (envie print se tiver)?
              </label>
              <textarea
                value={q16}
                onChange={(e) => setQ16(e.target.value)}
                className="w-full min-h-[64px] rounded-lg border border-[#E4DFD3] bg-[#FCFBF8] p-3 text-sm focus:border-[#B98B3E] focus:bg-white focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">
                <span className="font-bold text-[#B98B3E] mr-1">17.</span>
                A plataforma alguma vez:
              </label>
              <div className="space-y-2">
                {[
                  "Limitou ou bloqueou temporariamente sua conta",
                  "Pediu para você fazer uma pausa",
                  "Entrou em contato por causa do volume de apostas",
                  "Aplicou questionário sobre comportamento de jogo",
                ].map((opt) => {
                  const checked = q17Opts.includes(opt);
                  return (
                    <label
                      key={opt}
                      onClick={() => toggleCheckbox(q17Opts, setQ17Opts, opt)}
                      className={`flex items-center gap-3 rounded-lg border p-3 text-sm cursor-pointer transition-colors ${
                        checked
                          ? "border-[#B98B3E] bg-[#FFFCF5]"
                          : "border-[#E4DFD3] bg-[#FCFBF8] hover:bg-white"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleCheckbox(q17Opts, setQ17Opts, opt)}
                        className="accent-[#0B2340]"
                      />
                      <span>{opt}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">
                <span className="font-bold text-[#B98B3E] mr-1">18.</span>
                Mesmo com perdas elevadas, você recebeu da plataforma:
              </label>
              <div className="space-y-2">
                {[
                  "Bônus, cashback ou freebets",
                  "Promoções",
                  "E-mails/SMS/WhatsApp com ofertas",
                ].map((opt) => {
                  const checked = q18Opts.includes(opt);
                  return (
                    <label
                      key={opt}
                      onClick={() => toggleCheckbox(q18Opts, setQ18Opts, opt)}
                      className={`flex items-center gap-3 rounded-lg border p-3 text-sm cursor-pointer transition-colors ${
                        checked
                          ? "border-[#B98B3E] bg-[#FFFCF5]"
                          : "border-[#E4DFD3] bg-[#FCFBF8] hover:bg-white"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleCheckbox(q18Opts, setQ18Opts, opt)}
                        className="accent-[#0B2340]"
                      />
                      <span>{opt}</span>
                    </label>
                  );
                })}
              </div>
              <p className="text-xs text-[#6B6558] italic">
                Se possuir, guarde os prints correspondentes — é uma das provas mais fortes do caso.
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">
                <span className="font-bold text-[#B98B3E] mr-1">19.</span>
                Avisou o suporte, mesmo informalmente, que estava perdendo muito e queria parar/reduzir/bloquear a conta?
              </label>
              <div className="space-y-2">
                {[
                  "Sim (vou enviar a conversa)",
                  "Não, nunca entrei em contato sobre isso",
                ].map((opt) => (
                  <label
                    key={opt}
                    onClick={() => setQ19Radio(opt)}
                    className={`flex items-center gap-3 rounded-lg border p-3 text-sm cursor-pointer transition-colors ${
                      q19Radio === opt
                        ? "border-[#B98B3E] bg-[#FFFCF5]"
                        : "border-[#E4DFD3] bg-[#FCFBF8] hover:bg-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name="q19"
                      checked={q19Radio === opt}
                      onChange={() => setQ19Radio(opt)}
                      className="accent-[#0B2340]"
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: DOCUMENTOS E DADOS */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#B98B3E]">Etapa 4 de 4</p>
              <h2 className="font-serifDisplay text-2xl font-semibold text-[#0B2340]">Documentos e dados</h2>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">
                <span className="font-bold text-[#B98B3E] mr-1">20.</span>
                Consegue acessar e baixar o histórico completo de apostas?
              </label>
              <div className="space-y-2">
                {["Sim", "Não"].map((opt) => (
                  <label
                    key={opt}
                    onClick={() => setQ20Radio(opt)}
                    className={`flex items-center gap-3 rounded-lg border p-3 text-sm cursor-pointer transition-colors ${
                      q20Radio === opt
                        ? "border-[#B98B3E] bg-[#FFFCF5]"
                        : "border-[#E4DFD3] bg-[#FCFBF8] hover:bg-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name="q20"
                      checked={q20Radio === opt}
                      onChange={() => setQ20Radio(opt)}
                      className="accent-[#0B2340]"
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">
                <span className="font-bold text-[#B98B3E] mr-1">21.</span>
                Você possui ou consegue obter:
              </label>
              <div className="space-y-2">
                {[
                  "Extratos bancários do período",
                  "Comprovantes de PIX",
                  "Histórico de depósitos e saques",
                  "Histórico de apostas",
                  `E-mails da ${info.plataforma || "plataforma"}`,
                  "Notificações e mensagens promocionais",
                  "Conversas com o suporte",
                  "Prints da conta, limites e ferramentas de jogo responsável",
                ].map((opt) => {
                  const checked = q21Opts.includes(opt);
                  return (
                    <label
                      key={opt}
                      onClick={() => toggleCheckbox(q21Opts, setQ21Opts, opt)}
                      className={`flex items-center gap-3 rounded-lg border p-3 text-sm cursor-pointer transition-colors ${
                        checked
                          ? "border-[#B98B3E] bg-[#FFFCF5]"
                          : "border-[#E4DFD3] bg-[#FCFBF8] hover:bg-white"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleCheckbox(q21Opts, setQ21Opts, opt)}
                        className="accent-[#0B2340]"
                      />
                      <span>{opt}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="rounded-xl border border-[#E4CFA0] bg-[#FFF8E8] p-4 text-xs sm:text-sm text-[#7A5A1E] font-medium leading-relaxed">
              Envie primeiro os extratos bancários e o histórico da plataforma de todo o período das perdas — são os documentos mais importantes para reconstruir a evolução dos depósitos, apostas e prejuízos.
            </div>

            <div className="space-y-3 pt-2">
              <label className="block text-sm font-semibold text-[#0B2340]">
                Dados pessoais (para fundamentação e eventual notificação formal)
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  type="text"
                  placeholder="CPF"
                  value={qCpf}
                  onChange={(e) => setQCpf(e.target.value)}
                  className="w-full rounded-lg border border-[#E4DFD3] bg-[#FCFBF8] p-3 text-sm focus:border-[#B98B3E] focus:bg-white focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Endereço completo (Rua, Número, Bairro, CEP)"
                  value={qEnd}
                  onChange={(e) => setQEnd(e.target.value)}
                  className="w-full rounded-lg border border-[#E4DFD3] bg-[#FCFBF8] p-3 text-sm focus:border-[#B98B3E] focus:bg-white focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: REVISÃO & ENVIO */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#B98B3E]">Revisão</p>
              <h2 className="font-serifDisplay text-2xl font-semibold text-[#0B2340]">Confira e envie</h2>
              <p className="mt-1 text-sm text-[#6B6558]">
                Confira o resumo completo abaixo. Você pode enviá-lo diretamente à nossa equipe ou baixar/copiar os dados.
              </p>
            </div>

            {/* Review Box */}
            <div className="rounded-xl border border-[#E4DFD3] bg-white p-4 font-serifDisplay text-xs sm:text-sm leading-relaxed text-[#22201B] whitespace-pre-wrap max-h-[360px] overflow-y-auto">
              {summaryText}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleSendEmail}
                disabled={sending}
                className="flex-1 min-w-[180px] rounded-lg bg-[#0B2340] px-5 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#14335C] disabled:opacity-60"
              >
                {sending ? "Enviando..." : "Enviar formulário ao advogado →"}
              </button>

              <button
                type="button"
                onClick={handleCopy}
                className="rounded-lg border border-[#B98B3E] bg-[#B98B3E] px-4 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#a3792f]"
              >
                Copiar resumo
              </button>

              <button
                type="button"
                onClick={handleDownload}
                className="rounded-lg border border-[#E4DFD3] bg-white px-4 py-3.5 text-sm font-semibold text-[#0B2340] transition-all hover:bg-[#F6F3EC]"
              >
                Baixar como .txt
              </button>
            </div>

            {copied && (
              <p className="text-xs font-semibold text-[#3F7A5C]">
                ✓ Resumo copiado! Cole no WhatsApp ou e-mail.
              </p>
            )}

            {sendError && (
              <p className="text-xs font-semibold text-red-600">{sendError}</p>
            )}

            {sentSuccess && (
              <div className="rounded-xl bg-[#3F7A5C]/10 border border-[#3F7A5C]/30 p-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#3F7A5C] text-white font-bold text-xl mb-3">
                  ✓
                </div>
                <h3 className="font-serifDisplay text-lg font-semibold text-[#0B2340]">
                  Formulário enviado com sucesso!
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-[#6B6558] max-w-md mx-auto">
                  Sua equipe jurídica recebeu todo o levantamento aprofundado de informações. Entraremos em contato em breve para os próximos passos.
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Sticky Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#E4DFD3] bg-[#F6F3EC] px-6 py-3.5">
        <div className="mx-auto flex max-w-2xl justify-between gap-3">
          <button
            type="button"
            onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
            className={`rounded-lg border border-[#E4DFD3] bg-white px-5 py-2.5 text-sm font-semibold text-[#0B2340] transition-all hover:bg-[#FCFBF8] ${
              currentStep === 0 ? "invisible" : "visible"
            }`}
          >
            ← Voltar
          </button>

          {currentStep < 5 && (
            <button
              type="button"
              onClick={() => setCurrentStep((s) => Math.min(5, s + 1))}
              className="rounded-lg bg-[#0B2340] px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#14335C]"
            >
              {currentStep === 4 ? "Revisar respostas →" : "Continuar →"}
            </button>
          )}
        </div>
      </nav>
    </div>
  );
}
