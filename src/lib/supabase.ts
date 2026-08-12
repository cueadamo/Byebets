import { createClient } from "@supabase/supabase-js";

// Public keys — safe to expose in client code (Supabase uses RLS for security)
const supabaseUrl =
  (import.meta.env.VITE_SUPABASE_URL as string | undefined) ||
  "https://oaqggasdboxxpfdhrube.supabase.co";

const supabaseAnonKey =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ||
  "sb_publishable_VHgAIGfz4_qSb-S6I0XO8A_lCqIkwko";

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
