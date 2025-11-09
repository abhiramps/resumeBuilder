#!/usr/bin/env node

/**
 * Setup Verification Script
 * Verifies that all required files and configurations are in place
 */

const fs = require('fs');
const path = require('path');

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
};

const log = {
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
};

console.log('\n🔍 Verifying Backend API Integration Setup...\n');

let hasErrors = false;

// Check required files
const requiredFiles = [
  '.env',
  '.env.example',
  'src/config/api.config.ts',
  'src/config/react-query.config.ts',
  'src/types/api.types.ts',
  'src/utils/axios.ts',
  'src/utils/resumeConverter.ts',
  'docs/API_INTEGRATION.md',
  'docs/QUICK_START.md',
  'docs/PORT_CONFIGURATION.md',
];

console.log('📁 Checking Required Files:\n');
requiredFiles.forEach((file) => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    log.success(file);
  } else {
    log.error(`Missing: ${file}`);
    hasErrors = true;
  }
});

// Check package.json dependencies
console.log('\n📦 Checking Dependencies:\n');
const packageJsonPath = path.join(__dirname, 'package.json');
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const requiredDeps = ['axios', '@tanstack/react-query'];
  
  requiredDeps.forEach((dep) => {
    if (packageJson.dependencies[dep]) {
      log.success(`${dep} (${packageJson.dependencies[dep]})`);
    } else {
      log.error(`Missing dependency: ${dep}`);
      hasErrors = true;
    }
  });
} else {
  log.error('package.json not found');
  hasErrors = true;
}

// Check .env configuration
console.log('\n⚙️  Checking Environment Configuration:\n');
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  if (envContent.includes('VITE_API_URL=http://localhost:3001')) {
    log.success('VITE_API_URL configured correctly (port 3001)');
  } else if (envContent.includes('VITE_API_URL')) {
    log.warning('VITE_API_URL found but may not be set to port 3001');
  } else {
    log.error('VITE_API_URL not configured');
    hasErrors = true;
  }
} else {
  log.error('.env file not found');
  hasErrors = true;
}

// Check vite.config.ts
console.log('\n🔧 Checking Vite Configuration:\n');
const viteConfigPath = path.join(__dirname, 'vite.config.ts');
if (fs.existsSync(viteConfigPath)) {
  const viteConfig = fs.readFileSync(viteConfigPath, 'utf8');
  
  if (viteConfig.includes('port: 3000')) {
    log.success('Frontend port configured (3000)');
  } else {
    log.warning('Frontend port may not be set to 3000');
  }
  
  if (viteConfig.includes("target: 'http://localhost:3001'") || 
      viteConfig.includes('target: "http://localhost:3001"')) {
    log.success('Proxy target configured correctly (3001)');
  } else {
    log.warning('Proxy target may not be set to port 3001');
  }
  
  if (viteConfig.includes("'/api'") || viteConfig.includes('"/api"')) {
    log.success('API proxy path configured');
  } else {
    log.error('API proxy path not configured');
    hasErrors = true;
  }
} else {
  log.error('vite.config.ts not found');
  hasErrors = true;
}

// Check TypeScript files for errors (basic check)
console.log('\n📝 Checking TypeScript Files:\n');
const tsFiles = [
  'src/config/api.config.ts',
  'src/utils/axios.ts',
  'src/types/api.types.ts',
];

tsFiles.forEach((file) => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    // Basic syntax check
    if (content.includes('export') && !content.includes('console.log')) {
      log.success(`${file} looks good`);
    } else {
      log.warning(`${file} may have issues`);
    }
  }
});

// Summary
console.log('\n' + '='.repeat(50));
if (hasErrors) {
  log.error('\n❌ Setup verification failed. Please fix the errors above.\n');
  process.exit(1);
} else {
  log.success('\n✅ Setup verification passed! You\'re ready to start development.\n');
  log.info('Next steps:');
  console.log('  1. Start backend: cd resumeBuilderBackend && npm run dev');
  console.log('  2. Start frontend: cd resumeBuilderFrontend && npm run dev');
  console.log('  3. Open browser: http://localhost:3000\n');
  process.exit(0);
}
