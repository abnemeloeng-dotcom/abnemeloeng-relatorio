# Relatório Fotográfico de Campo – Sistema de Inspeção Georreferenciada

Sistema web/mobile desenvolvido para apoiar atividades de campo que envolvem registro fotográfico, identificação de postes, coordenadas geográficas e geração de arquivos técnicos.

## Objetivo

Centralizar em uma única aplicação etapas que normalmente exigem câmera, anotações, organização manual de fotografias, elaboração de relatório e geração de arquivos geográficos/CAD.

A proposta do projeto é transformar um processo operacional de campo em um fluxo digital mais organizado, rastreável e reutilizável.

## Principais recursos

- Criação e gerenciamento de relatórios.
- Cadastro de postes/estruturas.
- Captura de fotografias pelo aparelho.
- Registro da coordenada GPS no momento da captura.
- Definição da coordenada do pé do poste a partir da primeira foto.
- Inserção de descrição nas fotografias.
- Anotação gráfica sobre a foto.
- Ferramentas de seta, círculo, retângulo, desenho livre e texto.
- Calibração de escala e medição estimada sobre a fotografia.
- Mapa dos postes do relatório.
- Diagnóstico do GPS do aparelho.
- Entrada manual de coordenadas quando necessário.
- Configuração de empresa, endereço, responsável técnico e logo.
- Geração de relatório PDF.
- Opções de 2, 4 ou 6 fotos por página.
- Ordenação cronológica das fotografias.
- Compactação automática do PDF para ficar abaixo de 10 MB.
- Geração de KMZ.
- Geração de DXF para apoio de layout/distâncias.
- Exportação de backup em ZIP.
- Organização dos arquivos em pastas locais quando o navegador oferece suporte.
- Armazenamento local no navegador.
- Suporte a operação offline após o primeiro carregamento, por meio de Service Worker.

## Estrutura local dos arquivos

Quando utilizada a seleção de pasta local, o sistema organiza o relatório em uma estrutura semelhante a:

```text
Pasta escolhida/
└── Nome do relatório/
    ├── Fotos/
    ├── Relatorio/
    ├── KMZ/
    └── CAD/
```

## Fluxo de utilização

```text
Configurar empresa/logo
        ↓
Criar relatório
        ↓
Cadastrar poste
        ↓
Capturar primeira foto
        ↓
Registrar coordenada do pé do poste
        ↓
Adicionar demais fotos
        ↓
Inserir descrição/anotações
        ↓
Cadastrar próximos postes
        ↓
Visualizar mapa
        ↓
Gerar PDF / KMZ / DXF
        ↓
Exportar backup
```

## Georreferenciamento

O sistema trabalha com duas referências diferentes:

1. **Coordenada do poste:** utilizada para posicionar o poste no mapa e nos arquivos geográficos.
2. **Coordenada da fotografia:** registrada a partir da posição disponível no momento da captura.

Quando o GPS do navegador está disponível, ele é priorizado. O projeto também possui mecanismos alternativos para situações em que a localização não é obtida normalmente, incluindo entrada manual de latitude e longitude.

### Importante sobre precisão

O sistema registra a posição fornecida pelo aparelho/navegador. A precisão depende do GPS, rede, ambiente e condições de campo.

O DXF gerado pela aplicação não deve ser tratado como levantamento topográfico ou como transformação oficial para UTM/SIRGAS2000. O recurso é destinado ao apoio de layout e representação das posições.

## PDF

O relatório pode ser configurado para:

- 2 fotos por página;
- 4 fotos por página;
- 6 fotos por página.

As fotografias são organizadas cronologicamente. Cada registro pode apresentar identificação, coordenadas, data/hora e descrição associada.

## KMZ

O projeto gera um arquivo KMZ contendo elementos geográficos relacionados aos postes e fotografias do relatório.

O KMZ é destinado à visualização e compartilhamento das informações georreferenciadas.

## DXF

O sistema também produz um arquivo DXF para utilização em ferramentas CAD.

**Limitação:** a conversão utilizada pela aplicação é uma representação local para layout/distâncias e não substitui uma projeção cartográfica oficial nem um levantamento topográfico.

## Armazenamento e backup

Os dados de trabalho são armazenados localmente no navegador. As fotografias não precisam ficar misturadas com a galeria convencional do aparelho.

Por segurança, relatórios concluídos devem ser exportados para PDF/KMZ/DXF e, quando necessário, deve ser utilizado o backup ZIP.

## Funcionamento offline

O projeto possui um Service Worker que armazena o aplicativo em cache. Depois do primeiro carregamento, o sistema pode continuar funcionando sem conexão para as funções que dependem apenas dos dados locais e dos recursos já armazenados.

A disponibilidade de mapas online e outros recursos externos pode depender de conexão.

## Tecnologias

