@echo off
echo Converting SVG icon to required PNG sizes...
echo.

REM Check if ImageMagick is installed
magick -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ImageMagick not found. Please install it from: https://imagemagick.org/
    echo Or use online tools to convert the SVG to PNG sizes.
    echo.
    goto :online_tools
)

REM Create PNG icons in different sizes
echo Creating 48x48 icon (mipmap-mdpi)...
magick "..\..\..\..\assets\icons\app_icon.svg" -resize 48x48 "mipmap-mdpi\ic_launcher.png"

echo Creating 72x72 icon (mipmap-hdpi)...
magick "..\..\..\..\assets\icons\app_icon.svg" -resize 72x72 "mipmap-hdpi\ic_launcher.png"

echo Creating 96x96 icon (mipmap-xhdpi)...
magick "..\..\..\..\assets\icons\app_icon.svg" -resize 96x96 "mipmap-xhdpi\ic_launcher.png"

echo Creating 144x144 icon (mipmap-xxhdpi)...
magick "..\..\..\..\assets\icons\app_icon.svg" -resize 144x144 "mipmap-xxhdpi\ic_launcher.png"

echo Creating 192x192 icon (mipmap-xxxhdpi)...
magick "..\..\..\..\assets\icons\app_icon.svg" -resize 192x192 "mipmap-xxxhdpi\ic_launcher.png"

echo Creating 512x512 icon for Play Store...
magick "..\..\..\..\assets\icons\app_icon.svg" -resize 512x512 "..\..\..\..\assets\icons\ic_launcher_512.png"

echo.
echo All icons created successfully!
echo.
goto :end

:online_tools
echo ONLINE CONVERSION TOOLS:
echo.
echo 1. App Icon Generator: https://appicon.co/
echo    - Upload the SVG file
echo    - Select Android platform
echo    - Download the generated icons
echo.
echo 2. MakeAppIcon: https://makeappicon.com/
echo    - Upload SVG
echo    - Generate Android icons
echo.
echo 3. Icon Kitchen: https://icon.kitchen/
echo    - Upload SVG
echo    - Export Android icons
echo.
echo MANUAL PROCESS:
echo 1. Open the SVG in any image editor (Photoshop, GIMP, Inkscape)
echo 2. Resize to required dimensions
echo 3. Export as PNG with transparent background
echo 4. Save to corresponding mipmap folders
echo.

:end
echo Icon setup complete!
pause
