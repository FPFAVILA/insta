# Guia de Troubleshooting - SearchAPI.io Integration

## Problemas Comuns e Soluções

### 1. API não está sendo chamada

**Sintoma**: Ao clicar em "Confirmar", nada acontece

**Soluções**:

1. Abra o Console do navegador (F12 > Console)
2. Procure por erros JavaScript
3. Verifique se o arquivo `api-interceptor.js` foi carregado:
   ```javascript
   // No console, digite:
   console.log('Interceptor:', window.validateInstagramUsername ? 'OK' : 'ERRO');
   ```

4. Verifique a aba Network (F12 > Network):
   - Procure pela requisição para `/api/get-user-by-username`
   - Veja o status code (deve ser 200)
   - Veja a resposta

**Fix**: Se o interceptor não carregou, verifique se está no HTML:
```html
<script src="assets/js/api-interceptor.js"></script>
```

### 2. Erro 404 nas API Routes

**Sintoma**:
```
GET /api/get-user-by-username?username=cristiano 404 (Not Found)
```

**Causas possíveis**:
1. As funções serverless não foram deployadas
2. A pasta `/api` está no lugar errado
3. O `vercel.json` está incorreto

**Soluções**:

1. Verifique a estrutura de pastas:
   ```
   projeto/
   ├── api/           ← Deve estar na RAIZ
   │   └── get-user-by-username.js
   ├── index.html
   └── vercel.json
   ```

2. Verifique o `vercel.json`:
   ```json
   {
     "functions": {
       "api/**/*.js": {
         "memory": 1024,
         "maxDuration": 10
       }
     }
   }
   ```

3. Refaça o deploy:
   ```bash
   vercel --prod
   ```

### 3. Erro 500 na API

**Sintoma**:
```
GET /api/get-user-by-username?username=cristiano 500 (Internal Server Error)
```

**Soluções**:

1. Veja os logs da função:
   ```bash
   vercel logs
   ```

2. Ou no dashboard: Vercel > Seu Projeto > Functions > Logs

3. Causas comuns:
   - **API Key inválida**: Verifique em `/api/get-user-by-username.js`
   - **Erro de sintaxe**: Revise o código JavaScript
   - **Timeout**: Aumente em `vercel.json`:
     ```json
     "maxDuration": 30
     ```

### 4. Erro 401 - Unauthorized

**Sintoma**:
```json
{
  "error": "SearchAPI error: 401"
}
```

**Causa**: API Key inválida ou expirada

**Solução**:

1. Verifique a chave no arquivo `/api/get-user-by-username.js`:
   ```javascript
   const API_KEY = 'FkdBFDFqFcSoNpjUFfbbr4AM';
   ```

2. Teste a chave manualmente:
   ```bash
   curl "https://www.searchapi.io/api/v1/search?engine=instagram_profile&username=cristiano&api_key=FkdBFDFqFcSoNpjUFfbbr4AM"
   ```

