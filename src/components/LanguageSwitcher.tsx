import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useScreenSize } from '@/hooks/useScreenSize';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'fi', name: 'Suomi', flag: '🇫🇮' },
  { code: 'sv', name: 'Svenska', flag: '🇸🇪' }
];

export const LanguageSwitcher: React.FC = () => {
  const { changeLanguage, currentLanguage } = useTranslation();
  const { isMobile } = useScreenSize();
  
  const currentLang = languages.find(lang => lang.code === currentLanguage) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size={isMobile ? "sm" : "default"}
          className={`gap-1 ${isMobile ? "px-2" : "gap-2"}`}
        >
          <Globe className={`${isMobile ? "h-3 w-3" : "h-4 w-4"}`} />
          {!isMobile && (
            <>
              <span className="hidden sm:inline">{currentLang.flag} {currentLang.name}</span>
              <span className="sm:hidden">{currentLang.flag}</span>
            </>
          )}
          {isMobile && <span>{currentLang.flag}</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className={`${isMobile ? "w-40" : "w-48"}`}>
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={`flex items-center gap-2 ${
              currentLanguage === lang.code ? 'bg-accent' : ''
            }`}
          >
            <span>{lang.flag}</span>
            <span className={isMobile ? "text-sm" : ""}>{lang.name}</span>
            {currentLanguage === lang.code && (
              <span className="ml-auto text-xs">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
