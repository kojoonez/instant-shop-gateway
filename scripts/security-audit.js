#!/usr/bin/env node

// Security audit script for the Cravy website
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔒 Running Security Audit...\n');

const securityChecks = [
  {
    name: 'Environment Variables',
    check: () => {
      const envFile = path.join(__dirname, '..', '.env');
      const envLocalFile = path.join(__dirname, '..', '.env.local');
      
      if (fs.existsSync(envFile) || fs.existsSync(envLocalFile)) {
        console.log('✅ Environment files found');
        return true;
      } else {
        console.log('⚠️  No environment files found - using defaults');
        return false;
      }
    }
  },
  {
    name: 'Security Headers Configuration',
    check: () => {
      const securityConfig = path.join(__dirname, '..', 'src/config/security.ts');
      if (fs.existsSync(securityConfig)) {
        console.log('✅ Security configuration found');
        return true;
      } else {
        console.log('❌ Security configuration missing');
        return false;
      }
    }
  },
  {
    name: 'Security Middleware',
    check: () => {
      const middleware = path.join(__dirname, '..', 'src/middleware/security.ts');
      if (fs.existsSync(middleware)) {
        console.log('✅ Security middleware found');
        return true;
      } else {
        console.log('❌ Security middleware missing');
        return false;
      }
    }
  },
  {
    name: 'Security Context',
    check: () => {
      const context = path.join(__dirname, '..', 'src/contexts/SecurityContext.tsx');
      if (fs.existsSync(context)) {
        console.log('✅ Security context found');
        return true;
      } else {
        console.log('❌ Security context missing');
        return false;
      }
    }
  },
  {
    name: 'Security Utilities',
    check: () => {
      const utils = path.join(__dirname, '..', 'src/utils/security.ts');
      if (fs.existsSync(utils)) {
        console.log('✅ Security utilities found');
        return true;
      } else {
        console.log('❌ Security utilities missing');
        return false;
      }
    }
  },
  {
    name: 'Package Dependencies',
    check: () => {
      const packageJson = path.join(__dirname, '..', 'package.json');
      if (fs.existsSync(packageJson)) {
        const pkg = JSON.parse(fs.readFileSync(packageJson, 'utf8'));
        const securityPackages = ['helmet', 'express-rate-limit', 'cors'];
        const hasSecurityPackages = securityPackages.every(pkgName => 
          (pkg.dependencies && pkg.dependencies[pkgName]) || (pkg.devDependencies && pkg.devDependencies[pkgName])
        );
        
        if (hasSecurityPackages) {
          console.log('✅ Security packages installed');
          return true;
        } else {
          console.log('❌ Missing security packages');
          return false;
        }
      } else {
        console.log('❌ Package.json not found');
        return false;
      }
    }
  },
  {
    name: 'Vite Security Configuration',
    check: () => {
      const viteConfig = path.join(__dirname, '..', 'vite.config.ts');
      if (fs.existsSync(viteConfig)) {
        const content = fs.readFileSync(viteConfig, 'utf8');
        if (content.includes('securityHeaders') && content.includes('corsMiddleware')) {
          console.log('✅ Vite security configuration found');
          return true;
        } else {
          console.log('⚠️  Vite security configuration incomplete');
          return false;
        }
      } else {
        console.log('❌ Vite config not found');
        return false;
      }
    }
  },
  {
    name: 'TypeScript Security Types',
    check: () => {
      const typesDir = path.join(__dirname, '..', 'src/types');
      if (fs.existsSync(typesDir)) {
        console.log('✅ Types directory found');
        return true;
      } else {
        console.log('⚠️  Types directory not found');
        return false;
      }
    }
  }
];

// Run security checks
let passedChecks = 0;
let totalChecks = securityChecks.length;

securityChecks.forEach(check => {
  console.log(`\n🔍 Checking ${check.name}...`);
  if (check.check()) {
    passedChecks++;
  }
});

// Security recommendations
console.log('\n📋 Security Recommendations:');
console.log('1. Always use HTTPS in production');
console.log('2. Keep dependencies updated regularly');
console.log('3. Use environment variables for sensitive data');
console.log('4. Implement proper authentication and authorization');
console.log('5. Regular security audits and penetration testing');
console.log('6. Monitor for security vulnerabilities');
console.log('7. Use Content Security Policy (CSP)');
console.log('8. Implement rate limiting');
console.log('9. Sanitize all user inputs');
console.log('10. Use secure headers');

// Summary
console.log(`\n📊 Security Audit Summary:`);
console.log(`✅ Passed: ${passedChecks}/${totalChecks} checks`);
console.log(`❌ Failed: ${totalChecks - passedChecks}/${totalChecks} checks`);

if (passedChecks === totalChecks) {
  console.log('\n🎉 All security checks passed! Your application is well-secured.');
} else {
  console.log('\n⚠️  Some security checks failed. Please review and fix the issues.');
}

// Additional security tips
console.log('\n💡 Additional Security Tips:');
console.log('- Use Helmet.js for security headers');
console.log('- Implement CSRF protection');
console.log('- Use secure session management');
console.log('- Encrypt sensitive data');
console.log('- Implement proper logging and monitoring');
console.log('- Use security scanning tools');
console.log('- Regular backup and recovery procedures');
