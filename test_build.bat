@echo off
echo Testing release build configuration...
echo.

cd android
call gradlew clean
call gradlew assembleDebug

if %errorlevel% equ 0 (
    echo.
    echo ✅ Debug build successful!
    echo.
    echo Now testing release build...
    call gradlew assembleRelease
    if %errorlevel% equ 0 (
        echo.
        echo ✅ Release build successful!
        echo.
        echo Your APK is ready at:
        echo android/app/build/outputs/apk/release/app-release.apk
        echo.
        echo Test this APK on a device before uploading to Play Store.
    ) else (
        echo.
        echo ❌ Release build failed!
        echo Check the error messages above.
        echo Common issues:
        echo - Keystore not found or passwords incorrect
        echo - Missing app icons
        echo - Build configuration errors
    )
) else (
    echo.
    echo ❌ Debug build failed!
    echo Fix debug build issues first.
)

echo.
pause
