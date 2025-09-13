@echo off
echo Testing build fix...
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
        echo 🎉 Ready for Play Store upload!
    ) else (
        echo.
        echo ❌ Release build failed!
        echo Check the error messages above.
    )
) else (
    echo.
    echo ❌ Debug build still failing!
    echo Check the error messages above.
)

echo.
pause
