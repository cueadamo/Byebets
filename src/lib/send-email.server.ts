import { createServerFn } from "@tanstack/react-start";
import { Resend } from "resend";
import type { Answers } from "./scoring";

const LABELS: Record<string, string> = {
  perdeu_dinheiro: "Perdeu dinheiro em apostas?",
  plataforma: "Plataforma utilizada",
  valor_perdido: "Valor aproximado perdido",
  tempo_perda: "Tempo de perda",
  diagnostico: "Diagnóstico de ludopatia?",
  tratamento: "Em tratamento?",
  autoexclusao: "Pediu autoexclusão?",
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
  nome: "Nome completo",
  telefone: "Telefone / WhatsApp",
  cidade: "Cidade",
  estado: "Estado (UF)",
  email: "E-mail",
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
  nao_sei: "Não sei",
  talvez: "Talvez",
  em_andamento: "Em andamento",
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

    const rows = Object.entries(LABELS)
      .map(([key, label]) => {
        const val = answers[key];
        if (!val) return "";
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

      return { ok: true };
    } catch (err) {
      console.error("Erro ao enviar e-mail:", err);
      return { ok: false, error: "Falha ao enviar e-mail." };
    }
  });
