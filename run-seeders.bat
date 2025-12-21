@echo off
echo ========================================
echo   Running Database Seeders
echo ========================================
echo.
echo This will:
echo - Delete ALL existing data
echo - Insert fresh seed data including:
echo   * Bidang
echo   * Jadwal Piket
echo   * Pengurus
echo   * Agenda Rapat
echo   * Absen Rapat
echo   * Kas
echo   * Event (NEW!)
echo.
echo WARNING: This will DELETE all existing data!
echo.
pause

cd /d "%~dp0"
node seeders/index.js

echo.
echo ========================================
echo   Seeder execution completed
echo ========================================
echo.
pause
