import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  initializeSecurity, 
  sanitizeInput, 
  isValidEmail, 
  isValidURL,
  clientRateLimiter 
} from '@/utils/security';

interface SecurityContextType {
  isSecureContext: boolean;
  sanitizeInput: (input: string) => string;
  isValidEmail: (email: string) => boolean;
  isValidURL: (url: string) => boolean;
  isRateLimited: (key: string) => boolean;
  securityStatus: {
    https: boolean;
    secureContext: boolean;
    userAgent: string;
    timestamp: number;
  };
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export const useSecurity = () => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
};

interface SecurityProviderProps {
  children: React.ReactNode;
}

export const SecurityProvider: React.FC<SecurityProviderProps> = ({ children }) => {
  const [isSecureContext, setIsSecureContext] = useState(false);
  const [securityStatus, setSecurityStatus] = useState({
    https: false,
    secureContext: false,
    userAgent: '',
    timestamp: Date.now()
  });

  useEffect(() => {
    // Initialize security measures
    initializeSecurity();
    
    // Check security context
    const secure = window.isSecureContext;
    setIsSecureContext(secure);
    
    // Update security status
    setSecurityStatus({
      https: window.location.protocol === 'https:',
      secureContext: secure,
      userAgent: navigator.userAgent,
      timestamp: Date.now()
    });

    // Log security warnings in development
    if (process.env.NODE_ENV === 'development') {
      if (!secure) {
        console.warn('⚠️ Running in non-secure context. Some features may not work properly.');
      }
      if (window.location.protocol !== 'https:') {
        console.warn('⚠️ Not using HTTPS. Consider using HTTPS in production.');
      }
    }
  }, []);

  const isRateLimited = (key: string): boolean => {
    return !clientRateLimiter.isAllowed(key);
  };

  const value: SecurityContextType = {
    isSecureContext,
    sanitizeInput,
    isValidEmail,
    isValidURL,
    isRateLimited,
    securityStatus
  };

  return (
    <SecurityContext.Provider value={value}>
      {children}
    </SecurityContext.Provider>
  );
};

// Security-aware input component
interface SecureInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'email' | 'url' | 'password';
  className?: string;
  maxLength?: number;
}

export const SecureInput: React.FC<SecureInputProps> = ({
  value,
  onChange,
  placeholder,
  type = 'text',
  className = '',
  maxLength = 1000
}) => {
  const { sanitizeInput, isValidEmail, isValidURL } = useSecurity();
  const [error, setError] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const sanitizedValue = sanitizeInput(rawValue);
    
    // Validate based on input type
    let isValid = true;
    let errorMessage = '';

    if (type === 'email' && sanitizedValue && !isValidEmail(sanitizedValue)) {
      isValid = false;
      errorMessage = 'Please enter a valid email address';
    } else if (type === 'url' && sanitizedValue && !isValidURL(sanitizedValue)) {
      isValid = false;
      errorMessage = 'Please enter a valid URL';
    }

    setError(errorMessage);
    onChange(sanitizedValue);
  };

  return (
    <div className="space-y-1">
      <input
        type={type}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${className}`}
        maxLength={maxLength}
        autoComplete={type === 'password' ? 'new-password' : 'off'}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

// Security status indicator component
export const SecurityStatus: React.FC = () => {
  const { securityStatus, isSecureContext } = useSecurity();

  if (process.env.NODE_ENV === 'production') {
    return null; // Don't show in production
  }

  return (
    <div className="fixed bottom-4 left-4 bg-black/80 text-white p-2 rounded text-xs space-y-1">
      <div className={`flex items-center gap-1 ${isSecureContext ? 'text-green-400' : 'text-red-400'}`}>
        <div className={`w-2 h-2 rounded-full ${isSecureContext ? 'bg-green-400' : 'bg-red-400'}`} />
        {isSecureContext ? 'Secure Context' : 'Non-Secure Context'}
      </div>
      <div className={`flex items-center gap-1 ${securityStatus.https ? 'text-green-400' : 'text-yellow-400'}`}>
        <div className={`w-2 h-2 rounded-full ${securityStatus.https ? 'bg-green-400' : 'bg-yellow-400'}`} />
        {securityStatus.https ? 'HTTPS' : 'HTTP'}
      </div>
    </div>
  );
};
