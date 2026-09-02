import { GoogleGenAI } from '@google/genai';
import { dataStore } from './db.js';

let geminiClient = null;

function getGemini() {
  if (!geminiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not set in environment variables.");
      return null;
    }
    geminiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return geminiClient;
}

// Function to find best matching products from our real database based on user query
export function findMatchingProducts(query, maxResults = 3) {
  const q = query.toLowerCase();
  const products = dataStore.data.products || [];

  // Match by budget, recipient, occasion, category or tags
  const scored = products.map(p => {
    let score = 0;
    const nameL = (p.name || '').toLowerCase();
    const descL = (p.description || '').toLowerCase();
    const catL = (p.category || '').toLowerCase();
    const occasionsL = (p.occasions || []).map(o => o.toLowerCase()).join(' ');
    const recipientsL = (p.recipients || []).map(r => r.toLowerCase()).join(' ');
    const tagsL = (p.tags || []).map(t => t.toLowerCase()).join(' ');

    const words = q.split(/\s+/).filter(w => w.length > 2);
    for (const w of words) {
      if (nameL.includes(w)) score += 5;
      if (catL.includes(w)) score += 4;
      if (recipientsL.includes(w)) score += 4;
      if (occasionsL.includes(w)) score += 4;
      if (tagsL.includes(w)) score += 3;
      if (descL.includes(w)) score += 1;
    }

    // Budget checks
    if (q.includes('under 25') || q.includes('under $25') || q.includes('cheap') || q.includes('affordable')) {
      if (p.discountPrice <= 35) score += 5;
    } else if (q.includes('under 50') || q.includes('under $50')) {
      if (p.discountPrice <= 50) score += 6;
      if (p.discountPrice > 50) score -= 10;
    } else if (q.includes('under 100') || q.includes('under $100')) {
      if (p.discountPrice <= 100) score += 4;
      if (p.discountPrice > 100) score -= 8;
    } else if (q.includes('luxury') || q.includes('premium') || q.includes('expensive') || q.includes('high end')) {
      if (p.discountPrice >= 100) score += 6;
    }

    // Specific occasions
    if (q.includes('birthday') && occasionsL.includes('birthday')) score += 5;
    if (q.includes('wedding') && occasionsL.includes('wedding')) score += 6;
    if (q.includes('anniversary') && occasionsL.includes('anniversary')) score += 6;
    if (q.includes('valentine') && occasionsL.includes('valentine')) score += 6;
    if (q.includes('mother') || q.includes('mom') && recipientsL.includes('mom')) score += 6;
    if (q.includes('father') || q.includes('dad') && recipientsL.includes('dad')) score += 6;
    if (q.includes('her') || q.includes('wife') || q.includes('girlfriend') && recipientsL.includes('her')) score += 5;
    if (q.includes('him') || q.includes('husband') || q.includes('boyfriend') && recipientsL.includes('him')) score += 5;

    return { product: p, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.filter(s => s.score > 0).slice(0, maxResults).map(s => s.product);
}

// Check if message is strictly gifting related
export function isGiftingRelated(message) {
  const msg = message.toLowerCase();
  
  // Forbidden non-gifting indicators
  const nonGiftingKeywords = [
    'write code', 'javascript code', 'python script', 'solve equation', 'calculate math', 
    'algebra', 'integral', 'who won the election', 'political debate', 'write essay about',
    'medical advice', 'diagnose', 'symptoms of', 'fix my bug', 'sql query', 'physics formula',
    'football score', 'movie review', 'history of ww2', 'crypto market', 'stock analysis'
  ];

  for (const kw of nonGiftingKeywords) {
    if (msg.includes(kw)) {
      return false;
    }
  }

  return true;
}

let cachedGroqModel = null;
let lastModelFetch = 0;

async function getActiveGroqModel(apiKey) {
  const now = Date.now();
  if (cachedGroqModel && (now - lastModelFetch < 3600000)) {
    return cachedGroqModel;
  }

  try {
    const res = await fetch("https://api.groq.com/openai/v1/models", {
      headers: { "Authorization": `Bearer ${apiKey}` }
    });
    if (res.ok) {
      const data = await res.json();
      const models = data.data?.map(m => m.id) || [];
      const preferred = [
        "llama-3.1-8b-instant",
        "llama-3.3-70b-versatile",
        "llama-3.1-70b-versatile",
        "llama3-8b-8192",
        "llama3-70b-8192",
        "mixtral-8x7b-32768",
        "gemma2-9b-it"
      ];
      for (const pref of preferred) {
        if (models.includes(pref)) {
          cachedGroqModel = pref;
          lastModelFetch = now;
          return cachedGroqModel;
        }
      }
      if (models.length > 0) {
        cachedGroqModel = models[0];
        lastModelFetch = now;
        return cachedGroqModel;
      }
    }
  } catch {
    // Ignore network check error
  }
  return "llama-3.1-8b-instant";
}

export async function handleAIAssistantChat({ message, chatHistory = [] }) {
  if (!isGiftingRelated(message)) {
    return {
      reply: "Sorry, I can only help with gifting and gift-related questions. How may I assist you in finding the perfect gift today?",
      recommendedProducts: [],
      isRefusal: true
    };
  }

  // Find real relevant products from store database
  const matchingProducts = findMatchingProducts(message, 3);
  const productsSummary = matchingProducts.map(p => 
    `- ${p.name} ($${p.discountPrice || p.price}): ${p.shortDescription} (Category: ${p.category}, Slug: ${p.slug})`
  ).join('\n');

  const systemInstruction = `You are Blush Box Concierge, the AI Gifting Specialist for Blush Box - Haute Gifting Maison.
You have a warm, refined, polite, and sophisticated tone.
Your task is to help clients discover the ideal gift for their loved ones, colleagues, and special occasions.

STRICT POLICY:
1. You ONLY answer gifting-related questions (gift ideas, recipient advice, occasions, budgets, hampers, keepsakes, engravings).
2. For any non-gifting or unrelated queries (e.g., coding, politics, math, general trivia), politely refuse by saying: "Sorry, I can only help with gifting and gift-related questions."
3. When recommending items, refer SPECIFICALLY to the real store products provided in the context below. Do not make up non-existent products.
4. Keep your responses concise, elegant, and warm (under 120 words). Highlight why each recommended gift matches their need.

REAL PRODUCTS IN CURRENT INVENTORY MATCHING QUERY:
${productsSummary || "Our curated collection includes personalized hampers, fine jewelry, artisan Belgian chocolates, eternal roses, cashmere throws, and custom engraved keepsakes."}
`;

  // 1. Try Groq with dynamically discovered active model
  const groqApiKey = process.env.GROQ_API_KEY;
  if (groqApiKey) {
    try {
      const activeModel = await getActiveGroqModel(groqApiKey);
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${groqApiKey}`
        },
        body: JSON.stringify({
          model: activeModel,
          messages: [
            { role: "system", content: systemInstruction },
            ...chatHistory.slice(-4).map(h => ({ role: h.sender === 'user' ? 'user' : 'assistant', content: h.text })),
            { role: "user", content: message }
          ],
          temperature: 0.7,
          max_tokens: 300
        })
      });

      if (response.ok) {
        const data = await response.json();
        const reply = data.choices?.[0]?.message?.content;
        if (reply) {
          return {
            reply,
            recommendedProducts: matchingProducts
          };
        }
      }
    } catch {
      // Fallback
    }
  }

  // 2. Try Gemini API
  const ai = getGemini();
  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `${systemInstruction}\n\nUser Question: ${message}`,
      });

      if (response && response.text) {
        return {
          reply: response.text,
          recommendedProducts: matchingProducts
        };
      }
    } catch {
      // Fallback
    }
  }

  // 3. Fallback Smart Luxury Concierge Engine
  let smartReply = "";
  if (matchingProducts.length > 0) {
    const top = matchingProducts[0];
    smartReply = `For your request, I highly recommend our exquisite **${top.name}** ($${top.discountPrice || top.price}). ${top.shortDescription} It arrives beautifully encased in our signature velvet packaging with a personalized gift card.`;
  } else {
    smartReply = `I would be delighted to assist you. Our master artisans recommend exploring our signature **Royal Velvet & Champagne Celebration Hamper** or our **Custom Engraved Keepsakes**. What is the occasion or recipient you are celebrating?`;
  }

  return {
    reply: smartReply,
    recommendedProducts: matchingProducts.length > 0 ? matchingProducts : dataStore.data.products.slice(0, 2)
  };
}