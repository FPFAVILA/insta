// API Route para buscar perfil do Instagram usando SearchAPI.io
// Compatível com Vercel Serverless Functions

const API_KEY = 'FkdBFDFqFcSoNpjUFfbbr4AM';
const SEARCHAPI_URL = 'https://www.searchapi.io/api/v1/search';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { username } = req.query;

    if (!username) {
      return res.status(400).json({
        error: 'Username is required',
        message: 'Por favor, forneça um username válido'
      });
    }

    console.log(`🔍 Buscando perfil: @${username}`);

    // Chama a SearchAPI.io
    const searchParams = new URLSearchParams({
      engine: 'instagram_profile',
      username: username.replace('@', ''),
      api_key: API_KEY
    });

    const response = await fetch(`${SEARCHAPI_URL}?${searchParams.toString()}`);

    if (!response.ok) {
      throw new Error(`SearchAPI error: ${response.status}`);
    }

    const data = await response.json();

    // Verifica se o perfil existe
    if (!data.profile) {
      return res.status(404).json({
        error: 'Profile not found',
        message: 'Perfil não encontrado'
      });
    }

    // Mapeia os dados da nova API para o formato esperado pelo frontend
    const mappedUser = {
      // Dados básicos
      pk: Math.random().toString(36).substring(2, 15), // ID fictício já que a nova API não retorna
      username: data.profile.username,
      full_name: data.profile.name || data.profile.username,
      biography: data.profile.bio || '',

      // Imagens de perfil
      profile_pic_url: data.profile.avatar,
      hd_profile_pic_url_info: {
        url: data.profile.avatar_hd || data.profile.avatar
      },

      // Contadores
      follower_count: data.profile.followers,
      following_count: data.profile.following,
      media_count: data.profile.posts,

      // Verificações
      is_private: false, // A nova API não retorna isso, assumimos público
      is_verified: data.profile.is_verified || false,
      is_business: data.profile.is_business || false,

      // Links externos
      external_url: data.profile.external_link || null,
      bio_links: data.profile.bio_links || [],

      // Perfis sugeridos (mock - a nova API não retorna isso)
      chaining_results: []
    };

    console.log(`✅ Perfil encontrado: @${mappedUser.username} (${mappedUser.follower_count} seguidores)`);

    return res.status(200).json({
      user: mappedUser,
      search_metadata: data.search_metadata
    });

  } catch (error) {
    console.error('❌ Erro ao buscar perfil:', error);

    return res.status(500).json({
      error: 'Internal server error',
      message: 'Erro ao buscar perfil. Tente novamente.',
      details: error.message
    });
  }
}
