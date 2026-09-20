# 🏗️ Arquitetura — Fotoprova

## Visão geral

O Fotoprova é um **PWA (Progressive Web App)** de arquivo único: todo o HTML, CSS e JavaScript do aplicativo vivem em um só `index.html`. Não existe backend próprio — o "servidor" é o GitHub Pages servindo um arquivo estático, e a única peça de infraestrutura externa é o Firebase, usado de forma **opcional e minimalista** para duas funções específicas (sincronização de configuração e contas/planos).

Essa escolha não foi por limitação, e sim por adequação ao problema: uma ferramenta de campo precisa funcionar **sem depender de conectividade**, e cada camada de infraestrutura adicional (servidor de aplicação, banco relacional, API própria) é uma camada a mais que pode falhar exatamente no momento em que o usuário está sem sinal, no meio de uma vistoria.

## Por que um único arquivo HTML?

- **Zero build step**: qualquer alteração pode ser testada abrindo o arquivo direto no navegador, sem `npm install`, sem bundler, sem tempo de compilação.
- **Deploy trivial**: subir um arquivo para o GitHub Pages é suficiente. Não há risco de dependências desatualizadas quebrando o build meses depois.
- **Facilidade de auditoria**: como não há empacotamento, o código que roda no navegador é exatamente o código-fonte — não existe uma "caixa preta" gerada por um bundler.

O custo dessa escolha é a organização interna: como o arquivo cresce (hoje com milhares de linhas), a disciplina de comentários e nomeação de funções em português (para o domínio do problema) e funções bem isoladas por responsabilidade é o que mantém o código navegável.

## Camadas de armazenamento

| Camada | Onde vive | Usada para |
|---|---|---|
| **IndexedDB** | No navegador do aparelho | Relatórios, fotos, postes/atividades, configuração local |
| **File System Access API** | No disco do aparelho (quando suportado) | Estrutura de pastas espelhada (Fotos/Relatório/KMZ/CAD) |
| **Firestore** (`shared_config`) | Nuvem (Firebase) | Configuração de cabeçalho compartilhada entre aparelhos |
| **Firestore** (`users`) | Nuvem (Firebase) | Conta, plano (Grátis/Pro) e cota de relatórios por usuário |
| **Cache do Service Worker** | No navegador do aparelho | Cópia offline do app inteiro (HTML, ícones, manifest) |

Ver [`armazenamento-e-backup.md`](armazenamento-e-backup.md) para o detalhamento de cada uma.

## Autenticação e autorização

- **Autenticação**: Firebase Authentication (e-mail/senha e Google). Client-side puro — não há servidor de sessão.
- **Autorização**: feita majoritariamente pelas **regras do Firestore** (`request.auth.uid == uid`), não pelo código JavaScript do app. Isso é proposital: qualquer verificação feita só no cliente pode ser contornada por quem inspeciona o código-fonte (que é público, já que é um PWA); a barreira real de segurança tem que estar do lado do banco de dados.
- O painel de administrador é um caso à parte: o botão só aparece na interface para o e-mail definido em `ADMIN_EMAILS`, mas a permissão de fato é garantida pela regra `request.auth.token.email == "..."` no Firestore — mesmo que alguém adultere o JavaScript no próprio navegador, não conseguiria ler/escrever dados de outras contas sem esse e-mail autenticado.

## Bibliotecas de terceiros

Todas embutidas diretamente no `index.html` (sem gerenciador de pacotes):
- **jsPDF** — geração dos relatórios em PDF.
- **JSZip** — empacotamento de backups em `.zip`.
- **Leaflet + tiles do OpenStreetMap** — exibição de mapas (mapa dos postes, diagnóstico de GPS, miniatura de localização na evidência avulsa).
- **Firebase SDK (compat)** — Firestore e Authentication, carregados via `<script>` do CDN oficial do Google.

## Módulos funcionais do código

Embora seja um único arquivo, o JavaScript é organizado por responsabilidade:
- **Camada de dados** (`dbGet`, `dbPut`, `dbGetAll...`): abstração sobre o IndexedDB.
- **Camada de nuvem** (`cloudDb`, `cloudAuth`, funções `fetchCloudSettings`/`pushCloudSettings`): tudo que fala com o Firebase, isolado para que o restante do app funcione normalmente se o Firebase não estiver configurado.
- **Motor de carimbo/anotação** (`drawWatermark`, `drawLocationWatermark`, `annotateDrawShape`, `drawDiscreteCompanyMark`): toda a manipulação de `<canvas>` usada tanto no fluxo de relatório quanto na evidência avulsa.
- **Geração de saída** (PDF, KMZ, DXF, backup `.zip`): funções de exportação, cada uma lendo do IndexedDB e produzindo um arquivo final.
- **Contas e planos** (`onUserLoggedIn`, `podeExigirCotaDeRelatorio`, `registrarRelatorioCriado`, painel admin): a camada de negócio que decide o que cada plano pode fazer.

## Decisões conscientes de compromisso (trade-offs)

- **Configuração de cabeçalho aberta** (`shared_config`, sem exigir login): prioriza não travar equipes que já compartilhavam a configuração, em troca de não ter isolamento de dados entre diferentes empresas usando o mesmo projeto Firebase. Documentado como item do roadmap para revisão.
- **Cota de relatórios por conta individual, não por empresa**: mais simples de implementar sem um conceito de "organização" no banco; aceito como limitação inicial.
- **Vídeo em `.webm`**: formato nativo do `MediaRecorder` no Chrome/Android, evitando a complexidade de transcodificação no cliente — ao custo de compatibilidade limitada em alguns players/iOS.
