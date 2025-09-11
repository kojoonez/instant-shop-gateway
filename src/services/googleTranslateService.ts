// Google Translate service for language detection and translation
// This is a simplified version that works without API keys for demo purposes

export interface LanguageDetectionResult {
  language: string;
  confidence: number;
}

export interface TranslationResult {
  translatedText: string;
  detectedSourceLanguage: string;
}

// Simple language detection based on common patterns
export async function detectLanguage(text: string): Promise<string> {
  if (!text || text.trim().length === 0) return 'en';

  // Check for common language patterns
  const patterns = {
    'en': /^[a-zA-Z\s.,!?;:'"()-]+$/,
    'fi': /[äöåÄÖÅ]/,
    'sv': /[äöåÄÖÅ]/,
    'es': /[ñáéíóúüÑÁÉÍÓÚÜ]/,
    'fr': /[àâäéèêëïîôùûüÿçÀÂÄÉÈÊËÏÎÔÙÛÜŸÇ]/,
    'de': /[äöüßÄÖÜ]/,
    'it': /[àèéìíîòóùúÀÈÉÌÍÎÒÓÙÚ]/,
    'pt': /[ãõáéíóúâêôçÃÕÁÉÍÓÚÂÊÔÇ]/,
    'ru': /[а-яёА-ЯЁ]/,
    'zh': /[\u4e00-\u9fff]/,
    'ja': /[\u3040-\u309f\u30a0-\u30ff]/,
    'ko': /[\uac00-\ud7af]/,
    'ar': /[\u0600-\u06ff]/,
    'hi': /[\u0900-\u097f]/
  };

  // Score each language based on pattern matches
  const scores: Record<string, number> = {};
  
  for (const [lang, pattern] of Object.entries(patterns)) {
    const matches = (text.match(pattern) || []).length;
    scores[lang] = matches;
  }

  // Find the language with the highest score
  const detectedLanguage = Object.entries(scores).reduce((a, b) => 
    scores[a[0]] > scores[b[0]] ? a : b
  )[0];

  // If no pattern matches, default to English
  return scores[detectedLanguage] > 0 ? detectedLanguage : 'en';
}

// Simple translation using a mock service (replace with real Google Translate API)
export async function translateText(text: string, targetLanguage: string): Promise<string> {
  if (!text || text.trim().length === 0) return text;

  // For demo purposes, we'll use a simple mock translation
  // In production, replace this with actual Google Translate API calls
  return await mockTranslate(text, targetLanguage);
}

// Mock translation function for demo purposes
async function mockTranslate(text: string, targetLanguage: string): Promise<string> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));

  // Simple mock translations for demo
  const mockTranslations: Record<string, Record<string, string>> = {
    'en': {
      'fi': 'Hei! Miten voin auttaa sinua tänään?',
      'sv': 'Hej! Hur kan jag hjälpa dig idag?',
      'es': '¡Hola! ¿Cómo puedo ayudarte hoy?',
      'fr': 'Bonjour! Comment puis-je vous aider aujourd\'hui?',
      'de': 'Hallo! Wie kann ich Ihnen heute helfen?'
    },
    'fi': {
      'en': 'Hello! How can I help you today?',
      'sv': 'Hej! Hur kan jag hjälpa dig idag?',
      'es': '¡Hola! ¿Cómo puedo ayudarte hoy?',
      'fr': 'Bonjour! Comment puis-je vous aider aujourd\'hui?',
      'de': 'Hallo! Wie kann ich Ihnen heute helfen?'
    },
    'sv': {
      'en': 'Hello! How can I help you today?',
      'fi': 'Hei! Miten voin auttaa sinua tänään?',
      'es': '¡Hola! ¿Cómo puedo ayudarte hoy?',
      'fr': 'Bonjour! Comment puis-je vous aider aujourd\'hui?',
      'de': 'Hallo! Wie kann ich Ihnen heute helfen?'
    }
  };

  // Check if we have a mock translation
  const sourceLanguage = await detectLanguage(text);
  
  if (mockTranslations[sourceLanguage] && mockTranslations[sourceLanguage][targetLanguage]) {
    return mockTranslations[sourceLanguage][targetLanguage];
  }

  // If no mock translation available, try reverse lookup
  if (mockTranslations[targetLanguage] && mockTranslations[targetLanguage][sourceLanguage]) {
    // This is a simplified approach - in reality, you'd need proper translation
    return `[Translated from ${sourceLanguage}] ${text}`;
  }

  // If no translation available, return original text with a note
  return `[${targetLanguage.toUpperCase()}] ${text}`;
}

// Real Google Translate API implementation (uncomment and configure for production)
/*
import { Translate } from '@google-cloud/translate';

const translate = new Translate({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

export async function detectLanguageReal(text: string): Promise<string> {
  try {
    const [detection] = await translate.detect(text);
    return detection.language;
  } catch (error) {
    console.error('Language detection error:', error);
    return 'en';
  }
}

export async function translateTextReal(text: string, targetLanguage: string): Promise<string> {
  try {
    const [translation] = await translate.translate(text, targetLanguage);
    return translation;
  } catch (error) {
    console.error('Translation error:', error);
    return text;
  }
}
*/

// Language code mapping
export const LANGUAGE_CODES: Record<string, string> = {
  'en': 'en',
  'fi': 'fi',
  'sv': 'sv',
  'es': 'es',
  'fr': 'fr',
  'de': 'de',
  'it': 'it',
  'pt': 'pt',
  'ru': 'ru',
  'zh': 'zh',
  'ja': 'ja',
  'ko': 'ko',
  'ar': 'ar',
  'hi': 'hi'
};

// Get language name from code
export function getLanguageName(code: string): string {
  const names: Record<string, string> = {
    'en': 'English',
    'fi': 'Finnish',
    'sv': 'Swedish',
    'es': 'Spanish',
    'fr': 'French',
    'de': 'German',
    'it': 'Italian',
    'pt': 'Portuguese',
    'ru': 'Russian',
    'zh': 'Chinese',
    'ja': 'Japanese',
    'ko': 'Korean',
    'ar': 'Arabic',
    'hi': 'Hindi'
  };
  return names[code] || code;
}
