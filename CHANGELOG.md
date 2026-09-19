# Changelog — Fotoprova

Todas as mudanças relevantes do projeto, da mais recente para a mais antiga.

## [Não lançado]
- Documentação reescrita do zero: `README.md`, `docs/firebase-setup.md`, `docs/roadmap.md`, `CHANGELOG.md`.
- Limite do plano Grátis aumentado de 3 para **10 relatórios/mês**.
- **Painel de administrador** dentro do app (`🛠️ Admin`): lista todas as contas com uso mensal e histórico total, e permite alternar qualquer conta entre Grátis/Pro direto pela interface, sem precisar do Firebase Console.
- Contador de relatórios agora guarda também um total histórico (`reportsTotal`), além do contador mensal que reseta.

## Rebranding — Fotoprova
- Novo nome, logo e paleta de marca (azul-marinho `#1a3a5c` + dourado `#b8863b`), reaproveitando as cores já usadas no app.
- Ícone do app (`icon-192.png`, `icon-512.png`), `manifest.json` e Service Worker atualizados (cache `v2`) para refletir a nova marca — sem afetar dados de usuários já em teste.
- Título da aba, tela de login e cabeçalho do app atualizados para "Fotoprova", mantendo o subtítulo original para continuidade com quem já usava o app.

## Contas, login e plano Grátis/Pro
- Login por e-mail/senha e "Entrar com Google" (Firebase Authentication).
- Documento de conta por usuário no Firestore (`users/{uid}`): plano (`free`/`pro`) e contador de relatórios do mês, resetado automaticamente a cada mês.
- Limite de 10 relatórios/mês no plano Grátis, com bloqueio e sugestão de upgrade ao atingir o limite.
- Faixa de status no topo da tela inicial (e-mail, plano, uso do mês) com botões "Quero ser Pro" (abre WhatsApp) e "Sair".
- Configuração de cabeçalho mantida **aberta**, sem exigir login (decisão consciente, para não travar equipes que já compartilhavam a configuração).

## Evidência avulsa de local
- Nova tela para tirar foto ou gravar vídeo de um local **sem** vincular a nenhum relatório.
- Marca d'água de localização com miniatura de mapa (tile do OpenStreetMap) + pino, coordenadas e data/hora, num cartão discreto.
- Logo/nome da empresa desenhados discretamente no canto da foto e do vídeo.
- Fluxo de foto: descrição do local é digitada **depois** de capturar a imagem, e reaplicada sobre a foto já carimbada.
- Fluxo de vídeo: gravação ao vivo via `getUserMedia` + `<canvas>` + `MediaRecorder`, com a marca d'água desenhada em tempo real em cada quadro (formato `.webm`).
- Botões de baixar e compartilhar (Web Share API) a mídia gerada.

## Melhorias no editor de anotações de fotos
- Nova ferramenta **✋ Mover**: arrastar uma anotação já feita para reposicioná-la.
- Controles deslizantes de espessura de traço e tamanho de texto, aplicados por anotação.

## Sincronização de cabeçalho entre aparelhos (Firebase)
- Configuração de cabeçalho (logo, empresa, endereço, cadastros de município/equipe/supervisor) sincronizada via Firebase Firestore.
- Funciona offline com cópia local em cache; sincroniza automaticamente quando há internet.
- Indicador de status de sincronização (sucesso, sem conexão, enviado) na tela de configurações.

## Base inicial
- Captura de foto com carimbo de coordenada GPS + data/hora.
- Ferramentas de anotação: seta, círculo, retângulo, desenho livre, texto, calibração de escala e medição.
- Geração de relatório em PDF e exportação em KMZ.
- Backup completo de relatório em `.zip`.
- Funcionamento 100% offline via Service Worker (PWA instalável).
