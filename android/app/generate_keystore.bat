@echo off
echo Generating release keystore for Play Store...
echo.

keytool -genkeypair -v -storetype PKCS12 -keystore release.keystore -alias grocerylist-key -keyalg RSA -keysize 2048 -validity 10000

echo.
echo Keystore generated successfully!
echo IMPORTANT: Save these credentials securely:
echo - Keystore file: release.keystore
echo - Store password: [the password you entered]
echo - Key alias: grocerylist-key
echo - Key password: [the password you entered]
echo.
echo Update your build.gradle file with the actual passwords.
pause
