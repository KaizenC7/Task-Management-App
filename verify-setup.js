#!/usr/bin/env node

/**
 * Task Management App - Startup Verification
 * Run this to verify everything is set up correctly
 */

const fs = require('fs');
const path = require('path');

console.log('\n🔍 Task Management App - Setup Verification\n');

const checks = [
  {
    name: 'Frontend dependencies',
    check: () => fs.existsSync('package.json') && fs.existsSync('node_modules'),
    fix: 'Run: npm install'
  },
  {
    name: 'Backend dependencies',
    check: () => fs.existsSync('server/package.json') && fs.existsSync('server/node_modules'),
    fix: 'Run: cd server && npm install'
  },
  {
    name: 'Environment file',
    check: () => fs.existsSync('server/.env'),
    fix: 'Run: copy server/.env.example server/.env'
  },
  {
    name: 'Tailwind config',
    check: () => fs.existsSync('tailwind.config.js'),
    fix: '⚠️  Critical file missing'
  },
  {
    name: 'Components directory',
    check: () => fs.existsSync('src/components'),
    fix: 'Create src/components directory'
  },
  {
    name: 'Services directory',
    check: () => fs.existsSync('src/services'),
    fix: 'Create src/services directory'
  },
  {
    name: 'API service file',
    check: () => fs.existsSync('src/services/api.js'),
    fix: 'Create src/services/api.js'
  },
  {
    name: 'Backend server file',
    check: () => fs.existsSync('server/server.js'),
    fix: 'Create server/server.js'
  }
];

let passed = 0;
let failed = 0;

checks.forEach(({ name, check, fix }) => {
  if (check()) {
    console.log(`✅ ${name}`);
    passed++;
  } else {
    console.log(`❌ ${name}`);
    console.log(`   → ${fix}\n`);
    failed++;
  }
});

console.log(`\n${passed}/${checks.length} checks passed\n`);

if (failed === 0) {
  console.log('🎉 Everything looks good! Ready to start.\n');
  console.log('Start the app:\n');
  console.log('Terminal 1 (Backend):');
  console.log('  cd server && npm start\n');
  console.log('Terminal 2 (Frontend):');
  console.log('  npm run dev\n');
  console.log('Visit: http://localhost:5173\n');
} else {
  console.log(`⚠️  ${failed} issue(s) to fix before starting\n`);
}
