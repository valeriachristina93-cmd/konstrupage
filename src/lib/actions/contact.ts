'use server';

import { z } from 'zod';

const contactSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
});

// A URL do script está armazenada aqui de forma segura no servidor.
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby_g3A3yK3n1w1yAd7Jj3v0ltoRzJ2d-E0cKWHC3hYVp0yS2k-b_uG2V06aCqg-jXyA/exec';

/**
 * Envia os dados de contato para a Planilha Google.
 * Esta função é executada apenas no servidor.
 */
export async function saveContact(data: { name: string; email: string; phone: string; }) {
  try {
    // Valida os dados antes de enviar
    const validatedData = contactSchema.parse(data);

    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validatedData),
      // O modo 'no-cors' não é necessário ou útil em Server Actions.
      // A requisição é feita do servidor, então não há restrições de CORS.
    });

    // Como o script do Google Apps geralmente redireciona, a resposta pode não ser um JSON.
    // O mais importante é que a requisição foi enviada.
    if (!response.ok && response.status !== 302) { // 302 é um redirecionamento comum do Google Scripts
       console.error('Falha ao enviar para o Google Sheet, status:', response.status);
    }
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Erro de validação dos dados de contato:', error.issues);
    } else {
      console.error('Erro ao enviar contato para a Planilha Google:', error);
    }
    // Não lançamos o erro para o cliente para não interromper o fluxo de cadastro.
  }
}
