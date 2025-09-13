@echo off
echo Generating Android app icons from your PNG file...
echo.

set SOURCE_FILE=..\..\..\..\assets\icons\app_icon.png

REM Check if source file exists
if not exist "%SOURCE_FILE%" (
    echo ERROR: Source file not found: %SOURCE_FILE%
    echo Please ensure your app_icon.png is in assets/icons/ folder
    pause
    exit /b 1
)

echo Found source file: %SOURCE_FILE%
echo.

REM Check if ImageMagick is available
magick -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ImageMagick not found!
    echo.
    echo Please install ImageMagick from: https://imagemagick.org/
    echo Or use online tools to resize your PNG:
    echo.
    echo 1. App Icon Generator: https://appicon.co/
    echo    - Upload your PNG file
    echo    - Select Android platform
    echo    - Download all sizes
    echo.
    echo 2. Resize manually in any image editor
    echo.
    goto :manual_instructions
)

echo ImageMagick found! Generating icons...
echo.

REM Create backup of existing icons
if exist "mipmap-mdpi\ic_launcher.png" (
    echo Creating backups of existing icons...
    copy "mipmap-mdpi\ic_launcher.png" "mipmap-mdpi\ic_launcher_backup.png" >nul
    copy "mipmap-hdpi\ic_launcher.png" "mipmap-hdpi\ic_launcher_backup.png" >nul
    copy "mipmap-xhdpi\ic_launcher.png" "mipmap-xhdpi\ic_launcher_backup.png" >nul
    copy "mipmap-xxhdpi\ic_launcher.png" "mipmap-xxhdpi\ic_launcher_backup.png" >nul
    copy "mipmap-xxxhdpi\ic_launcher.png" "mipmap-xxxhdpi\ic_launcher_backup.png" >nul
)

REM Generate icons for each density
echo Generating 48x48 icon (mipmap-mdpi)...
magick "%SOURCE_FILE%" -resize 48x48 "mipmap-mdpi\ic_launcher.png"
magick "%SOURCE_FILE%" -resize 48x48 "mipmap-mdpi\ic_launcher_round.png"

echo Generating 72x72 icon (mipmap-hdpi)...
magick "%SOURCE_FILE%" -resize 72x72 "mipmap-hdpi\ic_launcher.png"
magick "%SOURCE_FILE%" -resize 72x72 "mipmap-hdpi\ic_launcher_round.png"

echo Generating 96x96 icon (mipmap-xhdpi)...
magick "%SOURCE_FILE%" -resize 96x96 "mipmap-xhdpi\ic_launcher.png"
magick "%SOURCE_FILE%" -resize 96x96 "mipmap-xhdpi\ic_launcher_round.png"

echo Generating 144x144 icon (mipmap-xxhdpi)...
magick "%SOURCE_FILE%" -resize 144x144 "mipmap-xxhdpi\ic_launcher.png"
magick "%SOURCE_FILE%" -resize 144x144 "mipmap-xxhdpi\ic_launcher_round.png"

echo Generating 192x192 icon (mipmap-xxxhdpi)...
magick "%SOURCE_FILE%" -resize 192x192 "mipmap-xxxhdpi\ic_launcher.png"
magick "%SOURCE_FILE%" -resize 192x192 "mipmap-xxxhdpi\ic_launcher_round.png"

echo Generating 512x512 icon for Play Store...
magick "%SOURCE_FILE%" -resize 512x512 "..\..\..\..\assets\icons\ic_launcher_512.png"

echo.
echo ✅ All icons generated successfully!
echo.
echo Generated files:
echo - mipmap-mdpi/ic_launcher.png (48x48)
echo - mipmap-hdpi/ic_launcher.png (72x72)
echo - mipmap-xhdpi/ic_launcher.png (96x96)
echo - mipmap-xxhdpi/ic_launcher.png (144x144)
echo - mipmap-xxxhdpi/ic_launcher.png (192x192)
echo - assets/icons/ic_launcher_512.png (512x512)
echo.
echo Also generated round versions for Android 7.1+
echo.
goto :test_build

:manual_instructions
echo MANUAL ICON GENERATION:
echo.
echo Since ImageMagick is not installed, please resize manually:
echo.
echo 1. Open your PNG file in any image editor (Photoshop, GIMP, Paint.NET)
echo 2. Resize to these dimensions and save as PNG:
echo.
echo    mipmap-mdpi/ic_launcher.png     -> 48x48 pixels
echo    mipmap-hdpi/ic_launcher.png     -> 72x72 pixels
echo    mipmap-xhdpi/ic_launcher.png    -> 96x96 pixels
echo    mipmap-xxhdpi/ic_launcher.png   -> 144x144 pixels
echo    mipmap-xxxhdpi/ic_launcher.png  -> 192x192 pixels
echo    assets/icons/ic_launcher_512.png -> 512x512 pixels (Play Store)
echo.
echo 3. Also create round versions by copying the files and renaming:
echo    ic_launcher_round.png (same sizes)
echo.
echo 4. Ensure transparent background for best results
echo.

:test_build
echo.
echo NEXT STEP: Test your build!
echo Run: test_build_fixed.bat
echo.
pause
