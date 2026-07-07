#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

fail=0

echo "=== PHASE 8: GREP-GATES AUDIT ==="
echo ""

# Gate 1: Keine hardcodierten Farben (außer Test-Dateien)
echo "[1/7] Checking for hardcoded hex colors..."
if grep -rE '#[0-9a-fA-F]{3,8}|:\s*(red|green|blue|black|white)\s*[;!]' src/app --include='*.scss' --include='*.ts' 2>/dev/null | grep -v test | grep -v spec; then
  echo "FAIL: Hardcoded hex colors found in src/app SCSS/TS"
  fail=1
else
  echo "PASS: No hardcoded colors"
fi
echo ""

# Gate 2: Keine ::ng-deep
echo "[2/7] Checking for ::ng-deep..."
if grep -r '::ng-deep' src/app --include='*.scss' --include='*.ts' 2>/dev/null; then
  echo "FAIL: ::ng-deep found in src/"
  fail=1
else
  echo "PASS: No ::ng-deep usage"
fi
echo ""

# Gate 3: Keine Material Icons
echo "[3/7] Checking for Material Icons usage..."
if grep -r 'mat-icon\|MatIcon' src/app --include='*.html' --include='*.ts' 2>/dev/null; then
  echo "FAIL: Material icons found in src/"
  fail=1
else
  echo "PASS: No Material icons"
fi
echo ""

# Gate 4: Keine @angular/material Abhängigkeit
echo "[4/7] Checking for @angular/material dependency..."
if grep -q '@angular/material' package.json 2>/dev/null; then
  echo "WARN: @angular/material still in dependencies (may be ok if only in CDK)"
else
  echo "PASS: @angular/material not in package.json"
fi
echo ""

# Gate 5: Focus-Styles vorhanden
echo "[5/7] Checking for focus-ring styles..."
if grep -rq 'focus-ring' src/styles/ 2>/dev/null; then
  echo "PASS: Focus-ring styles present"
else
  echo "FAIL: No focus-ring styles found in src/styles/"
  fail=1
fi
echo ""

# Gate 6: Responsive Breakpoints definiert
echo "[6/7] Checking for responsive breakpoints..."
if grep -rqE '\$bp-(sm|md|lg|xl)' src/styles/ 2>/dev/null; then
  echo "PASS: Responsive breakpoints defined"
else
  echo "WARN: Expected breakpoint mixins not found"
fi
echo ""

# Gate 7: CSS Custom Properties vorhanden
echo "[7/7] Checking for CSS Custom Properties (design tokens)..."
if grep -rq '--app-' src/styles/ 2>/dev/null; then
  echo "PASS: CSS Custom Properties (design tokens) found"
else
  echo "WARN: Limited CSS Custom Properties found"
fi
echo ""

if [ "$fail" -eq 1 ]; then
  echo "=== RESULT: GATES FAILED ==="
  exit 1
else
  echo "=== RESULT: ALL GATES PASSED ==="
  exit 0
fi
