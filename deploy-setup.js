#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Job Tracker Deployment Setup Checker\n');

// Check backend configuration
console.log('📋 Checking Backend Configuration...');
const backendPackagePath = path.join(__dirname, 'backend', 'package.json');
const backendServerPath = path.join(__dirname, 'backend', 'server.js');

if (fs.existsSync(backendPackagePath)) {
  const backendPackage = JSON.parse(fs.readFileSync(backendPackagePath, 'utf8'));
  console.log('✅ Backend package.json found');
  console.log(`   - Name: ${backendPackage.name}`);
  console.log(`   - Main: ${backendPackage.main}`);
  console.log(`   - Start script: ${backendPackage.scripts.start}`);
  
  // Check dependencies
  const requiredDeps = ['express', 'mongoose', 'cors', 'dotenv', 'jsonwebtoken'];
  const missingDeps = requiredDeps.filter(dep => !backendPackage.dependencies[dep]);
  
  if (missingDeps.length === 0) {
    console.log('✅ All required backend dependencies found');
  } else {
    console.log('❌ Missing backend dependencies:', missingDeps.join(', '));
  }
} else {
  console.log('❌ Backend package.json not found');
}

if (fs.existsSync(backendServerPath)) {
  console.log('✅ Backend server.js found');
} else {
  console.log('❌ Backend server.js not found');
}

// Check frontend configuration
console.log('\n📋 Checking Frontend Configuration...');
const frontendPackagePath = path.join(__dirname, 'frontend', 'package.json');
const frontendVercelPath = path.join(__dirname, 'frontend', 'vercel.json');

if (fs.existsSync(frontendPackagePath)) {
  const frontendPackage = JSON.parse(fs.readFileSync(frontendPackagePath, 'utf8'));
  console.log('✅ Frontend package.json found');
  console.log(`   - Name: ${frontendPackage.name}`);
  console.log(`   - Build script: ${frontendPackage.scripts.build}`);
  
  // Check dependencies
  const requiredDeps = ['react', 'react-dom', 'axios'];
  const missingDeps = requiredDeps.filter(dep => !frontendPackage.dependencies[dep]);
  
  if (missingDeps.length === 0) {
    console.log('✅ All required frontend dependencies found');
  } else {
    console.log('❌ Missing frontend dependencies:', missingDeps.join(', '));
  }
} else {
  console.log('❌ Frontend package.json not found');
}

if (fs.existsSync(frontendVercelPath)) {
  console.log('✅ Frontend vercel.json found');
} else {
  console.log('❌ Frontend vercel.json not found');
}

// Check environment files
console.log('\n📋 Checking Environment Configuration...');
const backendEnvExample = path.join(__dirname, 'backend', 'env.example');
const frontendEnvExample = path.join(__dirname, 'frontend', '.env.example');

if (fs.existsSync(backendEnvExample)) {
  console.log('✅ Backend env.example found');
} else {
  console.log('❌ Backend env.example not found');
}

// Deployment checklist
console.log('\n📝 Deployment Checklist:');
console.log('1. ✅ Push code to GitHub repository');
console.log('2. 🔄 Set up MongoDB Atlas database');
console.log('3. 🔄 Deploy backend to Render');
console.log('4. 🔄 Deploy frontend to Vercel');
console.log('5. 🔄 Configure environment variables');
console.log('6. 🔄 Test the application');

console.log('\n📚 Next Steps:');
console.log('1. Read DEPLOYMENT_GUIDE.md for detailed instructions');
console.log('2. Set up MongoDB Atlas account');
console.log('3. Create Render and Vercel accounts');
console.log('4. Follow the deployment guide step by step');

console.log('\n🎉 Setup check completed!'); 