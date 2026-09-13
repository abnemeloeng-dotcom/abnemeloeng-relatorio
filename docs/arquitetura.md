# Arquitetura do sistema

## Visão geral

A aplicação é uma solução web executada no navegador, com interface adaptada para celular e computador.

O núcleo do sistema concentra interface, regras de negócio, armazenamento local e rotinas de exportação.

## Componentes

- Interface HTML/CSS.
- JavaScript para regras e eventos.
- IndexedDB para dados locais.
- Geolocation API para localização.
- Canvas para edição/anotação de fotografias.
- Leaflet para mapas.
- Service Worker para cache/offline.
- APIs do navegador para arquivos locais e compartilhamento quando disponíveis.

## Fluxo de dados

```text
Usuário
  ↓
Interface
  ↓
Relatório → Poste → Foto
  ↓
GPS + descrição + anotações
  ↓
IndexedDB
  ↓
Exportação
 ├─ PDF
 ├─ KMZ
 ├─ DXF
 └─ ZIP
```

## Persistência

Os dados são mantidos localmente no navegador. O projeto utiliza estruturas separadas para relatórios, postes, fotografias e configurações.

## Observação

A arquitetura atual é local-first. Não há, nesta versão, indicação de backend remoto ou sincronização multiusuário.
