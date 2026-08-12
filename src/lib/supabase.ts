import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase env vars not found. Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Lead type matching our DB schema
export interface Lead {
  id?: string;
  created_at?: string;
  nome: string;
  telefone: string;
  email: string;
  cidade_uf: string;
  plataforma: string;
  valor_perdido: string;
  tempo_perda: string;
  score: number;
  tier: "prioritario" | "analise" | "informativo";
  status: "Novo" | "Link Enviado" | "Em Análise" | "Concluído";
  answers?: Record<string, string>;
}

export interface DetailedForm {
  id?: string;
  created_at?: string;
  lead_id?: string;
  nome: string;
  email: string;
  telefone: string;
  cidade_uf: string;
  plataforma: string;
  summary_text: string;
  form_data?: Record<string, unknown>;
}
