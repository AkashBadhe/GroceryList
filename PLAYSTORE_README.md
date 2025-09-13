# Smart Grocery List - Play Store #### 3. Create App Icons
```bash
# Run the icon setup script
cd android/app
setup_icons.bat

# Then convert the SVG to PNG (requires ImageMagick)
convert_icons.bat
```

**Icon Sizes Required:**
- `mipmap-mdpi/ic_launcher.png` (48×48)
- `mipmap-hdpi/ic_launcher.png` (72×72)
- `mipmap-xhdpi/ic_launcher.png` (96×96)
- `mipmap-xxhdpi/ic_launcher.png` (144×144)
- `mipmap-xxxhdpi/ic_launcher.png` (192×192)
- `assets/icons/ic_launcher_512.png` (512×512) - for Play Store

**✅ Adaptive Icons Created:**
- Background color: Green (#4CAF50)
- Foreground icon: Grocery cart vector
- XML configuration: Ready for Android 8.0+

**Online Icon Generators:**
- [App Icon Generator](https://appicon.co/) - Upload SVG, get all sizes
- [MakeAppIcon](https://makeappicon.com/) - Android icon generator
- [Icon Kitchen](https://icon.kitchen/) - Professional icon generatoring Guide

## 📱 App Overview
A smart grocery list app with regional language support and offline functionality.

## 🚀 Play Store Publishing Checklist

### ✅ Completed Setup
- [x] App metadata configured (app.json, package.json)
- [x] Android build configuration updated
- [x] Release signing configuration added
- [x] Android manifest optimized
- [x] Build scripts created

### 🔧 Next Steps

#### 1. Generate Release Keystore
```bash
# Run the keystore generation script
cd android/app
generate_keystore.bat
```

**IMPORTANT:** Save your keystore credentials securely!

#### 2. Update Build Configuration
Edit `android/app/build.gradle` and replace the placeholder passwords:
```gradle
release {
    storePassword 'YOUR_ACTUAL_STORE_PASSWORD'
    keyPassword 'YOUR_ACTUAL_KEY_PASSWORD'
}
```

#### 3. Create App Icons
Create icons in these sizes and place them in `android/app/src/main/res/`:
- `mipmap-mdpi/ic_launcher.png` (48×48)
- `mipmap-hdpi/ic_launcher.png` (72×72)
- `mipmap-xhdpi/ic_launcher.png` (96×96)
- `mipmap-xxhdpi/ic_launcher.png` (144×144)
- `mipmap-xxxhdpi/ic_launcher.png` (192×192)

#### 4. Test Build Configuration
```bash
# Test the build after fixing manifest conflicts
test_build_fixed.bat
```

**✅ Manifest Merger Fixed:**
- Added `tools:replace="android:usesCleartextTraffic"` to resolve debug/release conflict
- Debug build uses cleartext traffic (for development)
- Release build uses secure HTTPS only (for production)

**Build Outputs:**
- Debug APK: `android/app/build/outputs/apk/debug/app-debug.apk`
- Release APK: `android/app/build/outputs/apk/release/app-release.apk`
- Release AAB: `android/app/build/outputs/bundle/release/app-release.aab`

#### 5. Google Play Console Setup
1. Create Google Play Console account ($25 fee)
2. Create new app
3. Upload `app-release.aab` bundle
4. Fill store listing:
   - App name: Smart Grocery List
   - Short description: Smart grocery shopping with regional language support
   - Full description: [Write detailed description]
   - Screenshots: Phone (1080×1920), Tablet (1200×1920)
   - Feature graphic: 1024×500
   - Icon: 512×512

#### 6. Privacy Policy
Create a privacy policy (required for Play Store):
- Since app uses AsyncStorage for local data only
- No user data collection
- Can use a simple privacy policy template

## 📋 Store Listing Information

**App Details:**
- Title: Smart Grocery List
- Package Name: com.akashbadhe.grocerylist
- Version: 1.0.0
- Min Android: API 24 (Android 7.0)

**Content Rating:** Everyone

**Pricing:** Free

## 🔗 Useful Links
- [Google Play Console](https://play.google.com/console/)
- [React Native Signed APK Guide](https://reactnative.dev/docs/signed-apk-android)
- [Play Store Icon Guidelines](https://developer.android.com/google-play/resources/icon-design-specifications)

## 📞 Support
For issues with Play Store publishing, check:
1. Google Play Console Help Center
2. React Native documentation
3. Android Developer documentation
