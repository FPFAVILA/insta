# Guia Completo de Deploy na Vercel

## Passo a Passo Detalhado

### 1. Preparar o Projeto

Certifique-se de que todos os arquivos estão presentes:

```
projeto/
├── api/
│   ├── get-user-by-username.js
│   ├── get-stories.js
│   └── get-following.js
├── assets/
│   ├── css/
│   ├── js/
│   │   └── api-interceptor.js
│   ├── img/
│   └── font/
├── index.html
├── vercel.json
├── package.json
├── README.md
└── .vercelignore
```

### 2. Criar Conta na Vercel

1. Acesse [vercel.com](https://vercel.com)
2. Clique em "Sign Up"
3. Use GitHub, GitLab ou BitBucket (recomendado)
4. Ou crie com email

### 3. Deploy via GitHub (Recomendado)

#### 3.1 Criar Repositório no GitHub

```bash
# Na pasta do projeto
git init
git add .
git commit -m "Initial commit - SearchAPI.io integration"
```

#### 3.2 Conectar ao GitHub

```bash
# Crie um repositório no GitHub primeiro
# Depois:
git remote add origin https://github.com/SEU-USUARIO/SEU-REPO.git
git branch -M main
git push -u origin main
```

#### 3.3 Importar no Vercel

1. Acesse [vercel.com/new](https://vercel.com/new)
2. Clique em "Import Git Repository"
3. Selecione seu repositório
4. Configure:
   - **Project Name**: escolha um nome (ex: instagram-analyzer)
   - **Framework Preset**: Other
   - **Root Directory**: ./
   - **Build Command**: (deixe vazio)
   - **Output Directory**: ./
   - **Install Command**: npm install (ou deixe vazio)
5. Clique em "Deploy"

### 4. Deploy via CLI (Alternativa)

#### 4.1 Instalar Vercel CLI

```bash
npm install -g vercel
```

#### 4.2 Login

```bash
vercel login
```

Escolha o método de login (GitHub, GitLab, etc.)

#### 4.3 Deploy de Desenvolvimento

```bash
cd /caminho/do/projeto
vercel
```

Responda às perguntas:
- Set up and deploy? **Y**
- Which scope? Escolha sua conta
- Link to existing project? **N**
- What's your project's name? **instagram-analyzer**
- In which directory is your code located? **./**
- Want to modify these settings? **N**

#### 4.4 Deploy de Produção

```bash
vercel --prod
```

### 5. Verificar o Deploy

#### 5.1 Acessar o Site

A Vercel fornecerá uma URL como:
- `https://seu-projeto.vercel.app`

#### 5.2 Testar a API

Abra o navegador e teste:

```
https://seu-projeto.vercel.app/api/get-user-by-username?username=cristiano
```

Você deve ver um JSON com os dados do perfil.

#### 5.3 Testar o Frontend

1. Acesse `https://seu-projeto.vercel.app`
2. Clique em "Espionar Agora"
3. Digite um username (ex: cristiano)
4. Clique em "Confirmar"
5. Deve aparecer o modal com os dados

### 6. Verificar Logs

#### No Dashboard da Vercel

1. Acesse [vercel.com/dashboard](https://vercel.com/dashboard)
2. Clique no seu projeto
3. Vá em "Functions"
4. Clique em uma função
5. Veja os logs em tempo real

#### Via CLI

```bash
vercel logs
```

### 7. Domínio Personalizado (Opcional)

#### 7.1 Adicionar Domínio

1. No dashboard do projeto, clique em "Settings"
2. Vá em "Domains"
3. Clique em "Add"
4. Digite seu domínio
5. Configure o DNS conforme instruções

#### 7.2 Configurar DNS

Adicione um registro CNAME:
```
CNAME: www -> cname.vercel-dns.com
```

Ou A record:
```
A: @ -> 76.76.21.21
```

### 8. Configurações Avançadas

#### 8.1 Variáveis de Ambiente

Se quiser adicionar variáveis (opcional):

1. Dashboard > Settings > Environment Variables
2. Adicione:
   - Name: `SEARCHAPI_KEY`
   - Value: `FkdBFDFqFcSoNpjUFfbbr4AM`
   - Environment: Production, Preview, Development

Depois, atualize o código para usar:
```javascript
const API_KEY = process.env.SEARCHAPI_KEY || 'FkdBFDFqFcSoNpjUFfbbr4AM';
```

#### 8.2 Configurar Regiões

No `vercel.json`, adicione:
```json
{
  "regions": ["gru1"]  // São Paulo
}
```

Regiões disponíveis:
- `gru1` - São Paulo
- `iad1` - Washington DC
- `sfo1` - San Francisco
- `hnd1` - Tokyo

### 9. Monitoramento

#### 9.1 Analytics

1. Dashboard > Analytics
2. Veja visitas, países, dispositivos

#### 9.2 Speed Insights

1. Dashboard > Speed Insights
2. Veja performance do site

### 10. Troubleshooting

#### Erro: "Deployment Failed"

Verifique:
- Estrutura de pastas está correta
- `vercel.json` está válido
- Não há erros de sintaxe nos arquivos JS

#### Erro: "Function returned invalid response"

Verifique:
- A função está retornando `res.status().json()`
- Não há erros de sintaxe
- A API Key está correta

#### Site carrega mas API não funciona

1. Abra o console do navegador (F12)
2. Veja os erros na aba Console
3. Veja as requisições na aba Network
4. Verifique se as URLs estão corretas

#### API retorna 404

Verifique:
- Pasta `/api` está na raiz do projeto
- Arquivos têm extensão `.js`
- `vercel.json` está configurado corretamente

### 11. Atualizações Futuras

#### Via Git

```bash
git add .
git commit -m "Sua mensagem"
git push
```

A Vercel fará deploy automático!

#### Via CLI

```bash
vercel --prod
```

### 12. Rollback (Voltar Versão)

Se algo der errado:

1. Dashboard > Deployments
2. Encontre o deploy anterior
3. Clique nos 3 pontos (...)
4. Clique em "Promote to Production"

### 13. Excluir Projeto

Se precisar remover:

1. Dashboard > Settings
2. Role até o final
3. Clique em "Delete Project"
4. Confirme digitando o nome

## Checklist Final

Antes de considerar concluído:

- [ ] Site carrega corretamente
- [ ] Campo de busca funciona
- [ ] Modal de confirmação aparece
- [ ] Dados do perfil são exibidos (foto, nome, bio, etc)
- [ ] API retorna JSON válido em `/api/get-user-by-username`
- [ ] Console não mostra erros críticos
- [ ] Teste com múltiplos usernames
- [ ] Teste em mobile
- [ ] Teste em diferentes navegadores

## Comandos Úteis

```bash
# Ver status do projeto
vercel

# Ver logs em tempo real
vercel logs

# Ver informações do projeto
vercel inspect

# Remover projeto
vercel remove

# Listar projetos
vercel list

# Ajuda
vercel --help
```

## Suporte

- [Documentação Vercel](https://vercel.com/docs)
- [Discord Vercel](https://vercel.com/discord)
- [Comunidade](https://github.com/vercel/community)

## Conclusão

Seu projeto está pronto para deploy! Siga este guia passo a passo e em poucos minutos estará no ar.

Em caso de dúvidas, consulte os logs e a documentação oficial da Vercel.

Boa sorte!
