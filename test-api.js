/**
 * Script de teste para a API SearchAPI.io
 * Execute: node test-api.js
 */

const API_KEY = 'FkdBFDFqFcSoNpjUFfbbr4AM';
const SEARCHAPI_URL = 'https://www.searchapi.io/api/v1/search';

async function testSearchAPI(username) {
  console.log('\n========================================');
  console.log(`🔍 Testando busca para: @${username}`);
  console.log('========================================\n');

  try {
    const searchParams = new URLSearchParams({
      engine: 'instagram_profile',
      username: username.replace('@', ''),
      api_key: API_KEY
    });

    const url = `${SEARCHAPI_URL}?${searchParams.toString()}`;
    console.log('📡 URL da requisição:', url.replace(API_KEY, 'API_KEY_HIDDEN'));

    const startTime = Date.now();
    const response = await fetch(url);
    const endTime = Date.now();

    console.log(`⏱️  Tempo de resposta: ${endTime - startTime}ms`);
    console.log(`📊 Status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    if (!data.profile) {
      console.log('❌ Perfil não encontrado');
      return null;
    }

    console.log('\n✅ Perfil encontrado!\n');
    console.log('📝 Dados do perfil:');
    console.log('─'.repeat(50));
    console.log(`👤 Username: @${data.profile.username}`);
    console.log(`📛 Nome: ${data.profile.name}`);
    console.log(`📖 Bio: ${data.profile.bio || '(sem bio)'}`);
    console.log(`👥 Seguidores: ${formatNumber(data.profile.followers)}`);
    console.log(`👥 Seguindo: ${formatNumber(data.profile.following)}`);
    console.log(`📸 Posts: ${formatNumber(data.profile.posts)}`);
    console.log(`✅ Verificado: ${data.profile.is_verified ? 'Sim' : 'Não'}`);
    console.log(`💼 Business: ${data.profile.is_business ? 'Sim' : 'Não'}`);

    if (data.profile.external_link) {
      console.log(`🔗 Link externo: ${data.profile.external_link}`);
    }

    if (data.profile.bio_links && data.profile.bio_links.length > 0) {
      console.log('\n🔗 Links na bio:');
      data.profile.bio_links.forEach((link, index) => {
        console.log(`   ${index + 1}. ${link.title}: ${link.url}`);
      });
    }

    console.log('\n🖼️  Avatar URLs:');
    console.log(`   Normal: ${data.profile.avatar.substring(0, 60)}...`);
    console.log(`   HD: ${data.profile.avatar_hd.substring(0, 60)}...`);

    console.log('\n📊 Metadata da busca:');
    console.log(`   Request ID: ${data.search_metadata.id}`);
    console.log(`   Tempo da API: ${data.search_metadata.request_time_taken}s`);

    return data.profile;

  } catch (error) {
    console.error('\n❌ Erro ao buscar perfil:', error.message);

    if (error.message.includes('401')) {
      console.error('\n🔑 Erro de autenticação. Verifique sua API Key.');
    } else if (error.message.includes('429')) {
      console.error('\n⚠️  Limite de requisições excedido. Aguarde alguns minutos.');
    } else if (error.message.includes('404')) {
      console.error('\n🔍 Perfil não encontrado. Verifique o username.');
    }

    return null;
  }
}

function formatNumber(num) {
  if (!num) return '0';

  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + 'B';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }

  return num.toString();
}

// Testes
async function runTests() {
  console.log('\n🧪 Iniciando testes da SearchAPI.io Instagram Profile API\n');

  // Teste 1: Perfil famoso
  await testSearchAPI('cristiano');

  await new Promise(resolve => setTimeout(resolve, 2000)); // Aguarda 2s entre testes

  // Teste 2: Outro perfil famoso
  await testSearchAPI('leomessi');

  await new Promise(resolve => setTimeout(resolve, 2000));

  // Teste 3: Perfil que pode não existir
  await testSearchAPI('usuarioinexistente123456789');

  console.log('\n========================================');
  console.log('✅ Testes concluídos!');
  console.log('========================================\n');
}

// Executa os testes
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { testSearchAPI };
