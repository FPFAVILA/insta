/**
 * API Interceptor - Sobrescreve chamadas antigas da API
 * Redireciona para a nova SearchAPI.io Integration
 */

(function() {
  console.log('🔄 API Interceptor carregado - SearchAPI.io');

  // Sobrescreve o fetch original
  const originalFetch = window.fetch;

  window.fetch = async function(...args) {
    let [url, options] = args;

    // Converte URL para string se for um objeto Request
    const urlString = typeof url === 'string' ? url : url.url;

    console.log('🌐 Interceptando fetch:', urlString);

    // Verifica se é uma chamada para a API antiga
    if (urlString.includes('/api/get-user-by-username')) {
      console.log('✅ Redirecionando para nova API');
      // Mantém a mesma URL, mas agora vai para nossa nova API route
    }

    if (urlString.includes('/api/get-stories')) {
      console.log('✅ Usando mock de stories');
    }

    if (urlString.includes('/api/get-following')) {
      console.log('✅ Usando mock de following');
    }

    // Continua com a requisição original
    return originalFetch.apply(this, args);
  };

  // Adiciona helper para validar username
  window.validateInstagramUsername = function(username) {
    if (!username) return false;

    // Remove @ se existir
    username = username.replace('@', '');

    // Valida formato do username do Instagram
    const regex = /^[a-zA-Z0-9._]{1,30}$/;
    return regex.test(username);
  };

  // Helper para formatar números
  window.formatNumber = function(num) {
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
  };

  console.log('✅ API Interceptor ativo');
})();
