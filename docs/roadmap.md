# 🗺️ Roadmap — Fotoprova

Plano de evolução do produto, da fase atual (MVP funcional com testadores) até um produto comercial publicado na Play Store.

## Onde estamos hoje

- ✅ App funcional, usado por testadores reais.
- ✅ Marca própria (nome, logo, ícone, PWA instalável).
- ✅ Login (e-mail/senha + Google) e plano Grátis (3 relatórios/mês) vs Pro (ilimitado, liberação manual).
- ✅ Sincronização de configuração de cabeçalho entre aparelhos.
- ✅ Evidência avulsa de local (foto/vídeo com marca d'água de localização).

## Por que essa ordem (e não anúncios primeiro)

O Fotoprova é uma ferramenta **B2B de nicho** (equipes de campo, empreiteiras, prefeituras), não um app de consumo de massa. Nesse perfil:

- **Anúncios (AdMob)** rendem pouco com base de usuários pequena, e passam impressão amadora para quem entrega um relatório a um cliente/prefeitura usando o app. Fica como receita marginal opcional, não como pilar.
- **Patrocínio direto** normalmente exige audiência/alcance grande — não é realista nas primeiras fases.
- **Assinatura Pro (B2B)** é onde está o dinheiro de verdade: empresa paga por equipe/uso, não por anúncio. É o foco principal.

## Fases planejadas

1. **Pré-requisito técnico**: login/conta por empresa + isolamento de dados na nuvem *(em andamento — hoje o login existe, mas a configuração de cabeçalho ainda é aberta e a cota é por conta individual, não por empresa)*.
2. **Venda direta B2B**: oferecer para empreiteiras/prefeituras já conhecidas, sem esperar crescimento orgânico via loja de aplicativos.
3. **Publicação na Play Store** via TWA (empacota o PWA existente) — dá credibilidade e facilita instalação; não deve ser a única estratégia de aquisição de usuários.
4. **Métricas de uso e retenção**: número de relatórios criados, sessões, usuários ativos, taxa de conversão Grátis→Pro.
5. **Monetização automatizada**: Stripe ou Pix com confirmação automática (webhook) para liberar o plano Pro sem intervenção manual.
6. **Receita adicional (opcional)**: AdMob de baixa prioridade; patrocínio direto só depois de alcançar uma base de usuários relevante.

## Decisões em aberto

- [ ] Cota de relatórios: manter por conta individual, ou passar a ser por **empresa** (várias contas compartilhando um limite)?
- [ ] Configuração de cabeçalho: manter aberta (sem login) ou exigir login e isolar por empresa?
- [ ] Automatizar cobrança (Stripe/Pix) — exige um mínimo de backend (Cloud Functions do próprio Firebase resolve isso).
- [ ] Política de privacidade e termos de uso (necessário antes de publicar na Play Store, por lidar com fotos + GPS).

## Avaliação honesta do estágio atual do produto

- A base funcional está sólida e cobre o caso de uso principal (fotografar, anotar, gerar PDF/KMZ) melhor do que uma solução manual com câmera + WhatsApp + Word.
- A marca (nome, logo, paleta de cores) já é distintiva o suficiente para não parecer "feito às pressas".
- O maior gap frente a concorrentes estabelecidos (CompanyCam, Fieldwire, Raken) é a tela inicial, hoje organizada como lista de configurações em vez de destacar fotos/relatórios — candidato a redesenho antes da publicação pública.
- Antes de qualquer loja de aplicativos: falta política de privacidade (obrigatório, dado sensível de localização) e decisão sobre isolamento de dados por empresa.
