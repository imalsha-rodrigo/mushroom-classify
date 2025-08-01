#!/bin/bash

# Build the frontend
echo "Building frontend..."
cd ..
npm install
npm run build

# Copy the built frontend to backend/dist
echo "Copying frontend to backend..."
cp -r dist backend/

echo "Build complete!" 