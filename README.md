# Funil de diagnóstico — Vitor do Delivery

## Rodar localmente

Execute `pnpm dev` ou `npm run dev`.

## Conectar ao Google Sheets

1. Crie uma planilha e abra **Extensões → Apps Script**.
2. Cole o conteúdo de `apps-script/Code.gs`.
3. Em **Configurações do projeto → Propriedades do script**, crie `LEAD_TOKEN` com um valor secreto.
4. Implante como **Aplicativo da Web**, executando como você e com acesso para qualquer pessoa.
5. Copie a URL do Web App para `GOOGLE_APPS_SCRIPT_URL`.
6. Use o mesmo valor de `LEAD_TOKEN` em `GOOGLE_APPS_SCRIPT_TOKEN`.
7. Defina `NEXT_PUBLIC_WHATSAPP_NUMBER` com DDI e DDD, somente números.

Sem essas variáveis, a página continua gerando o diagnóstico, mas não grava leads e mantém o botão de WhatsApp desativado até a configuração ser feita.
