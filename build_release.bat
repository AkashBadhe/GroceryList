@echo off
echo Building signed AAB bundle for Play Store...
echo.

cd android
call gradlew clean
call gradlew bundleRelease

echo.
echo Build completed!
echo Your signed bundle is located at:
echo android/app/build/outputs/bundle/release/app-release.aab
echo.
echo Upload this file to Google Play Console.
pause
