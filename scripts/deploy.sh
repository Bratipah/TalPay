#!/bin/bash

# TalPay Blockchain Payroll System Deployment Script

echo "🚀 Starting TalPay Blockchain Payroll System deployment..."

# Check if dfx is installed
if ! command -v dfx &> /dev/null; then
    echo "❌ dfx is not installed. Please install the DFINITY SDK first."
    echo "Visit: https://internetcomputer.org/docs/current/developer-docs/setup/install/"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Start local replica if not running
echo "🔧 Starting local Internet Computer replica..."
dfx start --background --clean

# Deploy Internet Identity canister for local development
echo "🆔 Deploying Internet Identity canister..."
dfx deploy internet_identity

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the frontend
echo "🏗️  Building frontend..."
npm run build

# Deploy the payroll backend canister
echo "🔐 Deploying payroll backend canister..."
dfx deploy payroll_backend

# Deploy the frontend canister
echo "🌐 Deploying frontend canister..."
dfx deploy payroll_frontend

# Get canister IDs
PAYROLL_BACKEND_ID=$(dfx canister id payroll_backend)
PAYROLL_FRONTEND_ID=$(dfx canister id payroll_frontend)
INTERNET_IDENTITY_ID=$(dfx canister id internet_identity)

echo "✅ Deployment completed successfully!"
echo ""
echo "📋 Canister Information:"
echo "   TalPay Backend: $PAYROLL_BACKEND_ID"
echo "   Frontend: $PAYROLL_FRONTEND_ID"
echo "   Internet Identity: $INTERNET_IDENTITY_ID"
echo ""
echo "🌐 Access your application at:"
echo "   Local: http://localhost:4943/?canisterId=$PAYROLL_FRONTEND_ID"
echo "   IC Network: https://$PAYROLL_FRONTEND_ID.ic0.app"
echo ""
echo "🔧 Environment Variables for .env.local:"
echo "NEXT_PUBLIC_TALPAY_CANISTER_ID=$PAYROLL_BACKEND_ID"
echo "NEXT_PUBLIC_INTERNET_IDENTITY_CANISTER_ID=$INTERNET_IDENTITY_ID"
echo "NEXT_PUBLIC_DFX_NETWORK=local"
echo ""
echo "📚 Next Steps:"
echo "1. Update your .env.local file with the canister IDs above"
echo "2. Configure your Reown project ID in the environment variables"
echo "3. Test the application by connecting with Internet Identity"
echo "4. Add admin principals to the smart contract"
echo ""
echo "🎉 Welcome to TalPay - Next-Generation Blockchain Payroll!"
