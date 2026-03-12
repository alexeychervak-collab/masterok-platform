#!/bin/bash

echo "========================================"
echo "📱 MasterOK Mobile App - Build APK"
echo "========================================"
echo ""

# Check Flutter
echo "[1/6] Checking Flutter installation..."
if ! command -v flutter &> /dev/null; then
    echo "❌ Flutter not found in PATH!"
    echo "Install Flutter: https://docs.flutter.dev/get-started/install"
    exit 1
fi
echo "✅ Flutter found"

# Check environment
echo ""
echo "[2/6] Checking development environment..."
flutter doctor
echo ""
read -p "Press Enter to continue..."

# Clean
echo "[3/6] Cleaning previous build..."
flutter clean
echo "✅ Clean completed"

# Install dependencies
echo ""
echo "[4/6] Installing dependencies..."
flutter pub get
if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies!"
    exit 1
fi
echo "✅ Dependencies installed"

# Select build type
echo ""
echo "[5/6] Select build type:"
echo ""
echo "1. Debug APK (for testing)"
echo "2. Release APK (for production)"
echo "3. Split APKs (optimized)"
echo "4. App Bundle (for Google Play)"
echo ""
read -p "Enter choice (1-4): " choice

case $choice in
    1)
        echo ""
        echo "🔨 Building Debug APK..."
        flutter build apk --debug
        output="build/app/outputs/flutter-apk/app-debug.apk"
        ;;
    2)
        echo ""
        echo "🔨 Building Release APK..."
        flutter build apk --release
        output="build/app/outputs/flutter-apk/app-release.apk"
        ;;
    3)
        echo ""
        echo "🔨 Building Split APKs..."
        flutter build apk --split-per-abi --release
        output="build/app/outputs/flutter-apk/"
        ;;
    4)
        echo ""
        echo "🔨 Building App Bundle..."
        flutter build appbundle --release
        output="build/app/outputs/bundle/release/app-release.aab"
        ;;
    *)
        echo "Invalid choice!"
        exit 1
        ;;
esac

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Build failed!"
    echo ""
    echo "Try:"
    echo "1. flutter clean"
    echo "2. flutter pub get"
    echo "3. Check android/local.properties"
    echo ""
    exit 1
fi

echo ""
echo "========================================"
echo "✅ Build completed successfully!"
echo "========================================"
echo ""
echo "📦 APK location:"
echo "$output"
echo ""
ls -lh "$output" 2>/dev/null

echo ""
read -p "[6/6] Install on connected device? (y/n): " install

if [ "$install" = "y" ] || [ "$install" = "Y" ]; then
    echo ""
    echo "🔌 Checking connected devices..."
    adb devices
    echo ""
    echo "📲 Installing APK..."
    
    if [ $choice -eq 1 ] || [ $choice -eq 2 ]; then
        adb install -r "$output"
        if [ $? -eq 0 ]; then
            echo "✅ Installation completed!"
        else
            echo "❌ Installation failed. Make sure device is connected."
        fi
    else
        echo "Open directory: $output"
        open "$output" 2>/dev/null || xdg-open "$output" 2>/dev/null
    fi
fi

echo ""
echo "🎉 Done!"
echo ""



