@echo off
echo ================================================
echo   PLAY STORE ICON CREATION GUIDE
echo ================================================
echo.
echo Your app is ready for Play Store! Just need icons.
echo.
echo STEP 1: Create your app icon using one of these methods:
echo.
echo METHOD A - Online Icon Generator (Recommended):
echo -----------------------------------------------
echo 1. Go to: https://appicon.co/
echo 2. Upload: assets\icons\app_icon.svg
echo 3. Select: Android platform
echo 4. Download the ZIP file
echo 5. Extract to: android\app\src\main\res\
echo.
echo METHOD B - Manual Creation:
echo --------------------------
echo 1. Open assets\icons\app_icon.svg in any image editor
echo 2. Resize to required sizes:
echo    - 48x48 pixels (mipmap-mdpi)
echo    - 72x72 pixels (mipmap-hdpi)
echo    - 96x96 pixels (mipmap-xhdpi)
echo    - 144x144 pixels (mipmap-xxhdpi)
echo    - 192x192 pixels (mipmap-xxxhdpi)
echo 3. Export as PNG with transparent background
echo 4. Save to corresponding mipmap folders
echo.
echo METHOD C - Use Default Icons:
echo -----------------------------
echo 1. Copy from React Native template (if available)
echo 2. Or use any PNG icon you have
echo.
echo STEP 2: Test the build
echo ----------------------
echo After creating icons, run:
echo build_release.bat
echo.
echo STEP 3: Upload to Play Store
echo ----------------------------
echo 1. Go to Google Play Console
echo 2. Create new app
echo 3. Upload the generated app-release.aab file
echo 4. Fill out store listing
echo.
echo ================================================
echo Current Status: ✅ Build system ready
echo Missing: 🎨 App icons only
echo ================================================
echo.
pause
