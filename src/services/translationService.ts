// Translation service for auto-translating messages between users and admins
import { detectLanguage, translateText } from './googleTranslateService';

export interface TranslationResult {
  originalText: string;
  translatedText: string;
  detectedLanguage: string;
  targetLanguage: string;
  confidence?: number;
}

export interface MessageTranslation {
  messageId: string;
  originalContent: string;
  translatedContent: string;
  originalLanguage: string;
  targetLanguage: string;
  isTranslated: boolean;
}

class TranslationService {
  private translationCache = new Map<string, TranslationResult>();
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

  // Get user's preferred language from i18n
  private getUserLanguage(): string {
    const savedLanguage = localStorage.getItem('i18nextLng') || 'en';
    return savedLanguage.split('-')[0]; // Get language code (e.g., 'en' from 'en-US')
  }

  // Get admin's preferred language (default to English)
  private getAdminLanguage(): string {
    return 'en'; // Admin always sees messages in English
  }

  // Detect if text needs translation
  private needsTranslation(text: string, targetLanguage: string): boolean {
    if (!text || text.trim().length === 0) return false;
    
    // Don't translate if it's already in the target language
    const detectedLang = this.detectLanguageFromText(text);
    return detectedLang !== targetLanguage;
  }

  // Simple language detection based on common patterns
  private detectLanguageFromText(text: string): string {
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

    for (const [lang, pattern] of Object.entries(patterns)) {
      if (pattern.test(text)) {
        return lang;
      }
    }

    // Default to English if no pattern matches
    return 'en';
  }

  // Get cache key for translation
  private getCacheKey(text: string, targetLanguage: string): string {
    return `${text.toLowerCase()}_${targetLanguage}`;
  }

  // Check if translation is cached and still valid
  private getCachedTranslation(text: string, targetLanguage: string): TranslationResult | null {
    const cacheKey = this.getCacheKey(text, targetLanguage);
    const cached = this.translationCache.get(cacheKey);
    
    if (cached && Date.now() - (cached as any).timestamp < this.CACHE_DURATION) {
      return cached;
    }
    
    return null;
  }

  // Cache translation result
  private cacheTranslation(text: string, targetLanguage: string, result: TranslationResult): void {
    const cacheKey = this.getCacheKey(text, targetLanguage);
    const cachedResult = { ...result, timestamp: Date.now() };
    this.translationCache.set(cacheKey, cachedResult);
  }

  // Translate text for user (admin message to user's language)
  async translateForUser(originalText: string, messageId: string): Promise<MessageTranslation> {
    const userLanguage = this.getUserLanguage();
    const adminLanguage = this.getAdminLanguage();

    // If user language is English, no translation needed
    if (userLanguage === adminLanguage) {
      return {
        messageId,
        originalContent: originalText,
        translatedContent: originalText,
        originalLanguage: adminLanguage,
        targetLanguage: userLanguage,
        isTranslated: false
      };
    }

    // Check cache first
    const cached = this.getCachedTranslation(originalText, userLanguage);
    if (cached) {
      return {
        messageId,
        originalContent: originalText,
        translatedContent: cached.translatedText,
        originalLanguage: cached.detectedLanguage,
        targetLanguage: userLanguage,
        isTranslated: true
      };
    }

    try {
      // Detect language and translate
      const detectedLanguage = await detectLanguage(originalText);
      const translatedText = await translateText(originalText, userLanguage);
      
      const result: TranslationResult = {
        originalText,
        translatedText,
        detectedLanguage,
        targetLanguage: userLanguage,
        confidence: 0.9
      };

      // Cache the result
      this.cacheTranslation(originalText, userLanguage, result);

      return {
        messageId,
        originalContent: originalText,
        translatedContent: translatedText,
        originalLanguage: detectedLanguage,
        targetLanguage: userLanguage,
        isTranslated: true
      };
    } catch (error) {
      console.error('Translation error for user:', error);
      // Return original text if translation fails
      return {
        messageId,
        originalContent: originalText,
        translatedContent: originalText,
        originalLanguage: adminLanguage,
        targetLanguage: userLanguage,
        isTranslated: false
      };
    }
  }

  // Translate text for admin (user message to English)
  async translateForAdmin(originalText: string, messageId: string): Promise<MessageTranslation> {
    const adminLanguage = this.getAdminLanguage();
    const userLanguage = this.getUserLanguage();

    // If user language is English, no translation needed
    if (userLanguage === adminLanguage) {
      return {
        messageId,
        originalContent: originalText,
        translatedContent: originalText,
        originalLanguage: userLanguage,
        targetLanguage: adminLanguage,
        isTranslated: false
      };
    }

    // Check cache first
    const cached = this.getCachedTranslation(originalText, adminLanguage);
    if (cached) {
      return {
        messageId,
        originalContent: originalText,
        translatedContent: cached.translatedText,
        originalLanguage: cached.detectedLanguage,
        targetLanguage: adminLanguage,
        isTranslated: true
      };
    }

    try {
      // Detect language and translate
      const detectedLanguage = await detectLanguage(originalText);
      const translatedText = await translateText(originalText, adminLanguage);
      
      const result: TranslationResult = {
        originalText,
        translatedText,
        detectedLanguage,
        targetLanguage: adminLanguage,
        confidence: 0.9
      };

      // Cache the result
      this.cacheTranslation(originalText, adminLanguage, result);

      return {
        messageId,
        originalContent: originalText,
        translatedContent: translatedText,
        originalLanguage: detectedLanguage,
        targetLanguage: adminLanguage,
        isTranslated: true
      };
    } catch (error) {
      console.error('Translation error for admin:', error);
      // Return original text if translation fails
      return {
        messageId,
        originalContent: originalText,
        translatedContent: originalText,
        originalLanguage: userLanguage,
        targetLanguage: adminLanguage,
        isTranslated: false
      };
    }
  }

  // Translate message based on user role
  async translateMessage(originalText: string, messageId: string, isAdminMessage: boolean): Promise<MessageTranslation> {
    if (isAdminMessage) {
      return this.translateForUser(originalText, messageId);
    } else {
      return this.translateForAdmin(originalText, messageId);
    }
  }

  // Get language name from code
  getLanguageName(code: string): string {
    const languages: Record<string, string> = {
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
    return languages[code] || code;
  }

  // Clear translation cache
  clearCache(): void {
    this.translationCache.clear();
  }

  // Get cache statistics
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.translationCache.size,
      keys: Array.from(this.translationCache.keys())
    };
  }
}

export const translationService = new TranslationService();
