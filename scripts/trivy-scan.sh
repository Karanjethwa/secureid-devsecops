#!/usr/bin/env bash
# ==============================================================================
# Aqua Trivy Container Vulnerability Scan Script (Linux / macOS / CI)
# ==============================================================================

set -euo pipefail

IMAGE_NAME="${1:-secureid:latest}"
REPORT_DIR="reports"
mkdir -p "${REPORT_DIR}"

echo "=========================================================="
echo " Aqua Trivy Container Vulnerability Scan: ${IMAGE_NAME}"
echo "=========================================================="

if ! command -v trivy &> /dev/null; then
    echo "ERROR: Trivy CLI is not installed or not in PATH."
    echo "Install via: sudo apt-get install trivy  or  brew install trivy"
    exit 1
fi

echo "[1/2] Generating JSON vulnerability report..."
trivy image --scanners vuln --format json --output "${REPORT_DIR}/trivy-image-report.json" "${IMAGE_NAME}"

echo "[2/2] Generating human-readable console output..."
trivy image --scanners vuln --severity CRITICAL,HIGH "${IMAGE_NAME}"

echo "SUCCESS: Trivy scan completed. Report saved to ${REPORT_DIR}/trivy-image-report.json"
