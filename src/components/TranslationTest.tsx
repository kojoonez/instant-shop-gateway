import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Languages, Loader2 } from 'lucide-react';
import { translationService } from '@/services/translationService';

export const TranslationTest: React.FC = () => {
  const [testText, setTestText] = useState('');
  const [translationResult, setTranslationResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testTranslation = async () => {
    if (!testText.trim()) return;

    setLoading(true);
    try {
      // Test user translation (admin message to user language)
      const userTranslation = await translationService.translateForUser(testText, 'test-message-1');
      
      // Test admin translation (user message to English)
      const adminTranslation = await translationService.translateForAdmin(testText, 'test-message-2');

      setTranslationResult({
        user: userTranslation,
        admin: adminTranslation
      });
    } catch (error) {
      console.error('Translation test error:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearTest = () => {
    setTestText('');
    setTranslationResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Languages className="h-5 w-5" />
            <span>Translation Test</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Test Text (try different languages):
            </label>
            <Textarea
              value={testText}
              onChange={(e) => setTestText(e.target.value)}
              placeholder="Enter text in any language to test translation..."
              className="min-h-[100px]"
            />
          </div>

          <div className="flex space-x-2">
            <Button 
              onClick={testTranslation} 
              disabled={!testText.trim() || loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <Languages className="h-4 w-4 mr-2" />
                  Test Translation
                </>
              )}
            </Button>
            <Button variant="outline" onClick={clearTest}>
              Clear
            </Button>
          </div>

          {translationResult && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* User Translation */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">User Translation (Admin → User Language)</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <Badge variant="outline" className="mb-2">
                        Original: {translationResult.user.originalLanguage}
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        {translationResult.user.originalContent}
                      </p>
                    </div>
                    <div>
                      <Badge variant="outline" className="mb-2">
                        Translated: {translationResult.user.targetLanguage}
                      </Badge>
                      <p className="text-sm">
                        {translationResult.user.translatedContent}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <Languages className="h-3 w-3" />
                      <span>
                        {translationResult.user.isTranslated ? 'Translated' : 'No translation needed'}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Admin Translation */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Admin Translation (User → English)</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <Badge variant="outline" className="mb-2">
                        Original: {translationResult.admin.originalLanguage}
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        {translationResult.admin.originalContent}
                      </p>
                    </div>
                    <div>
                      <Badge variant="outline" className="mb-2">
                        Translated: {translationResult.admin.targetLanguage}
                      </Badge>
                      <p className="text-sm">
                        {translationResult.admin.translatedContent}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <Languages className="h-3 w-3" />
                      <span>
                        {translationResult.admin.isTranslated ? 'Translated' : 'No translation needed'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="text-xs text-muted-foreground">
                <p><strong>Note:</strong> This is a demo translation system. In production, you would use Google Translate API or similar service for accurate translations.</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
