import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { supabase, type Lead, type DetailedForm } from "@/lib/supabase";
import { generateClientFormPDF } from "@/lib/pdf-generator";
import { Logo } from "@/components/Logo";

const TITLE = "ByeBets — Painel Administrativo de Leads";
const DESCRIPTION =
  "Gestão de leads da triagem e geração de links para formulário aprofundado do cliente.";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const [pinInput, setPinInput] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinError, setPinError] = useState(false);

  const [activeTab, setActiveTab] = useState<"leads" | "forms">("leads");

  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);

  const [detailedForms, setDetailedForms] = useState<DetailedForm[]>([]);
  const [formsLoading, setFormsLoading] = useState(false);

  const [searchFilter, setSearchFilter] = useState("");
  const [tierFilter, setTierFilter] = useState<string>("todos");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modal Novo Lead
  const [isAddingLead, setIsAddingLead] = useState(false);
  const [newLead, setNewLead] = useState({
    nome: "",
    telefone: "",
    email: "",
    cidade_uf: "",
    plataforma: "",
    valor_perdido: "",
    tempo_perda: "",
    score: 50,
    tier: "analise" as Lead["tier"],
  });

  // Load leads from Supabase
  const fetchLeads = async () => {
    setLoading(true);
    setDbError(null);
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase fetch error:", error);
      setDbError("Não foi possível carregar os leads. Verifique a conexão com o banco.");
    } else {
      setLeads((data as Lead[]) || []);
    }
    setLoading(false);
  };

  const fetchDetailedForms = async () => {
    setFormsLoading(true);
    const { data, error } = await supabase
      .from("detailed_forms")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase detailed_forms fetch error:", error);
    } else {
      setDetailedForms((data as DetailedForm[]) || []);
    }
    setFormsLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchLeads();
      fetchDetailedForms();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === "1234" || pinInput.trim() === "byebets2026") {
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleAddLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from("leads")
      .insert({
        nome: newLead.nome,
        telefone: newLead.telefone,
        email: newLead.email,
        cidade_uf: newLead.cidade_uf,
        plataforma: newLead.plataforma,
        valor_perdido: newLead.valor_perdido,
        tempo_perda: newLead.tempo_perda,
        score: Number(newLead.score) || 50,
        tier: newLead.tier,
        status: "Novo",
        answers: {},
      })
      .select()
      .single();

    if (error) {
      alert("Erro ao salvar cliente: " + error.message);
      return;
    }

    if (data) {
      setLeads([data as Lead, ...leads]);
    }

    setIsAddingLead(false);
    setNewLead({
      nome: "",
      telefone: "",
      email: "",
      cidade_uf: "",
      plataforma: "",
      valor_perdido: "",
      tempo_perda: "",
      score: 50,
      tier: "analise",
    });
  };

  const generateDeepFormUrl = (lead: Lead) => {
    const origin =
      typeof window !== "undefined" ? window.location.origin : "https://byebets.vercel.app";
    const answers = (lead.answers as Record<string, string>) || {};
    const params = new URLSearchParams({
      nome: lead.nome,
      tel: lead.telefone,
      email: lead.email,
      cidade: lead.cidade_uf,
      plataforma: lead.plataforma,
      valor: lead.valor_perdido,
      tempo: lead.tempo_perda,
      // Campos extras da triagem
      diagnostico: answers.diagnostico || "",
      tratamento: answers.tratamento || "",
      autoexclusao: answers.autoexclusao || "",
    });
    return `${origin}/cliente?${params.toString()}`;
  };

  const handleCopyLink = (lead: Lead) => {
    const url = generateDeepFormUrl(lead);
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(lead.id!);
      setTimeout(() => setCopiedId(null), 3000);
      updateLeadStatus(lead, "Link Enviado");
    });
  };

  const handleOpenWhatsApp = (lead: Lead) => {
    const url = generateDeepFormUrl(lead);
    const cleanPhone = lead.telefone.replace(/\D/g, "");
    const formattedPhone = cleanPhone.startsWith("55") ? cleanPhone : `55${cleanPhone}`;
    const msg = `Olá, ${lead.nome}! Para darmos sequência à análise do seu caso sobre as perdas na plataforma ${lead.plataforma}, por favor preencha o formulário aprofundado no link abaixo:\n\n${url}`;
    window.open(`https://wa.me/${formattedPhone}?text=${encodeURIComponent(msg)}`, "_blank");
    updateLeadStatus(lead, "Link Enviado");
  };

  const updateLeadStatus = async (lead: Lead, status: Lead["status"]) => {
    // Optimistic update
    setLeads((prev) => prev.map((l) => (l.id === lead.id ? { ...l, status } : l)));

    const { error } = await supabase
      .from("leads")
      .update({ status })
      .eq("id", lead.id!);

    if (error) {
      console.error("Failed to update status:", error);
      // Revert on failure
      setLeads((prev) => prev.map((l) => (l.id === lead.id ? { ...l, status: lead.status } : l)));
    }
  };

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchSearch =
        searchFilter.trim() === "" ||
        lead.nome.toLowerCase().includes(searchFilter.toLowerCase()) ||
        lead.telefone.includes(searchFilter) ||
        lead.email.toLowerCase().includes(searchFilter.toLowerCase()) ||
        lead.plataforma.toLowerCase().includes(searchFilter.toLowerCase());

      const matchTier = tierFilter === "todos" || lead.tier === tierFilter;

      return matchSearch && matchTier;
    });
  }, [leads, searchFilter, tierFilter]);

  const tierLabel = (tier: Lead["tier"]) => {
    if (tier === "prioritario") return "🔴 Prioritário";
    if (tier === "analise") return "🟡 Em Análise";
    return "🟢 Informativo";
  };

  const tierBg = (tier: Lead["tier"]) => {
    if (tier === "prioritario") return "bg-red-100 text-red-700";
    if (tier === "analise") return "bg-amber-100 text-amber-800";
    return "bg-emerald-100 text-emerald-700";
  };

  const formatDate = (iso?: string) => {
    if (!iso) return "-";
    return new Date(iso).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
  };

  // ─── LOGIN SCREEN ─────────────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0B2340] px-6 py-12 text-white">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-md shadow-2xl">
          <div className="text-center">
            <Link to="/" className="inline-block">
              <Logo variant="light" className="mx-auto h-12 w-auto" />
            </Link>
            <h1 className="mt-4 font-serifDisplay text-2xl font-semibold">Painel Administrativo</h1>
            <p className="mt-1 text-xs text-white/70">
              Digite a senha de acesso para visualizar a gestão de clientes.
            </p>
          </div>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#B98B3E]">
                Senha de acesso
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-white/20 bg-black/20 px-4 py-3 text-sm text-white placeholder-white/40 focus:border-[#B98B3E] focus:outline-none"
              />
            </div>

            {pinError && (
              <p className="text-xs font-semibold text-red-400 text-center">
                Senha incorreta. Tente novamente.
              </p>
            )}

            <button
              type="submit"
              className="w-full rounded-full bg-[#B98B3E] px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#a3792f]"
            >
              Acessar Painel →
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ─── ADMIN DASHBOARD ──────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B]">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-[#E2E8F0] bg-[#0B2340] px-6 py-4 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center">
              <Logo variant="light" className="h-10 w-auto" />
            </Link>
            <span className="hidden rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-[#B98B3E] sm:inline-block">
              Portal da Equipe Jurídica
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchLeads}
              disabled={loading}
              className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-medium text-white hover:bg-white/10 disabled:opacity-50"
            >
              {loading ? "Carregando..." : "⟳ Atualizar"}
            </button>
            <button
              onClick={() => setIsAddingLead(true)}
              className="rounded-full bg-[#B98B3E] px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-[#a3792f]"
            >
              + Novo Cliente
            </button>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-medium text-white hover:bg-white/10"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-serifDisplay text-2xl font-semibold text-[#0B2340] sm:text-3xl">
              {activeTab === "leads" ? "Gestão de Clientes" : "Formulários Aprofundados"}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-[#64748B]">
              {activeTab === "leads"
                ? "Leads da triagem gratuita. Clique em \"WhatsApp\" para enviar o link do formulário aprofundado."
                : "Clientes que preencheram o formulário completo. Gere o PDF para cada um."}
            </p>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-3">
            <span className="rounded-full bg-[#0B2340]/10 px-3 py-1.5 text-xs font-bold text-[#0B2340]">
              {activeTab === "leads" ? `Total: ${leads.length}` : `Formulários: ${detailedForms.length}`}
            </span>
            {activeTab === "leads" && (
              <>
                <span className="rounded-full bg-red-100 px-3 py-1.5 text-xs font-bold text-red-700">
                  🔴 {leads.filter((l) => l.tier === "prioritario").length} Prioritários
                </span>
                <span className="rounded-full bg-amber-100 px-3 py-1.5 text-xs font-bold text-amber-800">
                  🟡 {leads.filter((l) => l.tier === "analise").length} Em Análise
                </span>
              </>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-6 flex gap-1 rounded-xl bg-[#E2E8F0] p-1 w-fit">
          <button
            onClick={() => setActiveTab("leads")}
            className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
              activeTab === "leads"
                ? "bg-white text-[#0B2340] shadow-sm"
                : "text-[#64748B] hover:text-[#0B2340]"
            }`}
          >
            👥 Triagem ({leads.length})
          </button>
          <button
            onClick={() => setActiveTab("forms")}
            className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
              activeTab === "forms"
                ? "bg-white text-[#0B2340] shadow-sm"
                : "text-[#64748B] hover:text-[#0B2340]"
            }`}
          >
            📋 Formulários ({detailedForms.length})
          </button>
        </div>

        {/* ── TAB: LEADS ── */}
        {activeTab === "leads" && (
          <>
            {/* Filters */}
            <div className="mt-4 flex flex-wrap items-center gap-4 rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
              <input
                type="text"
                placeholder="🔍  Buscar por nome, telefone, e-mail ou plataforma..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="flex-1 min-w-[240px] text-sm text-[#1E293B] focus:outline-none"
              />
              <select
                value={tierFilter}
                onChange={(e) => setTierFilter(e.target.value)}
                className="rounded-lg border border-[#CBD5E1] bg-white px-3 py-1.5 text-xs font-medium text-[#1E293B] focus:outline-none"
              >
                <option value="todos">Todas as classificações</option>
                <option value="prioritario">🔴 Prioritário</option>
                <option value="analise">🟡 Em Análise</option>
                <option value="informativo">🟢 Informativo</option>
              </select>
            </div>

            {/* Error State */}
            {dbError && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                ⚠️ {dbError}
              </div>
            )}


        {/* Table */}
        <div className="mt-6 overflow-x-auto rounded-2xl border border-[#E2E8F0] bg-white shadow-sm">
          {loading && leads.length === 0 ? (
            <div className="py-16 text-center text-sm text-[#94A3B8]">
              Carregando clientes do banco de dados…
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-lg font-serifDisplay text-[#0B2340]">Nenhum cliente encontrado</p>
              <p className="mt-1 text-sm text-[#94A3B8]">
                {leads.length === 0
                  ? "Os clientes que preencherem a triagem aparecerão aqui automaticamente."
                  : "Tente ajustar os filtros de busca."}
              </p>
            </div>
          ) : (
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                <tr>
                  <th className="px-5 py-4">Cliente</th>
                  <th className="px-5 py-4">Contato</th>
                  <th className="px-5 py-4">Plataforma & Perda</th>
                  <th className="px-5 py-4">Classificação</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-[#F8FAFC]/80 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-semibold text-[#0B2340] text-sm">{lead.nome}</div>
                      <div className="text-[11px] text-[#94A3B8]">{formatDate(lead.created_at)}</div>
                      <div className="text-[11px] text-[#94A3B8]">{lead.cidade_uf}</div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="text-[#334155] font-medium">{lead.telefone}</div>
                      <div className="text-[#64748B] text-xs">{lead.email}</div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="font-semibold text-[#0B2340]">{lead.plataforma}</div>
                      <div className="text-xs text-[#64748B]">{lead.valor_perdido}</div>
                      <div className="text-[11px] text-[#94A3B8]">{lead.tempo_perda}</div>
                    </td>

                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${tierBg(lead.tier)}`}>
                        {tierLabel(lead.tier)} ({lead.score} pts)
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <select
                        value={lead.status}
                        onChange={(e) => updateLeadStatus(lead, e.target.value as Lead["status"])}
                        className="rounded-md border border-[#CBD5E1] bg-white px-2 py-1 text-xs font-medium text-[#334155]"
                      >
                        <option>Novo</option>
                        <option>Link Enviado</option>
                        <option>Em Análise</option>
                        <option>Concluído</option>
                      </select>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleCopyLink(lead)}
                          className="rounded-lg border border-[#CBD5E1] bg-white px-3 py-1.5 text-xs font-semibold text-[#0B2340] shadow-sm hover:bg-[#F1F5F9]"
                        >
                          {copiedId === lead.id ? "✓ Copiado!" : "🔗 Copiar Link"}
                        </button>
                        <button
                          onClick={() => handleOpenWhatsApp(lead)}
                          className="rounded-lg bg-[#25D366] px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-[#20bd5a]"
                        >
                          💬 WhatsApp
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
          </>
        )}

        {/* ── TAB: FORMULÁRIOS APROFUNDADOS ── */}
        {activeTab === "forms" && (
          <div className="mt-4">
            {formsLoading ? (
              <div className="py-16 text-center text-sm text-[#94A3B8]">
                Carregando formulários do banco de dados…
              </div>
            ) : detailedForms.length === 0 ? (
              <div className="py-16 text-center rounded-2xl border border-[#E2E8F0] bg-white">
                <p className="text-lg font-serifDisplay text-[#0B2340]">Nenhum formulário preenchido ainda</p>
                <p className="mt-1 text-sm text-[#94A3B8]">
                  Os formulários aprofundados preenchidos pelos clientes aparecerão aqui.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {detailedForms.map((form) => (
                  <div
                    key={form.id}
                    className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0B2340]/10 text-sm font-bold text-[#0B2340]">
                            {(form.nome || "?")[0].toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-[#0B2340]">{form.nome || "—"}</div>
                            <div className="text-xs text-[#64748B]">
                              {form.telefone} · {form.email}
                            </div>
                          </div>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2 text-xs">
                          <span className="rounded-full bg-[#F1F5F9] px-2.5 py-1 font-medium text-[#334155]">
                            🎰 {form.plataforma || "—"}
                          </span>
                          <span className="rounded-full bg-[#F1F5F9] px-2.5 py-1 font-medium text-[#334155]">
                            📍 {form.cidade_uf || "—"}
                          </span>
                          <span className="rounded-full bg-[#F1F5F9] px-2.5 py-1 font-medium text-[#334155]">
                            🕐 {formatDate(form.created_at)}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            const parts = (form.cidade_uf || "").split("/");
                            const pdfBuffer = generateClientFormPDF(form.summary_text || "", {
                              nome: form.nome || "",
                              email: form.email || "",
                              telefone: form.telefone || "",
                              cidade: parts[0]?.trim() || "",
                              estado: parts[1]?.trim() || "",
                              plataforma: form.plataforma || "",
                            });
                            const blob = new Blob([pdfBuffer], { type: "application/pdf" });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement("a");
                            a.href = url;
                            a.download = `formulario_${(form.nome || "cliente").toLowerCase().replace(/\s+/g, "_")}.pdf`;
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                            URL.revokeObjectURL(url);
                          }}
                          className="rounded-lg bg-[#0B2340] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#14335C] flex items-center gap-1.5"
                        >
                          📄 Gerar PDF
                        </button>
                      </div>
                    </div>

                    {/* Summary Preview */}
                    {form.summary_text && (
                      <details className="mt-3">
                        <summary className="cursor-pointer text-xs font-semibold text-[#64748B] hover:text-[#0B2340]">
                          Ver resumo das respostas ▾
                        </summary>
                        <pre className="mt-2 max-h-48 overflow-y-auto rounded-lg bg-[#F8FAFC] p-3 text-[10px] leading-relaxed text-[#334155] whitespace-pre-wrap">
                          {form.summary_text}
                        </pre>
                      </details>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>

      {/* Modal Add Lead */}
      {isAddingLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="font-serifDisplay text-xl font-semibold text-[#0B2340]">
              Cadastrar Novo Cliente
            </h3>
            <p className="text-xs text-[#64748B] mt-1">
              Preencha os dados da triagem para gerar o link exclusivo do formulário aprofundado.
            </p>

            <form onSubmit={handleAddLeadSubmit} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#0B2340]">Nome completo</label>
                <input
                  type="text"
                  required
                  placeholder="Nome do cliente"
                  value={newLead.nome}
                  onChange={(e) => setNewLead({ ...newLead, nome: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-[#CBD5E1] p-2.5 text-xs focus:outline-none focus:border-[#0B2340]"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-[#0B2340]">Telefone / WhatsApp</label>
                  <input
                    type="text"
                    required
                    placeholder="(11) 99999-9999"
                    value={newLead.telefone}
                    onChange={(e) => setNewLead({ ...newLead, telefone: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-[#CBD5E1] p-2.5 text-xs focus:outline-none focus:border-[#0B2340]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0B2340]">E-mail</label>
                  <input
                    type="email"
                    required
                    placeholder="email@cliente.com"
                    value={newLead.email}
                    onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-[#CBD5E1] p-2.5 text-xs focus:outline-none focus:border-[#0B2340]"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-[#0B2340]">Cidade / UF</label>
                  <input
                    type="text"
                    placeholder="Cidade / SP"
                    value={newLead.cidade_uf}
                    onChange={(e) => setNewLead({ ...newLead, cidade_uf: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-[#CBD5E1] p-2.5 text-xs focus:outline-none focus:border-[#0B2340]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0B2340]">Plataforma</label>
                  <input
                    type="text"
                    required
                    placeholder="ex: Esportes da Sorte"
                    value={newLead.plataforma}
                    onChange={(e) => setNewLead({ ...newLead, plataforma: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-[#CBD5E1] p-2.5 text-xs focus:outline-none focus:border-[#0B2340]"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-[#0B2340]">Faixa de perda</label>
                  <input
                    type="text"
                    placeholder="ex: R$ 50.000 a R$ 100.000"
                    value={newLead.valor_perdido}
                    onChange={(e) => setNewLead({ ...newLead, valor_perdido: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-[#CBD5E1] p-2.5 text-xs focus:outline-none focus:border-[#0B2340]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0B2340]">Classificação</label>
                  <select
                    value={newLead.tier}
                    onChange={(e) => setNewLead({ ...newLead, tier: e.target.value as Lead["tier"] })}
                    className="mt-1 w-full rounded-lg border border-[#CBD5E1] p-2.5 text-xs focus:outline-none focus:border-[#0B2340]"
                  >
                    <option value="prioritario">🔴 Prioritário</option>
                    <option value="analise">🟡 Em Análise</option>
                    <option value="informativo">🟢 Informativo</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddingLead(false)}
                  className="rounded-lg border border-[#CBD5E1] px-4 py-2 text-xs font-medium text-[#64748B]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#0B2340] px-4 py-2 text-xs font-semibold text-white"
                >
                  Salvar Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
