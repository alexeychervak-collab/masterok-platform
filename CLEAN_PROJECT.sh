#!/usr/bin/env bash
set -euo pipefail

echo "Cleaning MasterOK workspace..."

rm -rf landing/node_modules landing/.next
rm -rf backend/venv backend/__pycache__
rm -rf mobile/build

echo "Done."
echo "Next steps:"
echo "  (backend)  cd backend && python3 -m venv venv && source venv/bin/activate && pip install -r requirements.txt"
echo "  (landing)  cd landing && npm ci"
echo "  (mobile)   cd mobile && flutter pub get"




