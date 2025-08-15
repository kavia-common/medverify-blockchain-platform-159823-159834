#!/bin/bash
cd /home/kavia/workspace/code-generation/medverify-blockchain-platform-159823-159834/medical_prescription_frontend
npm run lint
ESLINT_EXIT_CODE=$?
npm run build
BUILD_EXIT_CODE=$?
if [ $ESLINT_EXIT_CODE -ne 0 ] || [ $BUILD_EXIT_CODE -ne 0 ]; then
   exit 1
fi

