import { createServerFn } from "@tanstack/react-start";
import { Resend } from "resend";
import type { Answers } from "./scoring";
import { generateClientFormPDF } from "./pdf-generator";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  // Public keys — safe to hardcode (security enforced by RLS in Supabase)
  const url =
    process.env.VITE_SUPABASE_URL ||
    "https://oaqggasdboxxpfdhrube.supabase.co";
  const key =
    process.env.VITE_SUPABASE_ANON_KEY ||
    "sb_publishable_VHgAIGfz4_qSb-S6I0XO8A_lCqIkwko";
  return createClient(url, key);
}


const LABELS: Record<string, string> = {
  // Dados de contato
  nome: "Nome completo",
  telefone: "Telefone / WhatsApp",
  cidade: "Cidade",
  estado: "Estado (UF)",
  email: "E-mail",

  // Etapa 1: Identificação do problema
  perdeu_dinheiro: "Perdeu dinheiro em apostas?",
  plataforma: "Plataforma utilizada",
  valor_perdido: "Valor aproximado perdido",
  tempo_perda: "Tempo de perda",

  // Etapa 2: Indícios de ludopatia
  dificuldade_parar: "Dificuldade em parar de apostar",
  apostava_sem_querer: "Apostava mesmo sem querer",
  emprestimos: "Usou empréstimos / cartão de crédito",
  vendeu_bem: "Vendeu bens para apostar",
  vida_financeira: "Vida financeira prejudicada",
  relacionamento: "Relacionamento familiar afetado",

  // Etapa 3: Histórico médico
  diagnostico: "Diagnóstico de ludopatia",
  tratamento: "Tratamento psicológico/psiquiátrico",
  laudo: "Possui laudo/relatório médico",

  // Etapa 4: Provas e documentação
  extratos: "Possui extratos bancários",
  historico_apostas: "Possui histórico de apostas",
  pix: "Possui comprovantes PIX",
  prints: "Possui prints da plataforma",

  // Etapa 5: Situação atual
  conta_ativa: "Conta ainda ativa na plataforma",
  autoexclusao: "Solicitou autoexclusão",
  promocoes: "Envio de promoções após pedir p/ parar",

  // Etapa 6: Seu objetivo
  objetivo: "Objetivo do cliente",

  // Fallbacks Legados
  autoexclusao_ignorada: "Pedido ignorado?",
  menores: "Envolvimento de menores?",
  publicidade_enganosa: "Publicidade enganosa?",
  dados_pessoais: "Problemas com dados pessoais?",
  saque_bloqueado: "Saque bloqueado?",
  conta_suspensa: "Conta suspensa indevidamente?",
  bonus_nao_pago: "Bônus não pago?",
  suporte_ignorado: "Suporte ignorou reclamações?",
  documentacao: "Documentação disponível?",
  advogado: "Já procurou advogado?",
  urgencia: "Urgência do caso",
};

const VALUE_LABELS: Record<string, string> = {
  sim: "Sim",
  nao: "Não",
  ate_5k: "Até R$ 5.000",
  "5k_20k": "R$ 5.000 a R$ 20.000",
  "20k_50k": "R$ 20.000 a R$ 50.000",
  "50k_100k": "R$ 50.000 a R$ 100.000",
  mais_100k: "Mais de R$ 100.000",
  menos_30d: "Menos de 30 dias",
  "1_6m": "1 a 6 meses",
  "6m_1a": "6 meses a 1 ano",
  mais_1a: "Mais de 1 ano",
  frequentemente: "Frequentemente",
  as_vezes: "Às vezes",
  nunca: "Nunca",
  muito: "Muito",
  um_pouco: "Um pouco",
  andamento: "Em andamento",
  parcialmente: "Parcialmente",
  nao_sei: "Não sei",
  recuperar: "Recuperar parte dos valores",
  entender: "Entender meus direitos",
  avaliacao: "Avaliação jurídica",
  psicologica: "Ajuda psicológica",
  ambos: "Ambos",
  talvez: "Talvez",
  sim_documentado: "Sim, documentado",
  sim_nao_documentado: "Sim, sem documentação formal",
  extratos: "Apenas extratos bancários/PIX",
  nenhuma: "Nenhuma documentação",
  nao_ainda: "Não ainda",
  ja_consultei: "Já consultei um advogado",
  urgente: "Urgente (preciso resolver logo)",
  normal: "Normal (posso aguardar alguns meses)",
  exploratório: "Exploratório (só quero entender meus direitos)",
};