3. Se a chave expirou:
   - Acesse [searchapi.io/dashboard](https://www.searchapi.io/dashboard)
   - Gere uma nova chave
   - Atualize o código
   - Faça novo deploy

### 5. Erro 429 - Too Many Requests

**Sintoma**:
```json
{
  "error": "SearchAPI error: 429"
}
```

**Causa**: Limite de requisições excedido

**Soluções**:

1. **Curto prazo**: Aguarde alguns minutos

2. **Médio prazo**: Implemente cache:
   ```javascript
   // Adicione no arquivo da API
   const cache = new Map();
   const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

   // Antes de chamar a API
   const cacheKey = username.toLowerCase();
   if (cache.has(cacheKey)) {
     const cached = cache.get(cacheKey);
     if (Date.now() - cached.timestamp < CACHE_TTL) {
       return res.status(200).json(cached.data);
     }
   }
   ```

3. **Longo prazo**: Upgrade do plano na SearchAPI.io

### 6. Dados não aparecem no Modal

**Sintoma**: Modal abre mas está vazio ou mostra "undefined"

**Soluções**:

1. Verifique a resposta da API no Network:
   - F12 > Network > Clique na requisição
   - Veja o JSON retornado
   - Compare com o esperado

2. Verifique o mapeamento de dados no código

3. Abra o Console e veja se há erros ao processar o JSON

### 7. Foto de Perfil não carrega

**Sintoma**: Imagem quebrada ou não aparece

**Causas**:
1. URL da imagem inválida
2. Instagram bloqueou o acesso
3. Problema de CORS

**Soluções**:

1. Verifique a URL no Network:
   ```javascript
   // No console
   console.log('Avatar URL:', data.profile.avatar);
   ```

2. Se a URL está correta mas não carrega:
   - É uma limitação do Instagram
   - Use um proxy de imagens
   - Ou deixe o ícone padrão

### 8. Site lento

**Sintoma**: Demora muito para carregar

**Soluções**:

1. **Otimize imagens**:
   - Comprima PNGs e JPGs
   - Use WebP quando possível

2. **Minifique JavaScript**:
   ```bash
   npm install -g terser
   terser assets/js/api-interceptor.js -o assets/js/api-interceptor.min.js -c -m
   ```

3. **Configure cache no Vercel**:
   ```json
   {
     "headers": [
       {
         "source": "/assets/(.*)",
         "headers": [
           {
             "key": "Cache-Control",
             "value": "public, max-age=31536000, immutable"
           }
         ]
       }
     ]
   }
   ```

### 9. CORS Errors

**Sintoma**:
```
Access to fetch at '...' from origin '...' has been blocked by CORS policy
```

**Solução**:

Já está configurado no `vercel.json`, mas se o erro persistir:

1. Verifique os headers na API:
   ```javascript
   res.setHeader('Access-Control-Allow-Origin', '*');
   res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
   ```

2. Se chamar de outro domínio, configure:
   ```javascript
   res.setHeader('Access-Control-Allow-Origin', 'https://seudominio.com');
   ```

### 10. Modal não fecha

**Sintoma**: Ao clicar fora do modal, nada acontece

**Causa**: JavaScript do modal não está funcionando

**Solução**:

Verifique se os event listeners estão funcionando:
```javascript
// No console
console.log('Modal handlers:', typeof window.closeModal);
```

### 11. Username inválido aceito

**Sintoma**: Permite buscar usernames com caracteres inválidos

**Solução**:

A validação está no `api-interceptor.js`:
```javascript
window.validateInstagramUsername = function(username) {
  if (!username) return false;
  username = username.replace('@', '');
  const regex = /^[a-zA-Z0-9._]{1,30}$/;
  return regex.test(username);
};
```

Use antes de fazer a busca:
```javascript
if (!validateInstagramUsername(username)) {
  alert('Username inválido!');
  return;
}
```

### 12. Deploy falha na Vercel

**Sintomas**:
- Build error
- Deployment failed
- Function timeout

**Soluções**:

1. **Build error**:
   - Verifique sintaxe dos arquivos `.js`
   - Valide o `vercel.json`:
     ```bash
     # Instale JSON linter
     npm install -g jsonlint
     jsonlint vercel.json
     ```

2. **Function timeout**:
   - Aumente o timeout no `vercel.json`:
     ```json
     "maxDuration": 30
     ```

3. **Deployment failed**:
   - Veja os logs: `vercel logs`
   - Ou no dashboard: Vercel > Projeto > Deployments > Failed > Logs

### 13. Não funciona em produção mas funciona local

**Sintoma**: Funciona com `vercel dev` mas não no site publicado

**Soluções**:

1. Certifique-se de fazer deploy de produção:
   ```bash
   vercel --prod
   ```

2. Limpe o cache da Vercel:
   - Dashboard > Settings > General
   - Clique em "Redeploy"
   - Marque "Use existing Build Cache" = NO

3. Verifique variáveis de ambiente:
   - Se usar `.env`, configure no dashboard

### 14. Outros Erros

#### Browser mostra "Script error"

**Causa**: Erro JavaScript genérico

**Solução**: Desabilite CORS temporariamente no navegador ou veja logs completos no console

#### "Cannot read property of undefined"

**Causa**: Tentando acessar propriedade que não existe

**Solução**: Adicione verificações:
```javascript
const name = data?.user?.full_name || 'Nome não disponível';
```

#### "JSON.parse error"

**Causa**: Resposta não é JSON válido

**Solução**: Veja a resposta raw no Network e valide

## Ferramentas de Debug

### 1. Console do Navegador

```javascript
// Ver todos os dados armazenados
console.log('localStorage:', localStorage);

// Ver último perfil buscado
console.log('Username:', localStorage.getItem('username'));
console.log('User ID:', localStorage.getItem('userId'));

// Testar API manualmente
fetch('/api/get-user-by-username?username=cristiano')
  .then(r => r.json())
  .then(data => console.log('API Response:', data));
```

### 2. Vercel CLI

```bash
# Ver logs em tempo real
vercel logs --follow

# Ver informações do deploy
vercel inspect

# Ver lista de funções
vercel list
```

### 3. Network Monitor

1. F12 > Network
2. Marque "Preserve log"
3. Faça a ação que causa problema
4. Analise as requisições

### 4. Teste da API direta

```bash
# Teste local (se usando vercel dev)
curl "http://localhost:3000/api/get-user-by-username?username=cristiano"

# Teste produção
curl "https://seu-projeto.vercel.app/api/get-user-by-username?username=cristiano"
```

## Precisa de mais ajuda?

1. Revise o README.md
2. Veja DEPLOY-GUIDE.md
3. Consulte [Documentação SearchAPI.io](https://www.searchapi.io/docs)
4. Consulte [Documentação Vercel](https://vercel.com/docs)

## Reportar Bugs

Se encontrar um bug não listado aqui:

1. Descreva o problema
2. Inclua mensagens de erro
3. Informe o navegador/SO
4. Compartilhe logs da Vercel
5. Envie screenshot se necessário
