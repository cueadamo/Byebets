import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";

const TITLE = "ByeBets — Painel Administrativo de Leads";
const DESCRIPTION = "Gestão de leads da triagem e geração de links para formulário aprofundado do cliente.";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
    ],
  }),
  component: AdminPage,
});

interface LeadItem {
  id: string;
  dataCadastro: string;
  nome: string;
  telefone: string;
  email: string;
  cidadeUf: string;
  plataforma: string;
  valorPerdido: string;
  tempoPerda: string;
  score: number;
  tier: "prioritario" | "analise" | "informativo";
  status: "Novo" | "Link Enviado" | "Em Análise" | "Concluído";
}

const INITIAL_DEMO_LEADS: LeadItem[] = [
  {
    id: "lead-1",
    dataCadastro: "12/08/2026 17:30",
    nome: "Fabio Duran",
    telefone: "11930074841",
    email: "fabioduran1503@gmail.com",
    cidadeUf: "São Bernardo do Campo / SP",
    plataforma: "Esportes da Sorte",
    valorPerdido: "R$ 50.000 a R$ 100.000",
    tempoPerda: "1 a 6 meses",
    score: 85,
    tier: "prioritario",
    status: "Novo",
  },
  {
    id: "lead-2",
    dataCadastro: "12/08/2026 16:15",
    nome: "Carlos Eduardo Silva",
    telefone: "11988887777",
    email: "carlos.silva@email.com",
    cidadeUf: "São Paulo / SP",
    plataforma: "Bet365",
    valorPerdido: "R$ 20.000 a R$ 50.000",
    tempoPerda: "6 meses a 1 ano",
    score: 65,
    tier: "analise",
    status: "Link Enviado",
  },
  {
    id: "lead-3",
    dataCadastro: "12/08/2026 14:00",
    nome: "Mariana Souza",
    telefone: "21977776666",
    email: "mariana.souza@email.com",
    cidadeUf: "Rio de Janeiro / RJ",
    plataforma: "Betano",
    valorPerdido: "R$ 5.000 a R$ 20.000",
    tempoPerda: "Menos de 30 dias",
    score: 40,
    tier: "informativo",
    status: "Novo",
  },
];