function formatAnswer(value: string): string {
  return VALUE_LABELS[value] ?? value;
}

export const submitQuizFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as { answers: Answers; score: number; tier: string })
  .handler(async ({ data }) => {
    const apiKey = process.env.RESEND_API_KEY;
    const emailTo = process.env.EMAIL_TO;

    if (!apiKey || !emailTo) {
      console.error("Resend: variáveis de ambiente ausentes");
      return { ok: false, error: "Configuração incompleta no servidor." };
    }

    const resend = new Resend(apiKey);
    const { answers, score, tier } = data;

    const tierMap: Record<string, string> = {
      prioritario: "🔴 PRIORITÁRIO",
      analise: "🟡 EM ANÁLISE",
      informativo: "🟢 INFORMATIVO",
    };

    const allKeys = Array.from(new Set([...Object.keys(LABELS), ...Object.keys(answers)]));
    const rows = allKeys
      .map((key) => {
        const val = answers[key];
        if (!val) return "";
        const label = LABELS[key] ?? key;
        return `
          <tr>
            <td style="padding:8px 12px;background:#f1f5fb;color:#334155;font-size:13px;font-weight:600;width:40%;border-bottom:1px solid #e2e8f0;">${label}</td>
            <td style="padding:8px 12px;color:#1e293b;font-size:13px;border-bottom:1px solid #e2e8f0;">${formatAnswer(val)}</td>
          </tr>`;
      })
      .join("");

    const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:'Inter',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(13,27,62,0.10);">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#0D1B3E 0%,#1a3a7c 60%,#2979FF 100%);padding:32px 40px;text-align:center;">
            <div style="color:#ffffff;font-size:24px;font-weight:700;letter-spacing:-0.5px;">ByeBets</div>
            <div style="color:#93c5fd;font-size:12px;margin-top:4px;letter-spacing:2px;text-transform:uppercase;">Novo lead — Avaliação jurídica</div>
          </td>
        </tr>

        <!-- Score badge -->
        <tr>
          <td style="padding:28px 40px 0;text-align:center;">
            <div style="display:inline-block;background:#eff6ff;border:2px solid #2979FF;border-radius:999px;padding:10px 28px;">
              <span style="font-size:20px;font-weight:700;color:#2979FF;">${tierMap[tier] ?? tier}</span>
              <span style="font-size:14px;color:#64748b;margin-left:12px;">Pontuação: <strong>${score} pts</strong></span>
            </div>
          </td>
        </tr>

        <!-- Answers table -->
        <tr>
          <td style="padding:24px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:10px;overflow:hidden;border:1px solid #e2e8f0;">
              ${rows}
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:16px 40px 32px;text-align:center;color:#94a3b8;font-size:12px;">
            Enviado automaticamente pelo formulário ByeBets · ${new Date().toLocaleString("pt-BR")}
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

    try {
      const { error } = await resend.emails.send({
        from: "onboarding@resend.dev",
        to: [emailTo],
        subject: `[ByeBets] Novo lead ${tierMap[tier] ?? tier} — ${answers.nome ?? "Sem nome"} — ${score} pts`,
        html,
      });

      if (error) {
        console.error("Resend error:", error);
        return { ok: false, error: error.message };
      }

      // Save lead to Supabase
      try {
        const tierTyped = (tier === "prioritario" || tier === "analise" || tier === "informativo")
          ? tier as "prioritario" | "analise" | "informativo"
          : "informativo" as const;

        const db = getSupabase();
        await db.from("leads").insert({
          nome: answers.nome || "",
          telefone: answers.telefone || "",
          email: answers.email || "",
          cidade_uf: [answers.cidade, answers.estado].filter(Boolean).join(" / "),
          plataforma: answers.plataforma || "",
          valor_perdido: answers.valor_perdido || "",
          tempo_perda: answers.tempo_perda || "",
          score,
          tier: tierTyped,
          status: "Novo",
          answers,
        });
      } catch (dbErr) {
        console.error("Supabase insert error:", dbErr);
        // Don't fail if DB write fails — email was already sent
      }

      return { ok: true };
    } catch (err) {
      console.error("Erro ao enviar e-mail:", err);
      return { ok: false, error: "Falha ao enviar e-mail." };
    }
  });

