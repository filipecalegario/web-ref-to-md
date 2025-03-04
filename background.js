// Listener para quando o usuário clicar no ícone da extensão
chrome.action.onClicked.addListener((tab) => {
  // Executa um script na aba ativa para obter o título e URL
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: copyToClipboard
  });
});

// Função que será executada na página atual
function copyToClipboard() {
  // Obtém o título e URL da página atual
  const title = document.title;
  const url = window.location.href;

  // Obtém o texto selecionado na página
  const selectedText = window.getSelection().toString().trim();

  // Formata como Markdown: [Título](URL): Texto Selecionado
  let markdownLink = `[${title}](${url})`;
  if (selectedText.length > 0) {
    markdownLink = `[${title}](${url}): ${selectedText}`;
  }

  // Copia para a área de transferência
  navigator.clipboard.writeText(markdownLink)
    .then(() => {
      // Feedback visual para o usuário
      const notification = document.createElement('div');
      notification.textContent = `Link \"${title}\" copiado em formato Markdown!`;
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background-color: #4CAF50;
        color: white;
        padding: 16px;
        border-radius: 4px;
        z-index: 10000;
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        font-family: Arial, sans-serif;
      `;

      document.body.appendChild(notification);

      // Remove a notificação após 3 segundos
      setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.5s';
        setTimeout(() => notification.remove(), 500);
      }, 3000);
    })
    .catch(err => {
      console.error('Erro ao copiar para a área de transferência:', err);
    });
} 