# ⚙️ Funcionamento — Fotoprova

Este documento descreve os principais fluxos internos do aplicativo, do login até a geração do relatório final.

## 1. Inicialização e login

1. O `index.html` carrega e, se o Firebase estiver configurado (`CLOUD_SYNC_ENABLED`), exibe a tela de login (`auth-gate`) e aguarda `onAuthStateChanged`.
2. Ao autenticar (e-mail/senha ou Google), `onUserLoggedIn()` busca o documento da conta em `users/{uid}` no Firestore:
   - Se não existir, cria um novo (`plan: 'free'`, contadores zerados).
   - Se existir mas o mês mudou desde o último uso, zera `reportsThisMonth` (mantendo `reportsTotal`, o histórico).
3. Só então o restante do app é liberado: `restoreLocalRootHandle()` (tenta recuperar acesso à pasta local escolhida anteriormente) e `syncSettingsFromCloudOnLoad()` (busca a configuração de cabeçalho mais recente) rodam em paralelo.
4. Sem Firebase configurado, esse fluxo inteiro é ignorado e o app abre direto na tela de relatórios — sem login, sem cota, exatamente como uma versão 100% local.

## 2. Criando um relatório

1. Usuário toca em "➕ Novo relatório" → `podeExigirCotaDeRelatorio()` verifica se a conta ainda tem cota no plano Grátis (ou se é Pro, ou se não há Firebase configurado — nesses casos, sempre permite).
2. Se permitido, abre o formulário (nome, município, equipe, supervisor — os três últimos escolhidos de listas cadastráveis).
3. Ao salvar, o relatório é gravado no IndexedDB (`dbPut('reports', ...)`) e `registrarRelatorioCriado()` incrementa os contadores da conta no Firestore (mensal e total).

## 3. Cadastro de postes e captura de fotos

1. Dentro de um relatório, cada poste/estrutura é uma "atividade" com um tipo (Poste, Poda, Outros).
2. Ao tirar uma foto (`camera-input` → `handleCameraFile` → `processImage`):
   - Tenta obter a coordenada GPS do navegador (`getCurrentPositionSafe`).
   - Se falhar, tenta extrair do EXIF da própria foto (`extractGpsFromDataUrl`) — útil quando a câmera do aparelho já grava localização.
   - Se ainda assim não houver coordenada, oferece entrada manual (`getCoordWithFallback`).
   - A foto é redimensionada, carimbada com coordenada + data/hora (`drawWatermark`) e salva no IndexedDB.
3. A primeira foto cadastrada em um poste define a **coordenada do poste** (usada no mapa e nos arquivos geográficos); cada foto individual mantém sua própria coordenada de captura.

## 4. Anotação de fotos

1. `openAnnotateModal()` carrega a foto num `<canvas>` e permite desenhar sobre ela (seta, círculo, retângulo, texto, desenho livre, calibração de escala, medição).
2. Cada forma desenhada é um objeto guardado em `annotateState.shapes` (tipo, coordenadas, cor, espessura, tamanho de fonte).
3. A ferramenta **✋ Mover** faz hit-test (`annotateHitTest`) contra a lista de formas already desenhadas para permitir arrastar uma anotação existente.
4. Ao salvar, o canvas final (imagem original + anotações) substitui a foto guardada.

## 5. Evidência avulsa de local

Fluxo independente do relatório, pensado para registrar um local sem necessariamente abrir um relatório completo:

- **Foto**: captura → obtém coordenada → gera uma primeira versão carimbada (mapa + coordenada + data/hora + logo) → usuário digita a descrição depois → `buildEvidenceStampedPhoto()` é chamado de novo, agora incluindo a descrição, e a prévia é atualizada.
- **Vídeo**: abre a câmera ao vivo (`getUserMedia`) → desenha cada quadro num `<canvas>` (câmera + marca d'água + logo, recalculados a cada frame) → grava o `<canvas>` com `MediaRecorder` (`canvas.captureStream()` + trilha de áudio original) → ao parar, gera um arquivo `.webm`.
- Em ambos os casos, o resultado nunca é salvo no IndexedDB de relatórios — só oferece baixar (`<a download>`) ou compartilhar (Web Share API).

## 6. Sincronização de cabeçalho

1. Ao abrir "⚙️ Cabeçalho" (`openSettingsModal`), o app busca a versão mais recente em `shared_config/header_settings` no Firestore e a usa como cópia mais atual, salvando-a também no IndexedDB local (para funcionar offline depois).
2. Ao salvar, `pushCloudSettings()` grava a nova configuração no Firestore — qualquer outro aparelho que abrir o app depois (ou que já estiver com o app aberto e reabrir a tela de configurações) recebe a atualização.
3. Sem internet no momento, a operação falha silenciosamente e o app continua com a última cópia local conhecida.

## 7. Geração de saída (PDF / KMZ / DXF / backup)

- **PDF**: `jsPDF` monta páginas com 2, 4 ou 6 fotos, na ordem cronológica de captura, com cabeçalho (logo + dados da empresa) em todas as páginas. Há uma etapa de compactação para manter o arquivo abaixo de ~10 MB.
- **KMZ**: monta um XML KML com um marcador por poste (usando a coordenada do poste) e empacota como `.kmz` (zip).
- **DXF**: gera um desenho simplificado com os pontos e distâncias entre postes, para apoio em ferramentas CAD — não substitui um levantamento topográfico oficial.
- **Backup**: `JSZip` empacota fotos + metadados do relatório inteiro em um único `.zip`, para arquivar ou transferir manualmente.

## 8. Painel de administrador

1. Visível apenas se o e-mail logado estiver em `ADMIN_EMAILS`.
2. Ao abrir, `carregarUsuariosAdmin()` lê **toda** a coleção `users` do Firestore (permitido pela regra especial de e-mail admin) e monta uma lista local (`adminUsersCache`).
3. Cada botão "Tornar Pro"/"Tornar Grátis" atualiza o campo `plan` daquele documento específico — a mudança tem efeito imediato na próxima vez que a pessoa abrir/recarregar o app (e instantaneamente na sessão do próprio admin, se ele for a pessoa alterada).
