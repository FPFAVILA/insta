// API Route para following (mock - SearchAPI não fornece isso)
// Retorna lista vazia para não quebrar o sistema

export default async function handler(req, res) {
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
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({
        error: 'User ID is required'
      });
    }

    // Retorna lista vazia (a SearchAPI não fornece lista de following)
    const mockResponse = {
      response: {
        users: []
      }
    };

    return res.status(200).json(mockResponse);

  } catch (error) {
    console.error('Erro ao buscar following:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}
