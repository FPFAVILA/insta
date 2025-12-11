# Instagram Profile Analyzer - SearchAPI.io Integration

Este projeto utiliza a SearchAPI.io para buscar informações de perfis públicos do Instagram.

## Nova API Integrada

A integração foi totalmente reconstruída usando a SearchAPI.io Instagram Profile API.

### API Key

A chave API está configurada diretamente no código:
- API Key: `FkdBFDFqFcSoNpjUFfbbr4AM`
- Endpoint: `https://www.searchapi.io/api/v1/search`

### Dados Retornados

A nova API retorna:
- Username
- Nome completo
- Bio
- Avatar (normal e HD)
- Número de seguidores
- Número de seguindo
- Número de posts
- Links externos
- Status de verificação
- Status de conta business

## Estrutura do Projeto

```
/api
  └── get-user-by-username.js  # API principal que busca perfis
  └── get-stories.js           # Mock para stories
  └── get-following.js         # Mock para following

/assets
  └── js
      └── api-interceptor.js   # Intercepta chamadas antigas

/vercel.json                   # Configuração do Vercel
/package.json                  # Dependências do projeto
/index.html                    # Página principal
```

## Deploy na Vercel

### Método 1: Via CLI

1. Instale a Vercel CLI:
```bash
npm install -g vercel
```

2. Faça login:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. Deploy para produção:
```bash
vercel --prod
```

### Método 2: Via GitHub

1. Suba o projeto para um repositório GitHub

2. Acesse [vercel.com](https://vercel.com)

3. Clique em "Import Project"

4. Selecione seu repositório

5. Configure:
   - Framework Preset: Other
   - Build Command: (deixe vazio)
   - Output Directory: `./`
   - Install Command: `npm install` (ou deixe vazio)

6. Clique em "Deploy"

### Método 3: Deploy Direto via Dashboard

1. Acesse [vercel.com/new](https://vercel.com/new)

2. Arraste a pasta do projeto ou selecione via GitHub

3. Configure como acima

4. Deploy

## Como Funciona

1. **Usuário digita o @ no campo de busca**
   - O sistema remove o @ automaticamente
   - Valida o formato do username

2. **Chamada à API**
   - A requisição vai para `/api/get-user-by-username?username=USUARIO`
   - A API route faz uma chamada para SearchAPI.io
   - Retorna os dados mapeados no formato esperado

3. **Exibição dos dados**
   - Os dados são exibidos no modal de confirmação
   - Foto de perfil em HD
   - Nome, bio, seguidores, seguindo, posts

## Testando Localmente

Para testar localmente, você precisa de um servidor que suporte Serverless Functions.

### Opção 1: Usando Vercel Dev

```bash
npm install -g vercel
vercel dev
```

Acesse: http://localhost:3000

### Opção 2: Usando um servidor HTTP simples

```bash
# Python 3
python -m http.server 8000

# Node.js
npx http-server -p 8000
```

Acesse: http://localhost:8000

**Nota**: Com servidor simples, as API routes não funcionarão. Use Vercel Dev para testar as APIs.

## API Endpoints

### GET /api/get-user-by-username

Busca informações de um perfil do Instagram.

**Query Parameters:**
- `username` (required): Username do Instagram (sem @)

**Response:**
```json
{
  "user": {
    "pk": "random_id",
    "username": "cristiano",
    "full_name": "Cristiano Ronaldo",
    "biography": "SIUUUbscribe to my Youtube Channel!",
    "profile_pic_url": "https://...",
    "hd_profile_pic_url_info": {
      "url": "https://..."
    },
    "follower_count": 666962258,
    "following_count": 614,
    "media_count": 3957,
    "is_private": false,
    "is_verified": true,
    "is_business": true,
    "external_url": "http://avacr7.com/en",
    "bio_links": [],
    "chaining_results": []
  }
}
```

### GET /api/get-stories

Retorna stories (mock - API não fornece).

**Response:**
```json
{
  "reel": {
    "id": "user_id",
    "items": []
  }
}
```

### GET /api/get-following

Retorna lista de following (mock - API não fornece).

**Response:**
```json
{
  "response": {
    "users": []
  }
}
```

## Limitações

A SearchAPI.io Instagram Profile API não fornece:
- Stories
- Lista de seguidores/seguindo
- Posts individuais
- User ID real (geramos um fictício)
- Status de conta privada (assumimos público)

Para acessar essas informações, seria necessário integrar APIs adicionais.

## Troubleshooting

### Erro: "Username is required"
- Verifique se está passando o username corretamente na URL

### Erro: "Profile not found"
- O username não existe no Instagram
- Verifique se digitou corretamente

### Erro: "SearchAPI error: 401"
- Problema com a API Key
- Verifique se a chave está correta em `/api/get-user-by-username.js`

### Erro: "SearchAPI error: 429"
- Limite de requisições excedido
- Aguarde alguns minutos ou upgrade seu plano na SearchAPI.io

## Suporte

Para dúvidas sobre a SearchAPI.io, consulte:
- [Documentação oficial](https://www.searchapi.io/docs/instagram-profile)
- [Dashboard](https://www.searchapi.io/dashboard)

## Licença

Este projeto é apenas para fins educacionais.
