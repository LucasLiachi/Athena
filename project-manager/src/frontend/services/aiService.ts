import { useApiConfig } from '@/contexts/ApiConfigContext';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export const useAiService = () => {
  const { config } = useApiConfig();

  const generateCompletion = async (messages: ChatMessage[], model: string = 'gpt-3.5-turbo') => {
    if (!config.baseUrl) {
      throw new Error("Base URL da API (ex: 9router) não configurada.");
    }

    const url = `${config.baseUrl.replace(/\/$/, '')}/chat/completions`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(config.apiKey ? { 'Authorization': `Bearer ${config.apiKey}` } : {})
      },
      body: JSON.stringify({
        model,
        messages,
      })
    });

    if (!response.ok) {
      throw new Error(`Erro na API de IA: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content as string;
  };

  return { generateCompletion };
};
