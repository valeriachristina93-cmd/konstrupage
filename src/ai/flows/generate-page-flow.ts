
'use server';

/**
 * @fileOverview This flow now acts as a "super prompt" generator. It takes structured user input
 * and merges it into a detailed Product Requirements Document (PRD) prompt template. The output is
 * the final, complete prompt string, ready to be used in another AI model.
 *
 * - generatePageFlow - A function that takes structured data and returns a complete prompt string.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const StructuredPromptSchema = z.object({
  pageType: z.string().describe("The type of page to create (e.g., 'Página presell robusta', 'Página review')."),
  productName: z.string().optional().describe("The name of the product."),
  videoReviewLink: z.string().optional().describe("The URL for a video review."),
  salesPageLink: z.string().optional().describe("The URL for the main sales page."),
  affiliateLink: z.string().optional().describe("The main affiliate link to be used."),
  description: z.string().describe("The detailed description or extracted content for the page."),
  language: z.string().optional().describe("The language for the generated content."),
  advancedSettings: z.object({
    facebookPixelId: z.string().optional(),
    googleAdsId: z.string().optional(),
    customHtml: z.string().optional(),
  }).describe("Advanced tracking and custom code settings."),
});

// The output is now a simple string containing the generated prompt.
const GeneratedPromptSchema = z.string();

export const generatePageFlow = ai.defineFlow(
  {
    name: 'generatePageFlow',
    inputSchema: StructuredPromptSchema,
    outputSchema: GeneratedPromptSchema,
  },
  async (input) => {
    // This is the PRD prompt template.
    const prdTemplate = `
# Prompt PRD Otimizado para Geração de Página de Review Profissional (Versão 2.0 - Design Profissional)

Este documento serve como um **Product Requirements Document (PRD)** detalhado, destinado a uma Inteligência Artificial (IA) com capacidade de geração de código (HTML/CSS/JS) e conteúdo (Copywriting) para a criação de uma **Página de Review de Alta Conversão e Design Premium**.

O objetivo é elevar o padrão de excelência, garantindo que o resultado final seja percebido como "super profissional" pelo usuário, incorporando as melhores práticas de design moderno e otimização de performance.

## 1. Contexto e Dados de Entrada

A IA deve utilizar as seguintes informações para extrair dados, inspiração de design e definir os objetivos de conversão:

| Campo | Valor | Propósito |
| :--- | :--- | :--- |
| **Tipo de Página** | \`${input.pageType}\` | Define a estrutura e o tom do conteúdo. |
| **Idioma do Conteúdo** | \`${input.language || 'Português (Brasil)'}\` | **CRÍTICO:** Todo o conteúdo textual gerado (títulos, parágrafos, botões) DEVE ser estritamente neste idioma. |
| **Nome do Produto** | \`${input.productName || 'Não informado'}\` | Usado para pesquisa de conteúdo, SEO e títulos. |
| **Link da Página de Vendas (Fonte)** | \`${input.salesPageLink || 'Não informado'}\` | Fonte primária para extração de conteúdo (texto, benefícios, imagens), análise de design e tom de voz. |
| **Link de Afiliado (CTA Target)** | \`${input.affiliateLink || 'Não informado'}\` | URL de destino para **TODOS** os botões de Call-to-Action (CTA). |
| **Link do Vídeo Review (Opcional)** | \`${input.videoReviewLink || 'Não informado'}\` | Vídeo a ser incorporado na Seção Hero. Se não fornecido, a IA deve buscar um vídeo relevante no YouTube. |
| **Descrição / Conteúdo Principal** | \`\`\`${input.description}\`\`\` | Conteúdo base para a criação da narrativa da página. |
| **Configurações Avançadas** | Facebook Pixel: \`${input.advancedSettings.facebookPixelId || 'Nenhum'}\`, Google Ads: \`${input.advancedSettings.googleAdsId || 'Nenhum'}\`, HTML Customizado: \`${input.advancedSettings.customHtml ? 'Sim' : 'Não'}\` | Scripts e códigos para incluir na página final. |


**Ação da IA:**
1.  **Extração de Dados:** A IA deve acessar o \`[LINK_PAGINA_VENDAS]\` para extrair textos-chave, benefícios, características, depoimentos e URLs de imagens.
2.  **Análise de Design:** O design, paleta de cores e tipografia da página de vendas devem servir como **inspiração** para manter a coerência visual da marca, mas a IA deve **aprimorar** o design para um padrão moderno e minimalista.
3.  **Análise de Conteúdo:** O conteúdo extraído deve ser analisado para construir uma narrativa de review **coerente, profissional e persuasiva**.

## 2. Diretrizes de Excelência (Persona da IA)

**Atue como um Arquiteto de Soluções Digitais Sênior, Especialista em UX/UI e Copywriter de Alta Performance.** Sua entrega deve refletir o padrão de excelência em quatro pilares:

1.  **Qualidade de Código (Performance):** O código deve ser **limpo, semântico (HTML5), bem documentado e organizado**. **Prioridade máxima** à **performance (velocidade de carregamento)**, utilizando técnicas como minificação, otimização de imagens (WebP, <100KB) e \`lazy loading\`.
2.  **Experiência do Usuário (UX):** O design deve ser **Mobile-First**, intuitivo, rápido e responsivo em todos os dispositivos. Deve incluir um **Menu Fixo (Sticky Header)** com CTA visível para maximizar a conversão em qualquer ponto da rolagem.
3.  **Design Premium (UI):** O design deve ser **Minimalista Ousado**, com amplo uso de **espaço em branco** para foco. A tipografia deve ser moderna e de alta legibilidade. Deve incorporar **micro-interações** e **animações sutis** (efeitos de \`hover\`, transições suaves) para uma experiência moderna e polida.
4.  **Objetivo de Negócio (Conversão):** O principal objetivo da página é a **conversão**. Todo o conteúdo e design devem ser otimizados para guiar o usuário ao clique no \`[LINK_AFILIADO]\`.

## 3. Requisitos de Conteúdo e Copywriting

A IA deve utilizar técnicas de **Copywriting Persuasivo** e **Storytelling** em todas as seções, empregando os seguintes **Gatilhos Mentais** de forma estratégica:

*   **Prova Social:** Depoimentos, estrelas, números de clientes.
*   **Autoridade:** Linguagem profissional, dados concretos e referências científicas (se aplicável ao produto).
*   **Urgência/Escassez:** Ofertas por tempo limitado, contadores regressivos (se aplicável).
*   **Garantia/Segurança:** Reforçar a política de devolução e a segurança da compra.

**Conteúdo Específico:**
*   **Review Coerente:** O texto deve ser escrito na perspectiva de um **revisor imparcial, mas entusiasmado**, que testou o produto e atesta seus benefícios.
*   **Imagens:** Utilize as imagens extraídas do \`[LINK_PAGINA_VENDAS]\`. Se for necessário buscar imagens externas, elas devem ser **diretamente relacionadas, de alta qualidade e com tratamento visual coeso** (ex: fundo transparente, estilo de ícones unificado).
*   **Depoimentos/Comentários:** Se a extração não fornecer depoimentos suficientes, a IA deve **gerar depoimentos coerentes e realistas** que reforcem os principais benefícios do produto (Prova Social), incluindo avatares/fotos de perfil de alta qualidade.

## 4. Estrutura da Página (Ordem Ideal)

A IA deve criar uma página de review completa, com um **Menu de Navegação Fixo** (Sticky Header), **Corpo de Seções** e um **Rodapé** bem estruturado. A estrutura mínima ideal é:

| ID | Seção | Conteúdo e Objetivo |
| :--- | :--- | :--- |
| **1** | **Hero (Destaque)** | Título principal (H1), Estrelas de Avaliação (visuais), Vídeo Review (incorporado, sem redirecionamento para o YouTube), e um **CTA de Alto Destaque**. Deve ser visualmente impactante e moderno. |
| **2** | **Barra de Confiança** | Uma barra logo abaixo do Hero (ou fixa) com ícones de segurança (Compra Segura, Satisfação Garantida, Entrega Rápida). |
| **3** | **Análise Detalhada (Benefícios)** | Seções de conteúdo que detalham os principais benefícios e características do produto, utilizando **ícones e layouts modernos** (ex: cards, grids). |
| **4** | **Prova Social (Carrossel/Grid)** | Distribuição de Estrelas e 3-5 Depoimentos/Reviews gerados ou extraídos, apresentados em um formato visualmente atraente (ex: carrossel ou grid com avatares). |
| **5** | **Oferta/Pacotes (Tabela de Preços)** | Apresentação clara dos pacotes de compra (3 opções, se aplicável) em uma **tabela de preços moderna e responsiva**, com destaque para a melhor oferta. |
| **6** | **Garantia e Segurança** | Seção dedicada a remover objeções, destacando a garantia e a segurança da compra com um design que transmita **confiança** (ex: selos de segurança, ícones de cadeado). |
| **7** | **FAQ (Acordeão)** | Mínimo de 5 perguntas e respostas que abordem dúvidas comuns e objeções, apresentadas em um formato de **acordeão** para otimizar o espaço e a UX. |
| **8** | **CTA Final Impactante** | Um grande e impactante Call-to-Action final, com um design que utilize contraste e urgência. |

**Regra de Ouro:** Deve haver **Botões CTA** (com o \`[LINK_AFILIADO]\`) estrategicamente posicionados em **todas as seções visíveis** da página, incluindo um **Menu Fixo (Sticky Header)** com CTA.

## 5. Requisitos de Design e Técnico

### 5.1. Design (Princípios Obrigatórios para "Super Profissional")

*   **Design System Coeso:** A IA deve definir uma paleta de cores e um conjunto de fontes que trabalhem em harmonia.
    *   **Paleta de Cores:** Inspirada na página de vendas (verde/azul/branco), mas refinada para um visual **clean e moderno**. Definir uma cor primária (para CTAs e destaque), uma cor secundária e cores neutras (fundo, texto).
    *   **Tipografia:** Escolher uma combinação de fontes do Google Fonts (ex: Montserrat/Poppins para títulos e Lato/Roboto para corpo) com foco em **legibilidade e modernidade**.
*   **Layout:** Amplo uso de **espaço em branco** (whitespace) para criar uma sensação de leveza e profissionalismo. Uso de **grids** e alinhamentos precisos.
*   **Elementos Visuais:** Ícones vetoriais (SVG ou biblioteca de ícones) de alta qualidade. Uso de **sombras suaves** (soft shadows) e **bordas arredondadas** para um toque moderno.
*   **Acessibilidade (a11y):** Contraste adequado (WCAG AA), tags semânticas e atributos \`alt\` descritivos.

### 5.2. Requisitos Técnicos

*   **Tecnologias:** HTML, CSS e JavaScript. O código final DEVE ser entregue em um **ÚNICO bloco de código HTML completo**, com o CSS embutido na tag \`<style>\` dentro do \`<head>\` e o JavaScript embutido na tag \`<script>\` antes do fechamento do \`</body>\`. Links externos (como Google Fonts e bibliotecas de ícones) são permitidos via CDN.
*   **Framework CSS:** A IA deve **escolher e declarar** o framework a ser usado (ex: **Tailwind CSS** ou **Bootstrap 5**). **Recomenda-se Tailwind CSS** para maior flexibilidade e um visual menos "template" e mais customizado.
*   **Ícones:** A IA deve **escolher e declarar** a biblioteca de ícones (ex: Font Awesome, Heroicons).
*   **Otimização:** Imagens otimizadas (WebP, <100KB), \`lazy loading\` para imagens abaixo da dobra, e minificação de código.
*   **Validação:** O resultado final deve ser **responsivo** e **sem erros** de console ou desalinhamentos em qualquer breakpoint.

## 6. Entregável

A IA deve fornecer o código completo da página de review em um **ÚNICO BLOCO DE CÓDIGO HTML**, seguindo esta ordem de apresentação:

1.  **Planejamento:** Breve descrição do layout e das escolhas de design (cores, fontes, framework, justificativa do design "super profissional").
2.  **Código HTML:** Estrutura completa.
3.  **Código CSS:** Estilização completa (embutida no \`<style>\`).
4.  **Código JavaScript (se necessário):** Funcionalidades adicionais (embutido no \`<script>\`).
5.  **Validação:** Confirmação de que todos os requisitos (responsividade, CTAs, coerência, design premium) foram atendidos.

**A IA deve assumir defaults profissionais e modernos para qualquer detalhe não especificado, priorizando a estética e a performance.**
    `;

    // The "flow" now simply performs the string replacement and returns the result.
    // No AI call is needed here to generate the prompt itself.
    return prdTemplate;
  }
);
