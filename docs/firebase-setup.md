# ☁️ Configuração do Firebase

O Fotoprova usa o **Firebase** (gratuito, plano Spark) para duas coisas independentes:

1. **Sincronizar a configuração de cabeçalho** (logo, empresa, endereço, listas de municípios/equipes/supervisores) entre todos os aparelhos que abrem o link do app.
2. **Login e controle do plano Grátis/Pro** (contagem de relatórios por mês).

Se você não configurar nada, o app funciona normalmente, só que 100% local — sem sincronização e sem login/limite.

---

## 1. Criar o projeto

1. Acesse [console.firebase.google.com](https://console.firebase.google.com) e entre com uma conta Google.
2. Toque em **"Criar um novo projeto do Firebase"**, dê um nome (ex: `fotoprova`) e conclua.

## 2. Ativar o Firestore Database

1. No menu lateral (ícone ☰ se estiver no celular), vá em **Compilação → Firestore Database**.
2. Toque em **"Criar banco de dados"**.
3. Escolha uma localização (ex: `southamerica-east1`) e o **modo de produção**.

## 3. Configurar as regras de acesso

Na tela do Firestore Database, abra a aba **"Regras"** e substitua todo o conteúdo por:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Configuração de cabeçalho: aberta para leitura/escrita por qualquer
    // pessoa com o link do app (sem exigir login). Não guarde nada
    // sensível aqui além de logo/nome/endereço da empresa.
    match /shared_config/{docId} {
      allow read, write: if true;
    }

    // Conta de cada usuário logado: só a própria pessoa pode ler/escrever
    // os próprios dados de plano e cota de relatórios.
    match /users/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
```

Toque em **"Publicar"**.

> ⚠️ A coleção `shared_config` fica aberta de propósito (para não exigir login de quem só usa a configuração de cabeçalho). Adequado para uso interno em equipe pequena — não é recomendado para um produto com muitos clientes diferentes sem isolamento de dados.

## 4. Ativar login (Authentication)

1. No menu lateral, vá em **Compilação → Authentication**.
2. Toque em **"Vamos começar"** (se for a primeira vez).
3. Na aba **"Sign-in method"**, ative:
   - **E-mail/senha**
   - **Google**

Sem isso ativado, ninguém consegue criar conta nem entrar no app.

## 5. Pegar as chaves do projeto (`firebaseConfig`)

1. No menu lateral, toque no ícone de **engrenagem ⚙️ → Configurações do projeto**.
2. Na aba "Geral", role até **"Seus apps"**.
3. Se não houver nenhum app cadastrado, toque no ícone **`</>`** (Web), dê um nome (ex: `app-web`) e conclua.
4. Copie o objeto `firebaseConfig` mostrado.

## 6. Colar no `index.html`

Abra o `index.html` e procure por `CLOUD_CONFIG` (perto do início do script principal). Cole os valores copiados:

```js
const CLOUD_CONFIG = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "...",
};
```

Suba o `index.html` atualizado para o repositório (GitHub Pages) e pronto — a sincronização e o login passam a funcionar para quem abrir o app.

---

## Liberando alguém como Pro manualmente

Enquanto o pagamento não é automatizado:

1. Firebase Console → **Firestore Database** → coleção `users`.
2. Encontre o documento da pessoa (o ID é o UID dela — o e-mail aparece dentro do documento, no campo `email`, para identificar).
3. Edite o campo `plan` de `"free"` para `"pro"`.

A pessoa não precisa fazer nada — na próxima vez que abrir o app (ou atualizar a página), o plano Pro já aparece liberado.
