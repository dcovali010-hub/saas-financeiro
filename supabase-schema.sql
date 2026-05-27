-- ============================================================
-- AgênciaSaaS — Schema Supabase
-- Execute este script no SQL Editor do Supabase
-- ============================================================

-- Clients
CREATE TABLE IF NOT EXISTS clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  company TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  total_orders INTEGER DEFAULT 0,
  total_spent DECIMAL(10,2) DEFAULT 0
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  client_id UUID REFERENCES clients(id),
  client_name TEXT NOT NULL,
  description TEXT NOT NULL,
  value DECIMAL(10,2) NOT NULL,
  status TEXT CHECK (status IN ('pendente','processando','concluido','cancelado')) DEFAULT 'pendente',
  module TEXT CHECK (module IN ('sales','website_mensal')) DEFAULT 'sales',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  due_date DATE
);

-- Domains
CREATE TABLE IF NOT EXISTS domains (
  id TEXT PRIMARY KEY,
  domain TEXT UNIQUE NOT NULL,
  client_id UUID REFERENCES clients(id),
  client_name TEXT NOT NULL,
  expiry_date DATE NOT NULL,
  status TEXT CHECK (status IN ('ativo','vencido','pendente','transferindo')) DEFAULT 'ativo',
  auto_renew BOOLEAN DEFAULT TRUE,
  registrar TEXT,
  price_yearly DECIMAL(10,2) DEFAULT 0
);

-- Hostings
CREATE TABLE IF NOT EXISTS hostings (
  id TEXT PRIMARY KEY,
  plan TEXT NOT NULL,
  client_id UUID REFERENCES clients(id),
  client_name TEXT NOT NULL,
  monthly_value DECIMAL(10,2) NOT NULL,
  expiry_date DATE NOT NULL,
  status TEXT CHECK (status IN ('ativo','suspenso','cancelado','pendente')) DEFAULT 'ativo',
  server TEXT NOT NULL,
  disk_usage INTEGER DEFAULT 0,
  disk_limit INTEGER DEFAULT 5120
);

-- Users (sistema)
CREATE TABLE IF NOT EXISTS system_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT CHECK (role IN ('admin','financeiro','suporte','vendedor')) DEFAULT 'vendedor',
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Generated Sites
CREATE TABLE IF NOT EXISTS generated_sites (
  id TEXT PRIMARY KEY,
  client_id UUID REFERENCES clients(id),
  client_name TEXT NOT NULL,
  site_name TEXT NOT NULL,
  business_type TEXT NOT NULL,
  domain TEXT,
  status TEXT CHECK (status IN ('rascunho','em_producao','publicado','pausado')) DEFAULT 'rascunho',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  url TEXT
);

-- WhatsApp Messages
CREATE TABLE IF NOT EXISTS whatsapp_messages (
  id TEXT PRIMARY KEY,
  contact TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT NOT NULL,
  direction TEXT CHECK (direction IN ('inbound','outbound')) NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  status TEXT CHECK (status IN ('sent','delivered','read','failed')) DEFAULT 'sent',
  type TEXT CHECK (type IN ('text','template','billing','followup')) DEFAULT 'text'
);

-- AI Agents
CREATE TABLE IF NOT EXISTS ai_agents (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  prompt TEXT NOT NULL,
  active BOOLEAN DEFAULT FALSE,
  triggers TEXT[] DEFAULT '{}',
  responses INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activity Logs
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id TEXT,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE hostings ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_agents ENABLE ROW LEVEL SECURITY;

-- Permissive policies (ajuste conforme necessidade de segurança)
CREATE POLICY "Allow all for authenticated" ON clients FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all for authenticated" ON orders FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all for authenticated" ON domains FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all for authenticated" ON hostings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all for authenticated" ON system_users FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all for authenticated" ON generated_sites FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all for authenticated" ON whatsapp_messages FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all for authenticated" ON ai_agents FOR ALL USING (auth.role() = 'authenticated');
