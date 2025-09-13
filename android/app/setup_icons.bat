@echo off
echo Creating app icon directories and generating basic icons...
echo.

REM Create assets directory if it doesn't exist
if not exist "..\..\..\..\assets" mkdir "..\..\..\..\assets"

REM Create icon directories
if not exist "..\..\..\..\assets\icons" mkdir "..\..\..\..\assets\icons"

echo Creating basic app icon (you should replace this with your custom design)...
echo.

REM Copy existing icons to backup (if any)
if exist "mipmap-mdpi\ic_launcher.png" copy "mipmap-mdpi\ic_launcher.png" "mipmap-mdpi\ic_launcher_backup.png"
if exist "mipmap-hdpi\ic_launcher.png" copy "mipmap-hdpi\ic_launcher.png" "mipmap-hdpi\ic_launcher_backup.png"
if exist "mipmap-xhdpi\ic_launcher.png" copy "mipmap-xhdpi\ic_launcher.png" "mipmap-xhdpi\ic_launcher_backup.png"
if exist "mipmap-xxhdpi\ic_launcher.png" copy "mipmap-xxhdpi\ic_launcher.png" "mipmap-xxhdpi\ic_launcher_backup.png"
if exist "mipmap-xxxhdpi\ic_launcher.png" copy "mipmap-xxxhdpi\ic_launcher.png" "mipmap-xxxhdpi\ic_launcher_backup.png"

echo.
echo Icon directories are ready!
echo.
echo NEXT STEPS:
echo 1. Create your app icon in these sizes:
echo    - 48x48 pixels (mipmap-mdpi)
echo    - 72x72 pixels (mipmap-hdpi)
echo    - 96x96 pixels (mipmap-xhdpi)
echo    - 144x144 pixels (mipmap-xxhdpi)
echo    - 192x192 pixels (mipmap-xxxhdpi)
echo.
echo 2. Also create a 512x512 pixel version for Play Store
echo.
echo 3. Save them as PNG format with transparent background
echo.
echo RECOMMENDED: Use online tools like:
echo - https://appicon.co/
echo - https://makeappicon.com/
echo - https://icon.kitchen/
echo.
pause
