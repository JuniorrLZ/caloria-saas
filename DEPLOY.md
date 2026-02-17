# Caloria.AI — Vercel Deploy Guide

## ✅ Pre-requisitos

Antes de fazer deploy, certifique-se de que tem:
- Uma conta na [Vercel](https://vercel.com)
- Um projeto no [Supabase](https://supabase.com)
- Uma conta no [Stripe](https://dashboard.stripe.com)

---

## 📁 Estrutura dos Arquivos Criados/Alterados

| Arquivo | Descrição |
|---------|-----------|
| `src/lib/utils.ts` | Utilitário `getBaseUrl()` – resolve URL dinamicamente |
| `src/lib/stripe.ts` | Singleton lazy do Stripe SDK (server-side) |
| `src/lib/supabase.ts` | Singleton lazy do Supabase client |
| `src/app/api/webhooks/stripe/route.ts` | Endpoint de webhook do Stripe |
| `.env.example` | Template de todas as variáveis de ambiente |
| `.gitignore` | Atualizado para permitir `.env.example` no git |

---

## 🚀 Checklist de Deploy na Vercel

### 1. Conectar Repositório
1. Faça push do projeto para o GitHub/GitLab/Bitbucket
2. Na Vercel, clique em **"New Project"**
3. Importe o repositório
4. **Root Directory**: selecione `caloria-saas` (se o repo tem mais pastas)
5. **Framework Preset**: Next.js (detectado automaticamente)
6. **Build Command**: `npm run build` (padrão)
7. **Output Directory**: `.next` (padrão)

### 2. Configurar Variáveis de Ambiente na Vercel

Vá em **Settings > Environment Variables** e adicione:

| Variável | Onde encontrar | Escopo |
|----------|---------------|--------|
| `NEXT_PUBLIC_BASE_URL` | Seu domínio custom (ex: `https://caloria.ai`) | Production |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase > Settings > API | All |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase > Settings > API | All |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase > Settings > API | All |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe > Developers > API Keys | All |
| `STRIPE_SECRET_KEY` | Stripe > Developers > API Keys | All |
| `STRIPE_WEBHOOK_SECRET` | Stripe > Developers > Webhooks (ver passo 3) | All |

> ⚠️ **Nota:** `VERCEL_URL` é injetado automaticamente pela Vercel. Não precisa configurar.

### 3. Configurar Webhook do Stripe (Produção)

1. Acesse [Stripe Dashboard > Developers > Webhooks](https://dashboard.stripe.com/webhooks)
2. Clique em **"Add endpoint"**
3. **Endpoint URL**:
   ```
   https://<SEU_DOMINIO>/api/webhooks/stripe
   ```
   Exemplos:
   - `https://caloria.ai/api/webhooks/stripe`
   - `https://caloria-saas.vercel.app/api/webhooks/stripe`

4. **Selecione os eventos**:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

5. Após criar, copie o **Signing secret** (começa com `whsec_`)
6. Cole como `STRIPE_WEBHOOK_SECRET` na Vercel

### 4. Deploy!

1. **Primeiro deploy**: A Vercel faz automaticamente após importar
2. **Re-deploy**: Faça `git push` ou clique em **"Redeploy"** na Vercel

---

## 🧪 Testar Webhook Localmente

Para testar o webhook durante desenvolvimento:

```bash
# Instale o Stripe CLI
# https://stripe.com/docs/stripe-cli

# Faça login
stripe login

# Forward webhooks para localhost
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Copie o signing secret que aparece no terminal (whsec_...)
# e coloque no .env.local como STRIPE_WEBHOOK_SECRET=whsec_...

# Em outro terminal, dispare um evento de teste
stripe trigger checkout.session.completed
```

---

## 🔐 Notas de Segurança

- **Nunca** commite `.env.local` — ele já está no `.gitignore`
- As variáveis que começam com `NEXT_PUBLIC_` são expostas ao browser
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` e `SUPABASE_SERVICE_ROLE_KEY` são **somente server-side**
- O webhook do Stripe valida a assinatura do evento antes de processá-lo

---

## 📋 Resumo dos Comandos

```bash
# Desenvolvimento local
npm run dev

# Build de produção (validação)
npm run build

# Iniciar servidor de produção (local)
npm run start
```
