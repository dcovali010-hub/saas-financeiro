# Como Rodar o AgênciaSaaS

## 1. Instalar Node.js

Baixe e instale o Node.js LTS em: https://nodejs.org

Verifique a instalação:
```
node --version
npm --version
```

## 2. Instalar dependências

Abra o terminal na pasta do projeto e execute:
```
cd C:\Users\dougl\Documents\saas-financeiro
npm install
```

## 3. Rodar em desenvolvimento

```
npm run dev
```

Acesse: http://localhost:3000

## 4. Login de demonstração

Senha para todos os usuários: **123456**

| Usuário         | Email                    | Função         |
|-----------------|--------------------------|----------------|
| Douglas Admin   | admin@agencia.com        | Administrador  |
| Ana Financeiro  | financeiro@agencia.com   | Financeiro     |
| Carlos Suporte  | suporte@agencia.com      | Suporte        |
| Julia Vendas    | vendedor@agencia.com     | Vendedor       |

## 5. Configurar Supabase (opcional)

1. Crie uma conta em https://supabase.com
2. Crie um novo projeto
3. Vá em SQL Editor e execute o conteúdo de `supabase-schema.sql`
4. Copie `.env.local.example` para `.env.local`
5. Preencha com suas credenciais do Supabase

## 6. Build para produção

```
npm run build
npm start
```