- HTML5
- CSS3
- JavaScript
- IndexedDB
- File System Access API
- Geolocation API
- Canvas API
- Service Worker
- Leaflet 1.9.4
- Geração de PDF
- Geração de KMZ/KML
- Geração de DXF

## Arquitetura simplificada

```text
Interface Web
     │
     ├── Relatórios
     ├── Postes
     ├── Fotografias
     ├── GPS
     ├── Mapa
     └── Exportações
            │
            ├── PDF
            ├── KMZ
            ├── DXF
            └── ZIP
     │
     ▼
IndexedDB / armazenamento local
     │
     ▼
Pasta local / arquivos exportados
```

## Como executar

### Opção 1 — servidor local

Abra a aplicação por um servidor local/HTTPS para obter o melhor suporte às APIs de localização e armazenamento de arquivos.

Exemplo:

```bash
python -m http.server 8000
```

Depois acesse:

```text
http://localhost:8000/app/
```

### Opção 2 — hospedagem

O projeto pode ser hospedado em um serviço compatível com páginas web estáticas.

Para uso do GPS, HTTPS é recomendado.

## Estrutura do repositório

```text
relatorio-fotografico-campo/
├── README.md
├── LICENSE
├── .gitignore
├── app/
│   ├── index.html
│   └── sw.js
├── docs/
│   ├── arquitetura.md
│   ├── funcionamento.md
│   ├── manual-de-uso.md
│   ├── georreferenciamento.md
│   ├── armazenamento-e-backup.md
│   └── evolucao-do-projeto.md
├── screenshots/
├── examples/
│   ├── pdf/
│   ├── kmz/
│   └── dxf/
└── assets/
    └── logo/
```

## Aplicação prática

O projeto foi pensado para cenários de inspeção e acompanhamento de campo nos quais é necessário relacionar:

**estrutura + fotografia + descrição + coordenada + documento técnico.**

Isso reduz a dependência de organização manual posterior e cria uma sequência de dados mais consistente para geração dos produtos finais.

## Problema de engenharia x solução tecnológica

| Problema de campo | Solução |
|---|---|
| Fotografias ficam misturadas na galeria | Armazenamento organizado dentro da aplicação |
| Necessidade de identificar cada poste | Cadastro individual de estruturas |
| Dificuldade de associar foto à localização | Registro de coordenada no momento da captura |
| Montagem manual do relatório | Geração automática de PDF |
| Necessidade de visualizar postes no mapa | Mapa integrado |
| Compartilhamento geográfico | Geração de KMZ |
| Necessidade de apoio em CAD | Geração de DXF |
| Perda de dados de campo | Exportação de backup |
| Dependência de conexão | Recursos locais e cache offline |

## Limitações conhecidas

- A precisão das coordenadas depende do dispositivo e das condições de recepção.
- Recursos que dependem de mapas/serviços externos podem exigir internet.
- O DXF não representa uma projeção oficial UTM/SIRGAS2000.
- Os dados ainda não constituem um sistema de banco de dados remoto multiusuário.
- A limpeza dos dados do navegador pode afetar informações que ainda não foram exportadas.

## Evolução planejada

Possíveis evoluções futuras:

- sincronização com banco de dados remoto;
- autenticação de usuários;
- painel web para acompanhamento de equipes;
- integração com APIs de mapas;
- melhoria da exportação CAD;
- modelos de relatório configuráveis;
- histórico de alterações;
- assinatura digital;
- integração com sistemas corporativos;
- indicadores e dashboards de campo.

## Screenshots

As imagens reais da aplicação devem ser adicionadas à pasta `screenshots/`.

Sugestão:

```text
01-tela-inicial.png
02-configuracao-empresa.png
03-novo-relatorio.png
04-cadastro-poste.png
05-captura-fotografica.png
06-legenda-foto.png
07-anotacao-foto.png
08-diagnostico-gps.png
09-mapa-postes.png
10-geracao-pdf.png
11-relatorio-pdf.png
12-geracao-kmz.png
13-geracao-dxf.png
14-backup.png
```

## Autor

**Eng. Abne Melo dos Santos**

Projeto desenvolvido com foco em engenharia, digitalização de processos de campo e criação de soluções práticas utilizando tecnologia.

## Desenvolvimento com inteligência artificial

O projeto foi desenvolvido com apoio de inteligência artificial, utilizada como ferramenta de auxílio na estruturação, programação, análise, correção e evolução da solução.

## Status

**Projeto funcional / em evolução.**

A aplicação continua aberta para melhorias conforme necessidades reais identificadas em campo.

---

### Objetivo de portfólio

Este projeto demonstra a aplicação de tecnologia para resolver um problema real de engenharia e operação de campo, unindo:

**Engenharia + Georreferenciamento + Automação + Desenvolvimento Web + Organização de Dados.**