export const submitDetailedFormFn = createServerFn({ method: "POST" })
  .validator(
    (data: unknown) =>
      data as {
        summaryText: string;
        formData?: Record<string, unknown>;
        clientData: {
          nome: string;
          email: string;
          telefone: string;
          cidade: string;
          estado: string;
          plataforma: string;
        };
      }
  )
  .handler(async ({ data }) => {
    const apiKey = process.env.RESEND_API_KEY || "";
    const emailTo = process.env.EMAIL_TO || "";

    const resend = new Resend(apiKey);
    const { summaryText, clientData, formData } = data;

    const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:'Inter',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(13,27,62,0.10);">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#0B2340 0%,#14335C 100%);padding:32px 40px;text-align:center;">
            <div style="color:#ffffff;font-size:24px;font-weight:700;letter-spacing:-0.5px;">ByeBets</div>
            <div style="color:#B98B3E;font-size:12px;margin-top:4px;letter-spacing:2px;text-transform:uppercase;">Formulário do Cliente — Levantamento Aprofundado</div>
          </td>
        </tr>

        <!-- Client Info Badge -->
        <tr>
          <td style="padding:24px 40px 0;">
            <div style="background:#F6F3EC;border:1px solid #E4DFD3;border-radius:10px;padding:16px;">
              <div style="font-size:16px;font-weight:700;color:#0B2340;">${clientData.nome || "Cliente"}</div>
              <div style="font-size:13px;color:#6B6558;margin-top:4px;">
                📞 ${clientData.telefone || "Não informado"} | ✉️ ${clientData.email || "Não informado"}
              </div>
              <div style="font-size:13px;color:#6B6558;margin-top:2px;">
                📍 ${clientData.cidade || "-"}/${clientData.estado || "-"} | 🎰 Plataforma: <strong>${clientData.plataforma || "Não informada"}</strong>
              </div>
            </div>
          </td>
        </tr>

        <!-- Summary text block -->
        <tr>
          <td style="padding:20px 40px;">
            <div style="font-size:13px;font-weight:600;color:#0B2340;margin-bottom:8px;">RESUMO COMPLETO DAS RESPOSTAS:</div>
            <pre style="background:#f1f5fb;border:1px solid #e2e8f0;border-radius:10px;padding:16px;font-family:'Courier New',Courier,monospace;font-size:12px;line-height:1.6;color:#1e293b;white-space:pre-wrap;word-break:break-word;">${summaryText}</pre>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:16px 40px 32px;text-align:center;color:#94a3b8;font-size:12px;">
            Enviado pelo Formulário Aprofundado ByeBets · ${new Date().toLocaleString("pt-BR")}
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

    try {
      const pdfBuffer = generateClientFormPDF(summaryText, clientData);
      const safeName = (clientData.nome || "cliente").toLowerCase().replace(/\s+/g, "_");

      const { error } = await resend.emails.send({
        from: "onboarding@resend.dev",
        to: [emailTo],
        subject: `[ByeBets Aprofundado] Form do Cliente — ${clientData.nome || "Cliente"} (${clientData.plataforma || "Bet"})`,
        html,
        attachments: [
          {
            filename: `formulario_${safeName}.pdf`,
            content: pdfBuffer,
          },
        ],
      });

      if (error) {
        console.error("Resend error:", error);
        // Don't fail — still try to save to DB
      }

      // Save to Supabase detailed_forms
      try {
        const db = getSupabase();
        await db.from("detailed_forms").insert({
          nome: clientData.nome || "",
          email: clientData.email || "",
          telefone: clientData.telefone || "",
          cidade_uf: [clientData.cidade, clientData.estado].filter(Boolean).join(" / "),
          plataforma: clientData.plataforma || "",
          summary_text: summaryText,
          form_data: formData || {},
        });
      } catch (dbErr) {
        console.error("Supabase detailed_forms insert error:", dbErr);
      }

      return { ok: true };
    } catch (err) {
      console.error("Erro ao enviar e-mail:", err);
      return { ok: false, error: "Falha ao enviar e-mail." };
    }
  });

