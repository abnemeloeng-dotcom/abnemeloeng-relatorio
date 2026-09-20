# 📈 Evolução do projeto — Fotoprova

Este documento conta a história de como o Fotoprova chegou ao estágio atual — não como uma lista seca de commits, mas como um registro das decisões e do raciocínio por trás de cada fase. A ideia é que sirva tanto de contexto para quem for mexer no código depois quanto de retrato de como o produto foi pensado.

## Fase 0 — O problema original

O ponto de partida foi um processo manual e frágil: fotografar postes/estruturas em campo com a câmera do celular, depois montar manualmente um relatório em Word ou PowerPoint, cruzar coordenadas GPS à mão, e gerar KMZ separadamente em outra ferramenta. Cada etapa era uma chance de erro humano — foto sem coordenada, relatório com data errada, poste esquecido.

O Fotoprova nasceu como resposta direta a isso: **substituir câmera + KMZ + montagem manual do relatório** por um único fluxo, no próprio celular usado em campo.

## Fase 1 — O núcleo funcional

Prioridade: fazer o básico funcionar **sem depender de internet**, já que o caso de uso é justamente em campo, muitas vezes sem sinal. Isso levou a decisões estruturais logo no início:
- IndexedDB para tudo (relatórios, fotos, cadastros) — sem servidor.
- PWA com Service Worker, para o app abrir mesmo offline depois da primeira visita.
- Câmera nativa do navegador (`<input type="file" capture>`), carimbo de GPS + data/hora desenhado direto no `<canvas>`, e exportação em PDF/KMZ via bibliotecas client-side (jsPDF, JSZip).

Esse núcleo já resolvia o problema original de ponta a ponta, mesmo sem nenhuma peça de nuvem.

## Fase 2 — Ferramentas de anotação

Fotos brutas nem sempre contam a história sozinhas — foi preciso marcar sobre elas (uma rachadura, uma distância, uma seta apontando o defeito). Isso trouxe o editor de anotações (seta, círculo, retângulo, texto, desenho livre), depois refinado com:
- Calibração de escala e medição estimada, para dar noção de tamanho real sem instrumento de medição em campo.
- Controles de espessura de traço e tamanho de texto — o primeiro retorno de uso real foi que as anotações "ficavam fininhas demais" nas fotos de alta resolução, o que levou a esse ajuste.
- Uma ferramenta de mover anotações já feitas, depois que ficou claro que "apagar e redesenhar" era um atrito desnecessário no fluxo.

## Fase 3 — Multi-aparelho, via Firebase

O primeiro ponto de dor de usar o app em **equipe** (mais de uma pessoa, mais de um celular) apareceu na configuração de cabeçalho: cada aparelho guardava a própria cópia local, então uma alteração feita por uma pessoa não aparecia para as demais.

A solução escolhida foi o Firebase (Firestore), pelo custo zero de entrada (plano gratuito) e por não exigir manter um servidor próprio. Uma decisão consciente nessa fase: manter essa sincronização **aberta**, sem exigir login — para não impor uma barreira de entrada extra a equipes pequenas que só precisavam compartilhar logo e dados da empresa.

## Fase 4 — Evidência avulsa de local

Percebeu-se uma necessidade paralela ao fluxo de relatório: às vezes é preciso só **guardar uma prova rápida de um local**, sem necessariamente abrir um relatório inteiro (por exemplo, antes de decidir se aquele caso justifica um relatório completo). Isso motivou uma funcionalidade independente — foto ou vídeo avulso, nunca vinculado a nenhum relatório — que evoluiu em camadas:
1. Primeiro, um carimbo de texto simples (coordenada + data/hora).
2. Depois, a logo da empresa desenhada discretamente, para que a mídia avulsa também carregasse identificação de origem.
3. Por fim, uma marca d'água no estilo de aplicativos de GPS dedicados (mapa em miniatura + pino), inclusive **gravada em tempo real dentro de vídeos** — desenhando cada quadro da câmera num `<canvas>` e capturando esse canvas com `MediaRecorder`, para que a informação de localização fique de fato "queimada" no vídeo, e não apenas como uma legenda solta.

## Fase 5 — Virando produto: marca, contas e monetização

Com usuários reais testando o app, a conversa natural seguinte foi: como transformar isso de ferramenta interna em produto sustentável? Esse salto trouxe decisões de outra natureza — não só técnica, mas de modelo de negócio:

- **Identidade de marca**: escolha do nome **Fotoprova** (comunicando diretamente o valor central: foto como prova), com uma paleta de cores reaproveitada do que o app já usava, para não começar do zero.
- **Contas e login**: Firebase Authentication (e-mail/senha + Google), escolhido pela fricção mínima de cadastro — importante para não perder usuários logo na entrada.
- **Modelo de plano**: Grátis (10 relatórios/mês) e Pro (ilimitado), com a decisão consciente de **não** apostar em anúncios como receita principal — o público-alvo é B2B de nicho (equipes de campo, empreiteiras, prefeituras), onde a assinatura paga por equipe faz mais sentido econômico do que anúncios de baixo CPM.
- **Painel de administrador**: depois de perceber que liberar/revogar planos manualmente pelo console do Firebase era um processo lento e propenso a erro, foi criado um painel dentro do próprio app, com a permissão de acesso garantida pelas regras do Firestore (não apenas pela interface).

## O que isso ensina sobre o processo

Um padrão se repete em quase todas as fases: **a funcionalidade não nasceu de um plano fechado desde o início, e sim de um atrito real observado no uso** — configuração que não sincronizava, anotação fininha demais, necessidade de provar um local sem abrir relatório, dificuldade de gerenciar planos manualmente. Isso é consistente com o [roadmap do projeto](roadmap.md), que também assume abertamente decisões ainda não tomadas (isolamento de dados por empresa, automação de cobrança) em vez de fingir que o produto já está definitivamente pronto.
