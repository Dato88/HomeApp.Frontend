#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

fail=0

if grep -rE '#[0-9a-fA-F]{3,8}|:\s*(red|green)\b' src/app --include='*.scss' 2>/dev/null; then
  echo "grep-gate failed: hardcoded colors in src/app SCSS"
  fail=1
fi

if grep -rE 'mat-|@angular/material' src/ 2>/dev/null; then
  echo "grep-gate failed: Material usage in src/"
  fail=1
fi

if grep -r '::ng-deep' src/ 2>/dev/null; then
  echo "grep-gate failed: ::ng-deep in src/"
  fail=1
fi

exit "$fail"