function AdminPage() {
  const [pinInput, setPinInput] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinError, setPinError] = useState(false);

  const [leads, setLeads] = useState<LeadItem[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("byebets_admin_leads");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // fallback
        }
      }
    }
    return INITIAL_DEMO_LEADS;
  });

  const [searchFilter, setSearchFilter] = useState("");
  const [tierFilter, setTierFilter] = useState<string>("todos");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modal Novo Lead State
  const [isAddingLead, setIsAddingLead] = useState(false);
  const [newLead, setNewLead] = useState({
    nome: "",
    telefone: "",
    email: "",
    cidadeUf: "",
    plataforma: "",
    valorPerdido: "R$ 50.000 a R$ 100.000",
    tempoPerda: "1 a 6 meses",
    score: 75,
    tier: "prioritario" as const,
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("byebets_admin_leads", JSON.stringify(leads));
    }
  }, [leads]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === "1234" || pinInput.trim() === "byebets2026") {
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleAddLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const created: LeadItem = {
      id: "lead-" + Date.now(),
      dataCadastro: new Date().toLocaleString("pt-BR"),
      nome: newLead.nome,
      telefone: newLead.telefone,
      email: newLead.email,
      cidadeUf: newLead.cidadeUf,
      plataforma: newLead.plataforma,
      valorPerdido: newLead.valorPerdido,
      tempoPerda: newLead.tempoPerda,
      score: Number(newLead.score) || 50,
      tier: newLead.tier,
      status: "Novo",
    };

    setLeads([created, ...leads]);
    setIsAddingLead(false);
    setNewLead({
      nome: "",
      telefone: "",
      email: "",
      cidadeUf: "",
      plataforma: "",
      valorPerdido: "R$ 50.000 a R$ 100.000",
      tempoPerda: "1 a 6 meses",
      score: 75,
      tier: "prioritario",
    });
  };

  const generateDeepFormUrl = (lead: LeadItem) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://byebets.vercel.app";
    const params = new URLSearchParams({
      nome: lead.nome,
      tel: lead.telefone,
      email: lead.email,
      cidade: lead.cidadeUf,
      plataforma: lead.plataforma,
      valor: lead.valorPerdido,
      tempo: lead.tempoPerda,
    });
    return `${origin}/cliente?${params.toString()}`;
  };

  const handleCopyLink = (lead: LeadItem) => {
    const url = generateDeepFormUrl(lead);
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(lead.id);
      setTimeout(() => setCopiedId(null), 3000);
    });
  };

  const handleOpenWhatsApp = (lead: LeadItem) => {
    const url = generateDeepFormUrl(lead);
    const cleanPhone = lead.telefone.replace(/\D/g, "");
    const formattedPhone = cleanPhone.startsWith("55") ? cleanPhone : `55${cleanPhone}`;
    const msg = `Olá, ${lead.nome}! Para darmos sequência à análise do seu caso sobre as perdas na plataforma ${lead.plataforma}, por favor preencha o formulário aprofundado no link abaixo:\n\n${url}`;
    const waUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, "_blank");
  };

  const updateLeadStatus = (id: string, status: LeadItem["status"]) => {
    setLeads(leads.map((l) => (l.id === id ? { ...l, status } : l)));
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

  // LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0B2340] px-6 py-12 text-white">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-md shadow-2xl">
          <div className="text-center">
            <img src="/logo.png" alt="ByeBets" className="mx-auto h-12 w-auto brightness-0 invert" />
            <h1 className="mt-4 font-serifDisplay text-2xl font-semibold">Painel Administrativo</h1>
            <p className="mt-1 text-xs text-white/70">
              Digite a senha de acesso para visualizar a gestão de clientes.
            </p>
          </div>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#B98B3E]">
                Senha de Acesso PIN
              </label>
              <input
                type="password"
                required
                placeholder="Senha (padrão: 1234)"
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

          <p className="mt-6 text-center text-[11px] text-white/40">
            Dica: a senha padrão de demonstração é <strong className="text-white/80">1234</strong>.
          </p>
        </div>
      </div>
    );
  }

  // ADMIN DASHBOARD SCREEN
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B]">
      {/* Header Bar */}
      <header className="sticky top-0 z-40 border-b border-[#E2E8F0] bg-[#0B2340] px-6 py-4 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center">
              <img src="/logo.png" alt="ByeBets" className="h-10 w-auto brightness-0 invert" />
            </Link>
            <span className="hidden rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-[#B98B3E] sm:inline-block">
              Portal da Equipe Jurídica
            </span>
          </div>

          <div className="flex items-center gap-3">
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

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-serifDisplay text-2xl font-semibold text-[#0B2340] sm:text-3xl">
              Gestão de Clientes e Links
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-[#64748B]">
              Selecione o cliente para copiar o link exclusivo do formulário aprofundado ou enviar diretamente pelo WhatsApp.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-full bg-[#0B2340]/10 px-3 py-1.5 text-xs font-bold text-[#0B2340]">
              Total: {leads.length} clientes
            </span>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
          <div className="flex flex-1 items-center gap-3 min-w-[240px]">
            <span className="text-xs text-[#64748B]">🔍</span>
            <input
              type="text"
              placeholder="Buscar por nome, telefone, e-mail ou bet..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full text-sm text-[#1E293B] focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#64748B]">Classificação:</span>
            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className="rounded-lg border border-[#CBD5E1] bg-white px-3 py-1.5 text-xs font-medium text-[#1E293B] focus:outline-none"
            >
              <option value="todos">Todas</option>
              <option value="prioritario">🔴 Prioritário</option>
              <option value="analise">🟡 Em Análise</option>
              <option value="informativo">🟢 Informativo</option>
            </select>
          </div>
        </div>

        {/* Leads Table */}
        <div className="mt-6 overflow-x-auto rounded-2xl border border-[#E2E8F0] bg-white shadow-sm">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
              <tr>
                <th className="px-5 py-4">Cliente</th>
                <th className="px-5 py-4">Contato / Local</th>
                <th className="px-5 py-4">Plataforma & Perda</th>
                <th className="px-5 py-4">Classificação</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Ações p/ Formulário</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {filteredLeads.map((lead) => {
                const isPrioritario = lead.tier === "prioritario";
                const isAnalise = lead.tier === "analise";

                return (
                  <tr key={lead.id} className="hover:bg-[#F8FAFC]/80 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-semibold text-[#0B2340] text-sm">{lead.nome}</div>
                      <div className="text-[11px] text-[#94A3B8]">{lead.dataCadastro}</div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="text-[#334155] font-medium">{lead.telefone}</div>
                      <div className="text-[#64748B] text-xs">{lead.email}</div>
                      <div className="text-[#94A3B8] text-[11px]">{lead.cidadeUf}</div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="font-semibold text-[#0B2340]">{lead.plataforma}</div>
                      <div className="text-xs text-[#64748B]">{lead.valorPerdido}</div>
                      <div className="text-[11px] text-[#94A3B8]">Tempo: {lead.tempoPerda}</div>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                          isPrioritario
                            ? "bg-red-100 text-red-700"
                            : isAnalise
                              ? "bg-amber-100 text-amber-800"
                              : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        <span className="h-1.5 w-1.5 rounded-full fill-current" />
                        {isPrioritario ? "Prioritário" : isAnalise ? "Em Análise" : "Informativo"}{" "}
                        ({lead.score} pts)
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <select
                        value={lead.status}
                        onChange={(e) =>
                          updateLeadStatus(lead.id, e.target.value as LeadItem["status"])
                        }
                        className="rounded-md border border-[#CBD5E1] bg-white px-2 py-1 text-xs font-medium text-[#334155]"
                      >
                        <option value="Novo">Novo</option>
                        <option value="Link Enviado">Link Enviado</option>
                        <option value="Em Análise">Em Análise</option>
                        <option value="Concluído">Concluído</option>
                      </select>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            handleCopyLink(lead);
                            updateLeadStatus(lead.id, "Link Enviado");
                          }}
                          className="rounded-lg border border-[#CBD5E1] bg-white px-3 py-1.5 text-xs font-semibold text-[#0B2340] shadow-sm hover:bg-[#F1F5F9]"
                        >
                          {copiedId === lead.id ? "✓ Copiado!" : "🔗 Copiar Link"}
                        </button>

                        <button
                          onClick={() => {
                            handleOpenWhatsApp(lead);
                            updateLeadStatus(lead.id, "Link Enviado");
                          }}
                          className="rounded-lg bg-[#25D366] px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-[#20bd5a]"
                        >
                          💬 WhatsApp
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredLeads.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-sm text-[#94A3B8]">
                    Nenhum cliente encontrado com os filtros selecionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Modal Add Lead */}
      {isAddingLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-xs">
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
                    value={newLead.cidadeUf}
                    onChange={(e) => setNewLead({ ...newLead, cidadeUf: e.target.value })}
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
                  <label className="block text-xs font-bold text-[#0B2340]">Faixa de Perda</label>
                  <input
                    type="text"
                    placeholder="ex: R$ 50.000 a R$ 100.000"
                    value={newLead.valorPerdido}
                    onChange={(e) => setNewLead({ ...newLead, valorPerdido: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-[#CBD5E1] p-2.5 text-xs focus:outline-none focus:border-[#0B2340]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0B2340]">Classificação</label>
                  <select
                    value={newLead.tier}
                    onChange={(e) =>
                      setNewLead({ ...newLead, tier: e.target.value as LeadItem["tier"] })
                    }
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
