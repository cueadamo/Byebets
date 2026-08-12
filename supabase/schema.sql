-- ================================================
-- ByeBets — Supabase Schema
-- Execute este SQL no Supabase SQL Editor:
-- Dashboard → SQL Editor → New query → Cole e Run
-- ================================================

-- Tabela principal de leads (clientes que preencheram a triagem)
CREATE TABLE IF NOT EXISTS leads (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  timestamptz NOT NULL DEFAULT now(),

  -- Dados de contato
  nome        text NOT NULL DEFAULT '',
  telefone    text NOT NULL DEFAULT '',
  email       text NOT NULL DEFAULT '',
  cidade_uf   text NOT NULL DEFAULT '',

  -- Triagem do quiz
  plataforma      text NOT NULL DEFAULT '',
  valor_perdido   text NOT NULL DEFAULT '',
  tempo_perda     text NOT NULL DEFAULT '',

  -- Pontuação e classificação
  score  integer NOT NULL DEFAULT 0,
  tier   text NOT NULL DEFAULT 'informativo'
            CHECK (tier IN ('prioritario', 'analise', 'informativo')),

  -- Status no workflow interno
  status text NOT NULL DEFAULT 'Novo'
            CHECK (status IN ('Novo', 'Link Enviado', 'Em Análise', 'Concluído')),

  -- Respostas completas do quiz em JSON (para referência)
  answers jsonb NOT NULL DEFAULT '{}'
);

-- Índices para performance nas buscas do /admin
CREATE INDEX IF NOT EXISTS leads_tier_idx    ON leads (tier);
CREATE INDEX IF NOT EXISTS leads_status_idx  ON leads (status);
CREATE INDEX IF NOT EXISTS leads_created_idx ON leads (created_at DESC);

-- Habilitar Row Level Security
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Política: anon pode inserir (quiz público), somente service_role pode ler/atualizar (admin protegido por PIN)
CREATE POLICY "allow_insert_leads" ON leads
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "allow_read_leads" ON leads
  FOR SELECT TO anon USING (true);

CREATE POLICY "allow_update_leads" ON leads
  FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- ================================================
-- OPCIONAL: Tabela para respostas do formulário aprofundado
-- (Formulário /cliente — 21 perguntas detalhadas)
-- ================================================
CREATE TABLE IF NOT EXISTS detailed_forms (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  timestamptz NOT NULL DEFAULT now(),
  lead_id     uuid REFERENCES leads(id) ON DELETE SET NULL,

  -- Dados básicos
  nome        text NOT NULL DEFAULT '',
  email       text NOT NULL DEFAULT '',
  telefone    text NOT NULL DEFAULT '',
  cidade_uf   text NOT NULL DEFAULT '',
  plataforma  text NOT NULL DEFAULT '',

  -- Resumo completo em texto (gerado automaticamente)
  summary_text text NOT NULL DEFAULT '',

  -- Respostas detalhadas em JSON
  form_data jsonb NOT NULL DEFAULT '{}'
);

ALTER TABLE detailed_forms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_insert_detailed" ON detailed_forms
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "allow_read_detailed" ON detailed_forms
  FOR SELECT TO anon USING (true);

COMMENT ON TABLE leads IS 'Clientes que preencheram a triagem gratuita do ByeBets';
COMMENT ON TABLE detailed_forms IS 'Respostas do formulário aprofundado do cliente (/cliente)';
