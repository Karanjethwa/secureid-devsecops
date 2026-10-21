@echo off
REM ==============================================================================
REM Aqua Trivy Container Vulnerability Scan Script (Windows CMD)
REM ==============================================================================

set IMAGE_NAME=%1
if "%IMAGE_NAME%"=="" set IMAGE_NAME=secureid:latest

if not exist reports mkdir reports

echo ==========================================================
echo  Aqua Trivy Container Vulnerability Scan: %IMAGE_NAME%
echo ==========================================================

where trivy >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Trivy CLI not found in PATH.
    echo Install via: winget install AquaSecurity.Trivy
    exit /b 1
)

echo [1/2] Generating JSON vulnerability report...
trivy image --scanners vuln --format json --output reports\trivy-image-report.json %IMAGE_NAME%

echo [2/2] Evaluating Critical and High findings...
trivy image --scanners vuln --severity CRITICAL,HIGH %IMAGE_NAME%

echo [SUCCESS] Scan complete. Output saved in reports\trivy-image-report.json
