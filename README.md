# 📷 Revistec

**Relatório de Visita Técnica — substitui câmera + KMZ + montagem manual do relatório.**

Revistec é um aplicativo web (PWA) para equipes de campo — vistoria, fiscalização, manutenção de postes/redes, engenharia, construção civil — que precisam fotografar locais, anotar as fotos e gerar um relatório em PDF com coordenadas GPS, tudo direto do celular, sem depender de internet no momento da captura.

> Funciona 100% offline depois da primeira visita. Não existe servidor: os relatórios e fotos ficam salvos apenas no aparelho de quem os criou.

---

## ✨ Funcionalidades

### Relatórios
- Criação de relatórios com nome, município, equipe e supervisor responsável (cadastráveis, para preencher por seleção em vez de digitar toda vez).
- **Cadastro individual de postes/estruturas** dentro de cada relatório, com tipo de atividade (Poste, Poda, Outros).
- Captura de foto direto da câmera do celular, com carimbo automático de **coordenada GPS + data/hora** na própria imagem.
- Suporte a leitura de GPS embutido no EXIF da foto (câmeras que já gravam localização) como alternativa ao GPS do navegador.
- **Mapa dos postes do relatório**, para visualizar espacialmente onde cada estrutura cadastrada está localizada.
- Diagnóstico de GPS do aparelho (tela dedicada para testar a precisão antes de ir a campo) e entrada manual de coordenadas quando o GPS falha.
- Estrutura de pastas automática no disco do aparelho (Fotos / Relatório / KMZ / CAD), quando o navegador permite acesso a arquivos locais.
- Exportação em **PDF** (2, 4 ou 6 fotos por página, ordenadas cronologicamente, compactado automaticamente para ficar abaixo de 10 MB) com cabeçalho personalizado (logo + dados da empresa).
- Exportação em **KMZ** (para abrir no Google Earth) e em **DXF** (apoio de layout/distâncias em ferramentas CAD — não substitui uma projeção cartográfica oficial UTM/SIRGAS2000 nem levantamento topográfico).
- Backup/exportação completa de um relatório em `.zip`.

### Georreferenciamento
O sistema trabalha com duas referências diferentes:
1. **Coordenada do poste**: usada para posicionar a estrutura no mapa e nos arquivos geográficos (KMZ/DXF), definida a partir da primeira foto cadastrada naquele poste.
2. **Coordenada da fotografia**: registrada a partir da posição disponível no momento exato da captura.

Quando o GPS do navegador está disponível, ele é priorizado; há mecanismos alternativos (leitura do EXIF da foto, entrada manual) para quando a localização não é obtida normalmente. A precisão depende do GPS do aparelho, da rede e das condições de campo.

### Edição e anotação de fotos
- Ferramentas de anotação: seta, círculo, retângulo, desenho livre, texto, calibração de escala e medição estimada.
- Controles deslizantes de **espessura de traço** e **tamanho de texto**, aplicados a cada nova anotação.
- Ferramenta **✋ Mover**: toque numa anotação já feita e arraste para reposicionar, sem precisar apagar e redesenhar.

### Evidência avulsa de local (fora do relatório)
- Botão dedicado para tirar uma **foto ou gravar um vídeo curto** de um local, sem que isso entre em nenhum relatório — útil para guardar uma prova rápida antes de decidir se vale um relatório completo.
- **Marca d'água de localização estilo app de GPS**: uma miniatura de mapa (OpenStreetMap) com pino no ponto exato, coordenadas e data/hora, num cartão discreto no canto da foto/vídeo.
- Logo e nome da empresa desenhados discretamente no canto da foto/vídeo (mesmos dados cadastrados em "⚙️ Cabeçalho").
- No modo foto: a descrição do local é digitada **depois** de tirar a foto, e é aplicada sobre a imagem já carimbada.
- No modo vídeo: a gravação é feita ao vivo desenhando a câmera + a marca d'água num `<canvas>`, gravado com `MediaRecorder` — a informação fica realmente "queimada" nos quadros do vídeo (formato `.webm`).
- Botões de **Baixar** e **Compartilhar** (Web Share API) para tirar a mídia do app na hora.

### Configuração de cabeçalho compartilhada (multi-aparelho)
- Logo, nome da empresa, endereço e responsável técnico configuráveis em "⚙️ Cabeçalho".
- Sincronização automática via **Firebase Firestore**: o que uma pessoa salva aparece para todos que abrem o link do app (ver [`docs/firebase-setup.md`](docs/firebase-setup.md) para configurar).
- Sem Firebase configurado, o app funciona normalmente, só que cada aparelho guarda sua própria configuração local (comportamento padrão de PWA).

