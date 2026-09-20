# 🌍 Georreferenciamento — Fotoprova

## As duas referências de coordenada

O sistema trabalha com duas coordenadas conceitualmente diferentes, que podem (mas não precisam) coincidir:

1. **Coordenada do poste/estrutura**: representa a posição da estrutura cadastrada no relatório. É usada para posicionar o marcador no mapa e nos arquivos geográficos (KMZ, DXF). Na prática, é definida a partir da **primeira foto** cadastrada naquele poste.
2. **Coordenada da fotografia**: a posição registrada no momento exato daquela captura específica. Cada foto guarda a sua própria, independentemente da coordenada "oficial" do poste.

Essa separação existe porque, em campo, é comum tirar várias fotos de ângulos diferentes ao redor de uma mesma estrutura — o GPS de cada captura pode variar alguns metros entre uma foto e outra, mas todas pertencem ao mesmo poste.

## Como a coordenada é obtida

A prioridade de captura, em ordem:

1. **GPS do navegador** (`navigator.geolocation`, via `getCurrentPositionSafe`) — a fonte mais precisa quando disponível, mas depende do sinal de satélite e das permissões do sistema operacional.
2. **GPS embutido no arquivo da foto (EXIF)** (`extractGpsFromDataUrl`) — usado como alternativa quando o navegador não retorna localização, mas a câmera do aparelho já grava a posição na própria imagem.
3. **Entrada manual** (`getCoordWithFallback`) — último recurso, quando nenhuma das fontes automáticas funciona (prédios fechados, aparelhos sem GPS, permissão negada).

## Precisão e limitações

- A precisão típica do GPS de um smartphone varia de poucos metros a algumas dezenas de metros, dependendo de condições como cobertura de céu aberto, multipath urbano (reflexos em prédios) e qualidade do receptor do aparelho.
- O app inclui uma tela de **diagnóstico de GPS** ("🛰️ Testar GPS deste aparelho") para o usuário conferir a precisão disponível antes de ir a campo.
- **O Fotoprova não substitui um levantamento topográfico oficial.** Os arquivos KMZ e DXF gerados servem como apoio visual e de referência — não têm a precisão nem a validade legal de uma projeção cartográfica oficial (UTM/SIRGAS2000) feita por instrumentos e métodos topográficos apropriados.

## Marca d'água de localização

Duas variações existem no app, para contextos diferentes:

- **Carimbo simples** (fotos de relatório): coordenada + data/hora em texto, num retângulo semi-transparente no rodapé da foto.
- **Marca d'água estilo GPS** (evidência avulsa de local): um cartão com miniatura de mapa (tile do OpenStreetMap) e um pino marcando o ponto exato, além de coordenada, data/hora e descrição — desenhado tanto em fotos quanto, quadro a quadro, em vídeos gravados pelo app.

Quando não há internet disponível no momento da captura, a miniatura de mapa é substituída por um retângulo de cor sólida (sem travar a captura); a coordenada e a data/hora continuam sendo gravadas normalmente.

## Sistema de referência

As coordenadas são armazenadas e exibidas em **graus decimais (WGS84)** — o mesmo sistema usado pelo GPS de smartphones e pelo Google Earth/Maps. Ao exportar KMZ, esse é o formato nativo esperado pelo Google Earth. Ao exportar DXF, os pontos são posicionados de forma simplificada; para projetos que exigem uma projeção plana com metros lineares reais (UTM), é necessário processar os dados numa ferramenta de SIG (Sistema de Informação Geográfica) apropriada — o DXF gerado aqui é um apoio de layout, não uma peça topográfica.
