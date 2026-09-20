# 💾 Armazenamento e backup — Fotoprova

## O que fica onde

| Dado | Onde fica salvo | Sobrevive a... |
|---|---|---|
| Relatórios, postes, fotos originais e anotadas | **IndexedDB** do navegador, no aparelho | Fechar o app, reiniciar o celular, ficar offline |
| Pastas espelhadas no disco (opcional) | **Sistema de arquivos** do aparelho, via File System Access API | Desinstalar e reinstalar o app (os arquivos continuam onde foram salvos) |
| Configuração de cabeçalho (logo, empresa, cadastros) | **Firestore** (nuvem) + cópia em cache no IndexedDB | Trocar de aparelho — a versão na nuvem é a mesma para todos |
| Conta, plano e cota de relatórios | **Firestore** (nuvem) | Trocar de aparelho — basta logar de novo com o mesmo e-mail |
| Cópia do próprio app (HTML/ícones) | **Cache do Service Worker**, no navegador | Ficar offline — não sobrevive a "Limpar dados do site" |

## O ponto mais importante: fotos e relatórios são locais

Diferente da configuração de cabeçalho e da conta, **os relatórios e fotos em si não são sincronizados com nenhum servidor**. Isso é uma escolha deliberada de privacidade e simplicidade (evita custo de armazenamento de arquivos grandes na nuvem, e evita expor fotos de clientes/locais fora do controle direto do usuário) — mas tem uma consequência prática importante:

> **Se o aparelho for perdido, danificado ou tiver os dados do navegador apagados, os relatórios feitos nele são perdidos, a menos que tenham sido exportados antes.**

## Recomendações de backup

1. **Backup em `.zip`** de relatórios concluídos ou importantes — gera um arquivo com todas as fotos originais e metadados, que pode ser guardado no Google Drive, enviado por e-mail, ou copiado para um computador.
2. **Exportar o PDF final** assim que o relatório for concluído — além de ser o entregável, funciona como uma segunda cópia fora do IndexedDB.
3. Se o navegador permitir (File System Access API), usar a opção **"📁 Escolher pasta no disco"** para que as fotos fiquem espelhadas também numa pasta comum do celular (não só dentro do armazenamento interno do navegador) — assim aparecem, por exemplo, num backup automático de fotos do Google/OneDrive, se configurado no aparelho.
4. Evitar usar a opção "Limpar dados de navegação" do Chrome (ou "Armazenamento" nas configurações do app, no Android) sem antes confirmar que os relatórios importantes já foram exportados — essa ação apaga o IndexedDB e a cópia offline do app.

## Por que não sincronizar fotos na nuvem (por enquanto)

Foi uma decisão consciente de arquitetura para a fase atual do produto:

- **Custo**: armazenar fotos em alta resolução de múltiplos usuários na nuvem tem custo direto (armazenamento + tráfego), que precisaria ser absorvido no modelo de monetização.
- **Privacidade/LGPD**: fotos com coordenada GPS são dado sensível de localização. Manter os arquivos apenas no aparelho de quem os capturou reduz a superfície de risco até que existam salvaguardas adequadas (isolamento por empresa, política de privacidade, controle de acesso).
- **Funcionamento offline**: mesmo que houvesse sincronização, ela precisaria ser assíncrona e resiliente a longos períodos sem internet — uma característica que o IndexedDB local já entrega nativamente, sem essa complexidade adicional.

Isso é revisitado no [roadmap do projeto](roadmap.md) como uma evolução natural, condicionada a ter primeiro isolamento de dados por empresa e política de privacidade formalizada.