### Contas, login e plano Grátis/Pro
- Login por e-mail/senha ou "Entrar com Google" (Firebase Authentication).
- Plano **Grátis**: até 10 relatórios novos por mês por conta.
- Plano **Pro**: relatórios ilimitados (liberado manualmente pela administração por enquanto — ver seção [Monetização](#monetização-e-planos)).
- Indicador do plano e cota de uso no topo da tela inicial, com botão para pedir upgrade.
- **Painel de administrador** (visível só para o e-mail configurado em `ADMIN_EMAILS`): lista todas as contas cadastradas, com total de relatórios do mês e histórico geral, e um botão para alternar qualquer conta entre Grátis/Pro sem precisar abrir o Firebase Console.

### PWA / offline
- Instalável na tela inicial do Android (ícone e nome próprios: **Revistec**).
- Service Worker cacheia o app inteiro na primeira visita; funciona sem internet a partir daí.
- Atualizações do app chegam sozinhas: abre com a versão salva na hora, baixa a versão nova por trás, e ela aparece na abertura seguinte.

---

## 🧱 Stack técnica

- **Frontend**: HTML + CSS + JavaScript puro, em um único arquivo (`index.html`). Sem framework, sem build step.
- **Armazenamento local**: IndexedDB (relatórios, fotos, configurações) + File System Access API (pastas no disco, quando suportado).
- **Nuvem (opcional)**: Firebase — Firestore (configuração compartilhada + contas/planos) e Authentication (login).
- **Bibliotecas embutidas**: jsPDF (geração de PDF), JSZip (backup em `.zip`), Leaflet + tiles do OpenStreetMap (mapas).
- **PWA**: `manifest.json` + `sw.js` (Service Worker com estratégia "stale-while-revalidate").

---

## 🚀 Publicando/atualizando o app (GitHub Pages)

1. Faça upload (ou substitua) os arquivos na raiz do repositório:
   - `index.html`
   - `sw.js`
   - `manifest.json`
   - `icon-192.png`
   - `icon-512.png`
2. Espere 1–2 minutos para o GitHub Pages publicar.
3. Quem já usa o app abre normalmente: a versão nova é baixada em segundo plano e passa a valer na abertura seguinte.

Não é necessário nenhum passo de build — é um site estático puro.

---

## ☁️ Configurando a nuvem (Firebase)

A sincronização do cabeçalho e o sistema de login/plano usam o mesmo projeto Firebase. O passo a passo completo (criar projeto, ativar Firestore, regras de acesso, ativar login por e-mail/Google) está em:

📄 [`docs/firebase-setup.md`](docs/firebase-setup.md)

Sem essa configuração preenchida no `CLOUD_CONFIG` do `index.html`, o app funciona 100% offline, sem login e sem limite de relatórios — exatamente como antes de existir essa funcionalidade.

---

## 💰 Monetização e planos

Modelo atual (fase inicial, ver [`docs/roadmap.md`](docs/roadmap.md) para o plano completo):

| Plano | Limite | Como é liberado |
|---|---|---|
| Grátis | 10 relatórios/mês por conta | Automático ao criar a conta |
| Pro | Ilimitado | Manual: administrador troca `plan: "free"` → `"pro"` no documento da pessoa em Firestore → coleção `users` |

O botão "⭐ Quero ser Pro" abre uma conversa de WhatsApp pré-preenchida com o e-mail da conta, para agilizar a liberação manual enquanto o pagamento não está automatizado (próximo passo natural: Stripe ou Pix com confirmação automática).

**Observação importante**: hoje a cota de relatórios é contada **por conta individual**, não por empresa — e a configuração de cabeçalho continua **aberta** (sem exigir login), por decisão consciente para não travar equipes que já compartilham o mesmo cabeçalho. Ambos os pontos são candidatos a mudar quando o produto crescer (ver roadmap).

---

## 📁 Estrutura do repositório

```
├── index.html          # o app inteiro (HTML + CSS + JS)
├── sw.js                # Service Worker (cache offline)
├── manifest.json         # metadados do PWA (nome, ícone, cores)
├── icon-192.png          # ícone do app (192×192)
├── icon-512.png          # ícone do app (512×512)
├── assets/logo/           # logo em SVG/PNG para uso fora do app (divulgação)
├── docs/
│   ├── firebase-setup.md  # passo a passo de configuração do Firebase
│   └── roadmap.md         # plano de produto e monetização
├── examples/              # exemplos de relatórios/uso (se houver)
├── screenshots/           # capturas de tela do app
└── CHANGELOG.md           # histórico de versões
```

---

## ⚠️ Limitações conhecidas

- Vídeo de evidência é salvo em `.webm` — a maioria dos players Android abre normalmente, mas pode não abrir em alguns apps/iPhone sem conversão.
- A miniatura de mapa (na evidência de local) depende de internet no momento da captura; sem conexão, aparece um retângulo de cor sólida no lugar, sem travar a captura.
- Sem conta paga automatizada ainda — upgrades são liberados manualmente.
- A cota de relatórios do plano Grátis é por conta de login, não por empresa/equipe.

---

## 📜 Licença e uso

Projeto de uso interno/comercial da Revistec. Direitos reservados ao autor do repositório.
