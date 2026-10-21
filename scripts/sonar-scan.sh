#!/usr/bin/env bash
# ==============================================================================
# SonarQube SAST Execution Script
# ==============================================================================

set -euo pipefail

SONAR_URL="${SONAR_HOST_URL:-http://localhost:9000}"

echo "=========================================================="
echo " SonarQube Static Application Security Testing (SAST)"
echo " Host: ${SONAR_URL}"
echo "=========================================================="

if ! command -v sonar-scanner &> /dev/null; then
    echo "ERROR: sonar-scanner CLI is not installed or not in PATH."
    echo "Download from: https://docs.sonarsource.com/sonarqube/latest/analyzing-source-code/scanners/sonarscanner/"
    exit 1
fi

sonar-scanner \
  -Dsonar.host.url="${SONAR_URL}" \
  ${SONAR_TOKEN:+-Dsonar.login="${SONAR_TOKEN}"}
